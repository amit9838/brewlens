// Simple loading skeleton – no "use client" needed
export default function FormulaLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
      <div className="h-10 w-2/3 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
      <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded" />
        ))}
      </div>
    </div>
  );
}