"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Choice = { value: string; label: string };
type Step =
  | {
      key: string;
      type: "single" | "multi";
      title: string;
      subtitle?: string;
      choices: Choice[];
      max?: number;
      optional?: boolean;
    }
  | { key: string; type: "text"; title: string; subtitle?: string; placeholder?: string; optional?: boolean };

const STEPS: Step[] = [
  {
    key: "gender",
    type: "single",
    title: "How do you identify?",
    subtitle: "Helps us style you right — pick what fits, or skip.",
    optional: true,
    choices: [
      { value: "woman", label: "Woman" },
      { value: "man", label: "Man" },
      { value: "nonbinary", label: "Non-binary" },
      { value: "na", label: "Prefer not to say" },
    ],
  },
  {
    key: "shopFor",
    type: "single",
    title: "Which wardrobe do you shop?",
    subtitle: "We'll pull pieces from the right department.",
    choices: [
      { value: "womenswear", label: "Womenswear" },
      { value: "menswear", label: "Menswear" },
      { value: "unisex", label: "Unisex / both" },
    ],
  },
  {
    key: "styles",
    type: "multi",
    title: "Which styles feel like you?",
    subtitle: "Pick up to 4.",
    max: 4,
    choices: [
      { value: "minimalist", label: "Minimalist" },
      { value: "classic", label: "Classic" },
      { value: "streetwear", label: "Streetwear" },
      { value: "casual", label: "Everyday casual" },
      { value: "elegant", label: "Elegant / formal" },
      { value: "athleisure", label: "Athleisure" },
      { value: "boho", label: "Boho" },
      { value: "edgy", label: "Edgy / grunge" },
      { value: "preppy", label: "Preppy" },
      { value: "y2k", label: "Y2K / trendy" },
    ],
  },
  {
    key: "vibe",
    type: "single",
    title: "Timeless or trend-led?",
    subtitle: "Where do you lean?",
    choices: [
      { value: "timeless", label: "Timeless staples" },
      { value: "trendy", label: "Of-the-moment trends" },
    ],
  },
  {
    key: "statement",
    type: "single",
    title: "Quiet or loud?",
    subtitle: "How much do you want your outfit to speak?",
    choices: [
      { value: "minimal", label: "Understated & minimal" },
      { value: "bold", label: "Bold & statement-making" },
    ],
  },
  {
    key: "occasions",
    type: "multi",
    title: "What do you dress for most?",
    subtitle: "Pick all that apply.",
    choices: [
      { value: "work", label: "Work / office" },
      { value: "casual", label: "Everyday" },
      { value: "night out", label: "Night out" },
      { value: "formal", label: "Formal events" },
      { value: "active", label: "Active / gym" },
    ],
  },
  {
    key: "colorPalette",
    type: "multi",
    title: "Your color comfort zone?",
    subtitle: "Pick the palettes you reach for.",
    choices: [
      { value: "neutrals", label: "Neutrals (black, white, grey, beige)" },
      { value: "earth tones", label: "Earth tones" },
      { value: "brights", label: "Bold brights" },
      { value: "pastels", label: "Soft pastels" },
      { value: "monochrome", label: "Monochrome" },
      { value: "jewel tones", label: "Jewel tones" },
    ],
  },
  {
    key: "fitPreference",
    type: "single",
    title: "How do you like things to fit?",
    choices: [
      { value: "fitted", label: "Fitted" },
      { value: "regular", label: "Regular" },
      { value: "relaxed", label: "Relaxed / oversized" },
    ],
  },
  {
    key: "budget",
    type: "single",
    title: "Typical budget?",
    choices: [
      { value: "budget", label: "Budget-friendly" },
      { value: "mid", label: "Mid-range" },
      { value: "premium", label: "Premium" },
    ],
  },
  {
    key: "favoriteBrands",
    type: "text",
    title: "Any favorite brands?",
    subtitle: "Optional — comma separated.",
    placeholder: "e.g. Uniqlo, COS, Zara",
    optional: true,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { status, update } = useSession();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const value = answers[current.key];

  const canAdvance =
    current.type === "text" || current.optional
      ? true
      : current.type === "multi"
      ? Array.isArray(value) && value.length > 0
      : typeof value === "string" && value.length > 0;

  const toggleMulti = (v: string) => {
    setAnswers((prev) => {
      const arr = Array.isArray(prev[current.key]) ? (prev[current.key] as string[]) : [];
      if (arr.includes(v)) return { ...prev, [current.key]: arr.filter((x) => x !== v) };
      const max = current.type === "multi" ? current.max : undefined;
      if (max && arr.length >= max) return prev;
      return { ...prev, [current.key]: [...arr, v] };
    });
  };

  const setSingle = (v: string) => setAnswers((prev) => ({ ...prev, [current.key]: v }));

  const submit = async () => {
    setSaving(true);
    setError("");
    // Normalize the free-text brands field into an array.
    const payload: Record<string, unknown> = { ...answers };
    if (typeof payload.favoriteBrands === "string") {
      payload.favoriteBrands = (payload.favoriteBrands as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      // Refresh the session so `onboarded` flips to true before we navigate,
      // otherwise the OnboardingGate would bounce us right back here.
      await update();
      setSaving(false);
      router.replace("/");
      router.refresh();
      return;
    } else {
      setSaving(false);
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "Could not save your preferences. Please try again.");
    }
  };

  const next = () => (isLast ? submit() : setStep((s) => s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  if (status !== "authenticated") return null;

  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <main className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl glass rounded-2xl p-6 md:p-8 space-y-6">
        {/* progress */}
        <div>
          <div className="flex justify-between text-xs text-[color:var(--muted)] mb-2">
            <span>Style quiz</span>
            <span>
              {step + 1} / {STEPS.length}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[color:var(--color-cloud-burst-gray)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: "var(--accent)" }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-3xl text-[color:var(--color-deep-sea-teal)]">{current.title}</h1>
          {current.subtitle && <p className="text-sm text-[color:var(--muted)]">{current.subtitle}</p>}
        </div>

        {/* choices */}
        {current.type === "text" ? (
          <input
            type="text"
            placeholder={current.placeholder}
            className="input-pill w-full px-5 py-3"
            value={(value as string) || ""}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [current.key]: e.target.value }))}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {current.choices.map((c) => {
              const selected =
                current.type === "multi"
                  ? Array.isArray(value) && value.includes(c.value)
                  : value === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => (current.type === "multi" ? toggleMulti(c.value) : setSingle(c.value))}
                  className={`text-left px-4 py-3 rounded-2xl border transition-all ${
                    selected
                      ? "border-[color:var(--color-deep-sea-teal)] bg-[color:var(--color-cloud-burst-gray)] font-semibold"
                      : "border-[color:var(--border)] bg-[color:var(--color-pure-white)] hover:border-[color:var(--color-deep-sea-teal)]"
                  }`}
                  aria-pressed={selected}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        )}

        {error && <p className="text-sm text-[color:var(--color-ruby-red)] font-semibold">{error}</p>}

        {/* nav */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="btn-secondary px-5 py-2 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance || saving}
            className="btn-primary px-6 py-2 disabled:opacity-50"
          >
            {saving ? "Saving…" : isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}
