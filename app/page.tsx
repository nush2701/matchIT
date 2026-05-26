"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import OutputDisplay from "@/components/OutputDisplay";

export default function HomePage() {
  const [output, setOutput] = useState<string[]>([]);

  return (
    <main className="relative overflow-hidden min-h-[calc(100vh-72px)] flex flex-col items-center px-6 py-12 md:py-16">
      {/* Playful OLIPOP accent blobs — color, not shadow, for depth */}
      <span aria-hidden className="pointer-events-none absolute -z-10 h-44 w-44 rounded-full bg-candy-apple-red/50 -top-8 -left-10 blur-2xl" />
      <span aria-hidden className="pointer-events-none absolute -z-10 h-52 w-52 rounded-full bg-tropical-sky/40 top-20 -right-12 blur-2xl" />
      <span aria-hidden className="pointer-events-none absolute -z-10 h-44 w-44 rounded-full bg-mellow-yellow/60 bottom-8 left-[22%] blur-2xl" />

      <section className="w-full max-w-3xl text-center space-y-5 mb-9">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-[color:var(--color-pure-white)] border border-[color:var(--border)]">
          <span className="h-2 w-2 rounded-circle" style={{ background: "var(--color-aqua-pop)" }} />
          <span className="text-sm text-[color:var(--color-deep-sea-teal)] font-semibold">
            AI outfit recommender
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl text-[color:var(--color-deep-sea-teal)]">
          Dress smarter with
          <br />a touch of AI
        </h1>
        <p className="text-[color:var(--color-ash-slate)] text-lg max-w-xl mx-auto leading-relaxed">
          Tell us what you&apos;ve got — we&apos;ll style cohesive looks and smart
          additions for your vibe and the occasion.
        </p>
      </section>

      <InputForm onResult={setOutput} />

      {Array.isArray(output) && output.length > 0 && <OutputDisplay output={output} />}
    </main>
  );
}
