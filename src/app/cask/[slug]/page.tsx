import { getAllCasks, getCask } from '@/src/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CaskDetail } from '@/src/components/detail/cask-detail';
import { cache } from 'react';

const getCachedCask = cache(async (slug: string) => {
  try {
    return await getCask(slug);
  } catch {
    return null;
  }
});

export async function generateStaticParams() {
  const casks = await getAllCasks();
  return casks.map((cask) => ({
    slug: cask.token,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cask = await getCachedCask(slug);
  if (!cask) return { title: 'Cask Not Found' };
  return {
    title: `${cask.name[0] || cask.token} - Homebrew Cask`,
    description: cask.desc || `Details for Homebrew cask ${cask.token}`,
  };
}

export default async function CaskPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cask = await getCachedCask(slug);
  if (!cask) notFound();
  return <CaskDetail cask={cask} />;
}