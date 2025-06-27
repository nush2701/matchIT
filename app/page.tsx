"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import OutputDisplay from "@/components/OutputDisplay";
import Navbar from '@/components/navbar';

export default function HomePage() {
  const [output, setOutput] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-800">matchIT</h1>
      <p className="text-gray-600 text-center max-w-md">
        Enter the clothes you own, and get AI-powered outfit suggestions and
        smart additions!
      </p>
      <InputForm onResult={setOutput} />
      {Array.isArray(output) && output.length > 0 && (
        <OutputDisplay output={output} />
      )}
    </main>
  );
}
