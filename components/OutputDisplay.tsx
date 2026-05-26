"use client";

import { useState } from "react";

type OutputDisplayProps = {
  output: string[];
};

// Fruit-accent palette — each card gets a different pastel, OLIPOP-style.
const ACCENTS = [
  "bg-candy-apple-red",
  "bg-lavender-bloom",
  "bg-mellow-yellow",
  "bg-tropical-sky",
  "bg-peach-fuzz",
  "bg-lime-spritz",
];

export default function OutputDisplay({ output }: OutputDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [results, setResults] = useState<
    Record<number, { title?: string; link?: string; source?: string }[]>
  >({});
  const [errors, setErrors] = useState<Record<number, string>>({});

  const sanitizeItem = (text: string): string =>
    text.replace(/^\s*(?:\d+\.|\.)\s*/, "");

  const fetchLinks = async (text: string, index: number) => {
    try {
      setLoadingIndex(index);
      setErrors((e) => ({ ...e, [index]: "" }));
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: sanitizeItem(text) }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults((prev) => ({ ...prev, [index]: data.results || [] }));
      } else {
        setErrors((e) => ({ ...e, [index]: data?.error || "Search failed" }));
      }
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(sanitizeItem(text));
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch {
      // ignore copy errors silently
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full max-w-4xl mt-10">
      {output.map((item, idx) => (
        <div
          key={idx}
          className={`${ACCENTS[idx % ACCENTS.length]} rounded-card p-5 text-[color:var(--color-ash-slate)] transition-transform duration-200 hover:-translate-y-1`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-0.5 rounded-pill text-xs font-bold bg-[color:var(--color-deep-sea-teal)] text-[color:var(--color-creamy-canvas)]">
              Look {idx + 1}
            </span>
            <button
              onClick={() => handleCopy(item, idx)}
              className="text-xs px-3 py-1 rounded-pill bg-[color:var(--color-pure-white)] text-[color:var(--color-deep-sea-teal)] font-semibold hover:brightness-95 transition"
              aria-label="Copy suggestion"
            >
              {copiedIndex === idx ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="font-medium leading-relaxed">{sanitizeItem(item)}</p>

          <div className="mt-4">
            <button
              onClick={() => fetchLinks(item, idx)}
              className="btn-primary text-xs px-4 py-1.5"
              disabled={loadingIndex === idx}
            >
              {loadingIndex === idx ? "Searching…" : "Find links"}
            </button>
          </div>

          {errors[idx] && (
            <p className="mt-2 text-xs text-[color:var(--color-deep-sea-teal)]/70">
              {errors[idx]}
            </p>
          )}

          {Array.isArray(results[idx]) && results[idx]!.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm">
              {results[idx]!.map((r, i) => (
                <li key={i} className="truncate">
                  <a
                    className="text-[color:var(--color-deep-sea-teal)] font-semibold hover:underline"
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {r.title || r.link}
                  </a>
                  {r.source && (
                    <span className="text-[color:var(--color-ash-slate)]/60"> — {r.source}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
