import { NextRequest, NextResponse } from 'next/server';

type SerpItem = {
  title?: string;
  link?: string;
  source?: string;
};

// Simple in-memory cache and rate limiting
const cache = new Map<string, { t: number; data: SerpItem[] }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 30; // per token per minute
const tokens = new Map<string, { windowStart: number; count: number }>();

function getClientToken(req: NextRequest): string {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    'anon';
  return ip;
}

function sanitizeQuery(q: string): string {
  return q.replace(/^\s*(?:\d+\.|\.)\s*/, '').trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const raw = typeof body?.q === 'string' ? body.q : '';
    const q = sanitizeQuery(raw);
    if (!q) {
      return NextResponse.json({ error: 'Missing q' }, { status: 400 });
    }

    // Rate limit
    const token = getClientToken(req);
    const now = Date.now();
    const bucket = tokens.get(token);
    if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
      tokens.set(token, { windowStart: now, count: 1 });
    } else {
      if (bucket.count >= RATE_LIMIT_MAX) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
      bucket.count += 1;
      tokens.set(token, bucket);
    }

    // Cache (5 minutes)
    const key = q.toLowerCase();
    const hit = cache.get(key);
    if (hit && now - hit.t < 5 * 60_000) {
      return NextResponse.json({ results: hit.data }, { status: 200 });
    }

    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing SERPER_API_KEY' }, { status: 500 });
    }

    // Serper.dev — fast Google Search API (drop-in replacement for SerpAPI).
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q, num: 5 }),
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Search failed' }, { status: 502 });
    }
    const data: { organic?: { title?: string; link?: string }[] } = await res.json();
    const organic = Array.isArray(data?.organic) ? data.organic : [];

    const items: SerpItem[] = organic
      .map((r) => {
        let source: string | undefined;
        try {
          source = r.link ? new URL(r.link).hostname.replace(/^www\./, '') : undefined;
        } catch {
          source = undefined;
        }
        return { title: r.title, link: r.link, source };
      })
      .filter((r) => r.link && /^https:\/\//.test(r.link))
      .slice(0, 5);

    cache.set(key, { t: now, data: items });
    return NextResponse.json({ results: items }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}


