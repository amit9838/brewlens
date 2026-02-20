import React from 'react';

interface SkeletonProps {
    count?: number;
}

const SkeletonGrid: React.FC<SkeletonProps> = ({ count = 8 }) => {
    const skeletonCards = Array.from({ length: count });

    return (
        // Responsive grid: adjusted column counts since these cards are a bit wider visually
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-0">
            {skeletonCards.map((_, index) => (
                <div
                    key={index}
                    className="relative overflow-hidden rounded-2xl border p-4 
                     bg-white border-gray-100 
                     dark:bg-[#1a1a1a] dark:border-zinc-800"
                >
                    {/* Shimmer Effect: Adjusted for dark mode visibility */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] 
                          bg-gradient-to-r from-transparent 
                          via-white/40 dark:via-white/5 
                          to-transparent" />

                    {/* Top Row: Icon + Title/Subtitle */}
                    <div className="flex items-center gap-5 mb-5">
                        {/* Circular Icon Placeholder */}
                        <div className="w-10 h-10 shrink-0 rounded-full 
                              bg-gray-200 dark:bg-zinc-800" />

                        {/* Title & Subtitle Placeholders */}
                        <div className="flex flex-col gap-3 flex-1">
                            <div className="h-4 rounded-md w-1/2 
                                bg-gray-200 dark:bg-zinc-800" />
                            <div className="h-3 rounded-md w-1/2 
                                bg-gray-100 dark:bg-zinc-800/60" />
                        </div>
                    </div>

                    {/* Middle Row: Pill Tags (Version, Deprecated, etc.) */}
                    <div className="flex items-center gap-3 mb-2 mt-2">
                        <div className="h-4 w-12 rounded-full bg-gray-200 dark:bg-zinc-800" />
                        <div className="h-4 w-12 rounded-full bg-gray-200 dark:bg-zinc-800" />
                    </div>

                    {/* Bottom Row: Paragraph / Description Placeholders */}
                    <div className="space-y-2">
                        <div className="h-3 rounded-md w-full 
                            bg-gray-200 dark:bg-zinc-800" />
                        <div className="h-3 rounded-md w-11/12 
                            bg-gray-200 dark:bg-zinc-800" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonGrid;