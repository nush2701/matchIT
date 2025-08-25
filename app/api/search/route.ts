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
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'anon';
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

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing SERPAPI_KEY' }, { status: 500 });
    }

    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.set('engine', 'google');
    url.searchParams.set('num', '5');
    url.searchParams.set('q', q);
    url.searchParams.set('api_key', apiKey);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'Search failed' }, { status: 502 });
    }
    const data: { organic_results?: { title?: string; link?: string; displayed_link?: string }[] } = await res.json();
    const organic = Array.isArray(data?.organic_results) ? data.organic_results : [];

    const items: SerpItem[] = organic
      .map((r) => ({ title: r.title, link: r.link, source: r.displayed_link }))
      .filter((r) => r.link && /^https:\/\//.test(r.link))
      .slice(0, 5);

    cache.set(key, { t: now, data: items });
    return NextResponse.json({ results: items }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}


