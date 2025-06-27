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
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-neutral-900 shadow-md">
      <h1 className="text-2xl font-extrabold text-white tracking-wide">matchIT</h1>
      {mounted && (
        <div>
          {!session ? (
            <Link href="/signin">
              <button className="bg-white text-neutral-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                Login
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <p className="text-sm text-white">Welcome, {session.user?.name}</p>
              <button
                onClick={() => signOut()}
                className="bg-white text-neutral-900 px-3 py-1 rounded hover:bg-gray-200 transition"
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