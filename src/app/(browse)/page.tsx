import { getAllFormulae, getAllCasks } from '@/src/lib/api';
import { PackageList } from '@/src/components/package-list';
import { Suspense } from 'react';
import Loading from './loading';

export default async function HomePage() {
  // Parallel data fetching
  const [formulae, casks] = await Promise.all([
    getAllFormulae(),
    getAllCasks()
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <PackageList 
          initialFormulae={formulae} 
          initialCasks={casks} 
        />
      </Suspense>
    </main>
  );
}