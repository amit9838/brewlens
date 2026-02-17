import type { Formula, Cask } from '@/src/types/homebrew'; 
// ✅ Import from @/types/homebrew – adjust to @/src/types/homebrew if your project uses /src folder
import { unstable_cache } from 'next/cache';
const HOMEBREW_API_BASE = 'https://formulae.brew.sh/api';

// src/lib/homebrew-cache.ts
let formulaeCache: Formula[] | null = null;
let lastFetch = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function getAllFormulae(): Promise<Formula[]> {
  const now = Date.now();
  
  if (formulaeCache && (now - lastFetch < CACHE_TTL)) {
    return formulaeCache;
  }

  const res = await fetch(`${HOMEBREW_API_BASE}/formula.json`, { cache: 'no-store' });
  formulaeCache = await res.json();
  lastFetch = now;
  
  return formulaeCache!;
}

export async function getAllCasks(): Promise<Cask[]> {
  const res = await fetch(`${HOMEBREW_API_BASE}/cask.json`, {
    next: { revalidate: 86400 }
  });
  if (!res.ok) throw new Error('Failed to fetch casks');
  return res.json();
}

export async function getFormula(slug: string): Promise<Formula> {
  const res = await fetch(`${HOMEBREW_API_BASE}/formula/${slug}.json`, {
    next: { revalidate: 86400 }
  });
  if (!res.ok) throw new Error(`Formula ${slug} not found`);
  return res.json();
}

export async function getCask(slug: string): Promise<Cask> {
  const res = await fetch(`${HOMEBREW_API_BASE}/cask/${slug}.json`, {
    next: { revalidate: 86400 }
  });
  if (!res.ok) throw new Error(`Cask ${slug} not found`);
  return res.json();
}