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
    <nav className="w-full px-6 py-4 flex justify-between items-center glass">
      <div className="flex items-center gap-3">
        <span className="inline-block h-8 w-8 rounded-lg" style={{backgroundImage: 'linear-gradient(135deg, var(--primary), var(--secondary))'}} />
        <h1 className="text-2xl font-extrabold tracking-wide">matchIT</h1>
      </div>
      {mounted && (
        <div>
          {!session ? (
            <Link href="/signin">
              <button className="btn-primary px-4 py-2 rounded-lg transition-colors">
                Login
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <p className="text-sm opacity-90">Welcome, {session.user?.name}</p>
              <button
                onClick={() => signOut()}
                className="px-3 py-1 rounded border border-[color:var(--border)] hover:bg-white/5 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}