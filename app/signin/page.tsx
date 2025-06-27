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
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-200 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-semibold text-center text-neutral-900">
          Welcome back
        </h1>

        {error && (
          <p className="text-sm text-red-600 text-center font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 text-gray-900 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 text-gray-900 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-neutral-900 text-white font-medium py-2.5 rounded-lg hover:bg-neutral-800 transition"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
          <span className="h-px flex-1 bg-neutral-300" />
          or
          <span className="h-px flex-1 bg-neutral-300" />
        </div>

        <button onClick={() => signIn("google", { callbackUrl: "/" })}>
          Continue with Google
        </button>

        <p className="text-sm text-center text-neutral-500">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-neutral-800 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
