import { Suspense } from 'react';
import { getAllFormulae, getAllCasks } from '@/src/lib/api';     // ✅ shared data fetching
import { PackageList } from '@/src/components/package-list';     // ✅ client component
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BrewLens - Browse Homebrew Packages',
  description: 'Search and explore Homebrew formulae and casks',
};

export default async function HomePage() {
  // Fetch both datasets in parallel for better performance
  const [formulae, casks] = await Promise.all([
    getAllFormulae(),
    getAllCasks(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<HomeLoading />}>
        <PackageList 
          initialFormulae={formulae} 
          initialCasks={casks} 
        />
      </Suspense>
    </main>
  );
}

// Simple loading state (inline – no need for separate file)
function HomeLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 dark:bg-gray-500 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded" />
        ))}
      </div>
    </div>
  );
}