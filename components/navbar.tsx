'use client';

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center bg-[color:var(--color-creamy-canvas)]/90 backdrop-blur-sm border-b border-[color:var(--border)]">
      <Link href="/" className="flex items-center gap-3">
        <span
          className="inline-block h-8 w-8 rounded-xl"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
        />
        <h1 className="font-display text-3xl text-[color:var(--color-deep-sea-teal)]">matchIT</h1>
      </Link>
      {mounted && (
        <div>
          {!session ? (
            <Link href="/signin">
              <button className="btn-primary px-6 py-2">Login</button>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <p className="text-sm text-[color:var(--color-ash-slate)]">
                Welcome, {session.user?.name || session.user?.email?.split('@')[0]}
              </p>
              <button onClick={() => signOut()} className="btn-secondary px-5 py-1.5">
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
