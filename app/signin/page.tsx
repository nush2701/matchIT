"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      router.push("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="font-display text-4xl text-[color:var(--color-deep-sea-teal)]">
            Welcome back
          </h1>
          <p className="text-sm text-[color:var(--muted)]">Sign in to keep styling.</p>
        </div>

        {error && (
          <p className="text-sm text-[color:var(--color-ruby-red)] text-center font-semibold">
            {error}
          </p>
        )}

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
          <button type="submit" className="btn-primary w-full py-3 text-[17px]">
            Sign In
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-sm text-[color:var(--muted)]">
          <span className="h-px flex-1 bg-[color:var(--border)]" />
          or
          <span className="h-px flex-1 bg-[color:var(--border)]" />
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="btn-secondary w-full py-3"
        >
          Continue with Google
        </button>

        <p className="text-sm text-center text-[color:var(--muted)]">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-[color:var(--color-deep-sea-teal)] font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
