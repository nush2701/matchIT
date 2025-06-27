import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { item, occasion } = await req.json();

  const prompt = `
You are a fashion stylist. Suggest 3-5 outfit items that go well with the following:

Item: ${item}
Occasion or Mood: ${occasion}

Give each suggestion as bullet points.
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,//${process.env.OPENROUTER_API_KEY!}
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // or your deployed domain
          "X-Title": "StyleSense AI",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct", // or try 'openai/gpt-3.5-turbo'
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        }),
      }
    );
    
    if (!response.ok) {
      console.error("[API ERROR]", response.status, response.statusText);
      return NextResponse.json(
        { suggestions: ["Failed to fetch suggestions."] },
        { status: response.status }
      );
    }

    const json = await response.json();
    console.log("AI FULL RESPONSE:", json.choices[0].message?.content);
    const aiText = String(json.choices?.[0]?.message?.content || "");

    const suggestions = aiText
      .split("\n")
      .map((point: string) => point.replace(/^[-•\d.]\s*/, "").trim())
      .filter((point: string) => point.length > 0);
    console.log("[AI RAW TEXT]", aiText);
    console.log("[SUGGESTIONS PARSED]", suggestions);

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("[API ERROR]", err);
    return NextResponse.json(
      { suggestions: ["Something went wrong."] },
      { status: 500 }
    );
  }
}
