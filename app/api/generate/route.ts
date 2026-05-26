import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const parseArr = (s: string | null): string[] => {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

const GENDER_LABEL: Record<string, string> = {
  woman: "woman",
  man: "man",
  nonbinary: "non-binary person",
};

// Build a short natural-language style brief from the user's saved profile.
async function getStyleContext(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return "";

  const p = await prisma.userProfile.findUnique({ where: { userId: session.user.id } });
  if (!p) return "";

  const parts: string[] = [];
  if (p.gender && GENDER_LABEL[p.gender]) parts.push(`is a ${GENDER_LABEL[p.gender]}`);
  if (p.shopFor) parts.push(`shops ${p.shopFor}`);
  const styles = parseArr(p.styles);
  if (styles.length) parts.push(`style leans ${styles.join(", ")}`);
  if (p.vibe) parts.push(p.vibe === "trendy" ? "prefers current trends" : "prefers timeless staples");
  if (p.statement) parts.push(p.statement === "bold" ? "likes bold, statement looks" : "likes understated, minimal looks");
  const palette = parseArr(p.colorPalette);
  if (palette.length) parts.push(`gravitates to ${palette.join(", ")} colors`);
  const avoid = parseArr(p.avoidColors);
  if (avoid.length) parts.push(`avoids ${avoid.join(", ")}`);
  if (p.fitPreference) parts.push(`prefers a ${p.fitPreference} fit`);
  if (p.budget) parts.push(`budget is ${p.budget}`);
  const brands = parseArr(p.favoriteBrands);
  if (brands.length) parts.push(`likes brands such as ${brands.join(", ")}`);

  if (!parts.length) return "";
  return `\n\nTailor the suggestions to this person's style profile: ${parts.join("; ")}.`;
}

export async function POST(req: Request) {
  const { item, occasion, color, season } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ suggestions: ["Missing GEMINI_API_KEY."] }, { status: 500 });
  }

  const styleContext = await getStyleContext();

  const detailLines = [
    `Item: ${item}`,
    color ? `Color: ${color}` : null,
    `Occasion or Mood: ${occasion}`,
    season && season !== "any" ? `Season: ${season}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `You are a fashion stylist. Suggest 3-5 outfit items that go well with the following:

${detailLines}${styleContext}

Return each suggestion as a short bullet point, one per line. No intro, no extra commentary.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        // Disable "thinking" for lower latency on this simple task.
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const aiText = response.text ?? "";
    const suggestions = aiText
      .split("\n")
      .map((point: string) => point.replace(/^[-•*\d.]+\s*/, "").trim())
      .filter((point: string) => point.length > 0);

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("[GEMINI ERROR]", err);
    return NextResponse.json({ suggestions: ["Something went wrong."] }, { status: 500 });
  }
}
