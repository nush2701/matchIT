"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="font-display text-4xl text-[color:var(--color-deep-sea-teal)]">
            Join matchIT
          </h1>
          <p className="text-sm text-[color:var(--muted)]">
            Create an account to get styled.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="input-pill w-full px-5 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-pill w-full px-5 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="text-[color:var(--color-ruby-red)] text-sm font-semibold">{error}</p>
          )}
          <button type="submit" className="btn-primary w-full py-3 text-[17px]">
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-[color:var(--muted)]">
          Already have an account?{" "}
          <a href="/signin" className="text-[color:var(--color-deep-sea-teal)] font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
