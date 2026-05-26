"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Sends authenticated-but-not-onboarded users to the style quiz.
const EXEMPT = ["/onboarding", "/signin", "/signup"];

export default function OnboardingGate() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.onboarded) return;
    if (EXEMPT.includes(pathname)) return;
    router.replace("/onboarding");
  }, [status, session, pathname, router]);

  return null;
}
