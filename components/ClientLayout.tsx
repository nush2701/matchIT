"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/signin" || pathname === "/signup";
  return (
    <SessionProvider>
      {!hideNavbar && <Navbar />}
      {children}
    </SessionProvider>
  );
}
// This layout wraps the application with the SessionProvider for NextAuth
// and includes the Navbar component. It ensures that session data is available