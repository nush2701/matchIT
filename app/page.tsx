"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import OutputDisplay from "@/components/OutputDisplay";
import Navbar from '@/components/navbar';

export default function HomePage() {
  const [output, setOutput] = useState<string[]>([]);

  return (
    <main className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center p-6">
      <section className="w-full max-w-4xl text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass">
          <span className="h-2 w-2 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="text-sm opacity-80">AI outfit recommender</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Dress smarter with a touch of AI
        </h1>
        <p className="opacity-80 max-w-2xl mx-auto">
          Enter what you have, get cohesive outfit suggestions and smart additions tailored to your style and occasion.
        </p>
      </section>
      <InputForm onResult={setOutput} />
      {Array.isArray(output) && output.length > 0 && (
        <OutputDisplay output={output} />
      )}
    </main>
  );
}
