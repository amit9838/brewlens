import React from 'react';

interface SkeletonProps {
    count?: number;
}

const SkeletonGrid: React.FC<SkeletonProps> = ({ count = 8 }) => {
    const skeletonCards = Array.from({ length: count });

    return (
        // Responsive grid: 2 cols on mobile, up to 4 on desktop
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {skeletonCards.map((_, index) => (
                <div
                    key={index}
                    className="relative overflow-hidden rounded-lg border p-3 
                     bg-white border-gray-100 
                     dark:bg-zinc-900 dark:border-zinc-800"
                >
                    {/* Shimmer Effect: Adjusted for dark mode visibility */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] 
                          bg-gradient-to-r from-transparent 
                          via-white/40 dark:via-white/5 
                          to-transparent" />

                    {/* Small "Thumbnail" Placeholder */}
                    <div className="w-full h-32 rounded-md mb-3 
                          bg-gray-200 dark:bg-zinc-800" />

                    {/* Compact Text Placeholders */}
                    <div className="space-y-2">
                        <div className="h-4 rounded w-11/12 
                            bg-gray-200 dark:bg-zinc-800" />
                        <div className="h-3 rounded w-2/3 
                            bg-gray-100 dark:bg-zinc-800/60" />
                    </div>

                    {/* Bottom Row Placeholder */}
                    <div className="mt-4 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-zinc-800" />
                        <div className="h-3 w-12 rounded bg-gray-100 dark:bg-zinc-800/60" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonGrid;