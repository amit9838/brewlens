import { getAllFormulae, getFormula } from '@/src/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FormulaDetail } from '@/src/components/detail/formula-detail';
import { cache } from 'react';

const getCachedFormula = cache(async (slug: string) => {
  try {
    return await getFormula(slug);
  } catch {
    return null;
  }
});

export async function generateStaticParams() {
  const formulae = await getAllFormulae();
  return formulae.map((formula) => ({
    slug: formula.name,
  }));
}

// ✅ Await params before accessing slug
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;               // 👈 await here
  const formula = await getCachedFormula(slug);
  if (!formula) return { title: 'Formula Not Found' };
  return {
    title: `${formula.name} - Homebrew Formula`,
    description: formula.desc || `Details for Homebrew formula ${formula.name}`,
  };
}

// ✅ Page component also needs to await params
export default async function FormulaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;              // 👈 await here
  const formula = await getCachedFormula(slug);
  if (!formula) notFound();
  return <FormulaDetail formula={formula} />;
}