"use client";

import { useState } from "react";

type OutputDisplayProps = {
  output: string[];
};

export default function OutputDisplay({ output }: OutputDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, { title?: string; link?: string; source?: string }[]>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});

  const sanitizeItem = (text: string): string => {
    // Remove leading enumeration like "1.", "01.", or a leading "." followed by spaces
    return text.replace(/^\s*(?:\d+\.|\.)\s*/, "");
  };

  const fetchLinks = async (text: string, index: number) => {
    try {
      setLoadingIndex(index);
      setErrors((e) => ({ ...e, [index]: '' }));
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: sanitizeItem(text) }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults((prev) => ({ ...prev, [index]: data.results || [] }));
      } else {
        setErrors((e) => ({ ...e, [index]: data?.error || 'Search failed' }));
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mt-8">
      {output.map((item, idx) => (
        <div
          key={idx}
          className="glass rounded-2xl p-4 border border-[color:var(--border)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-within:[box-shadow:0_0_0_2px_var(--ring)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: "var(--accent)", color: "#0f172a" }}
            >
              Suggestion {idx + 1}
            </span>
            <button
              onClick={() => handleCopy(item, idx)}
              className="text-xs px-2 py-1 rounded border border-[color:var(--border)] hover:bg-white/10 transition-colors"
              aria-label="Copy suggestion"
            >
              {copiedIndex === idx ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="opacity-90 whitespace-pre-line leading-relaxed">
            {sanitizeItem(item)}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => fetchLinks(item, idx)}
              className="text-xs px-2 py-1 rounded btn-primary"
              disabled={loadingIndex === idx}
            >
              {loadingIndex === idx ? 'Searching…' : 'Find links'}
            </button>
          </div>

          {errors[idx] && (
            <p className="mt-2 text-xs opacity-70">{errors[idx]}</p>
          )}

          {Array.isArray(results[idx]) && results[idx]!.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm">
              {results[idx]!.map((r, i) => (
                <li key={i} className="truncate">
                  <a className="hover:underline" href={r.link} target="_blank" rel="noopener noreferrer">
                    {r.title || r.link}
                  </a>
                  {r.source && <span className="opacity-60"> — {r.source}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
