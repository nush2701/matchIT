import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Multi-select fields are stored as JSON-encoded strings (SQLite has no arrays).
const MULTI = ['styles', 'occasions', 'colorPalette', 'avoidColors', 'favoriteBrands'] as const;
const SINGLE = ['gender', 'shopFor', 'fitPreference', 'budget', 'vibe', 'statement'] as const;

function parseProfile(p: Record<string, unknown> | null) {
  if (!p) return null;
  const out: Record<string, unknown> = { ...p };
  for (const k of MULTI) {
    const v = p[k];
    if (typeof v === 'string') {
      try {
        out[k] = JSON.parse(v);
      } catch {
        out[k] = [];
      }
    }
  }
  return out;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });
  return NextResponse.json({ profile: parseProfile(profile as Record<string, unknown> | null) });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const data: Record<string, string | boolean | null> = { onboarded: true };

  for (const k of SINGLE) {
    data[k] = typeof body[k] === 'string' && body[k].trim() ? body[k] : null;
  }
  for (const k of MULTI) {
    const v = body[k];
    data[k] = Array.isArray(v) && v.length ? JSON.stringify(v) : null;
  }

  const profile = await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    update: data,
    create: { userId: session.user.id, ...data },
  });

  return NextResponse.json({ success: true, profile: parseProfile(profile as Record<string, unknown>) });
}
