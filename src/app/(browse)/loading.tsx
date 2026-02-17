export default function BrowseLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-4 items-center">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded" />
        ))}
      </div>
    </div>
  );
}