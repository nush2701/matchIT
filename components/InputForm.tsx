"use client";

import { useState } from "react";

const SEASONS = [
  { value: "any", label: "Any season" },
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "fall", label: "Fall" },
  { value: "winter", label: "Winter" },
];

export default function InputForm({
  onResult,
}: {
  onResult: (result: string[]) => void;
}) {
  const [item, setItem] = useState("");
  const [occasion, setOccasion] = useState("");
  const [color, setColor] = useState("");
  const [season, setSeason] = useState("any");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, occasion, color, season }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      onResult(data.suggestions);
    } else {
      onResult(["Failed to generate outfit. Please try again."]);
    }
  };

  const labelCls =
    "block text-xs font-semibold uppercase tracking-wide text-[color:var(--color-deep-sea-teal)] mb-1.5";
  const optional = (
    <span className="opacity-50 normal-case font-normal">(optional)</span>
  );

  return (
    <div className="glass p-6 md:p-8 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>What are you styling?</label>
          <input
            type="text"
            placeholder="e.g. red satin top"
            className="input-pill w-full px-5 py-3"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Occasion or mood</label>
            <input
              type="text"
              placeholder="e.g. party, work"
              className="input-pill w-full px-5 py-3"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Main color {optional}</label>
            <input
              type="text"
              placeholder="e.g. black, beige"
              className="input-pill w-full px-5 py-3"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Season {optional}</label>
          <select
            className="input-pill w-full px-5 py-3 appearance-none cursor-pointer"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            {SEASONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn-primary px-6 py-3 w-full text-[17px]"
          disabled={loading}
        >
          {loading ? "Generating…" : "Get Outfit Suggestions"}
        </button>
      </form>

      {loading && (
        <p className="text-center text-[color:var(--muted)] animate-pulse mt-3">
          Mixing up some looks for you…
        </p>
      )}
    </div>
  );
}
