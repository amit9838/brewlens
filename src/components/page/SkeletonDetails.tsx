import React from 'react';

const SkeletonDetails: React.FC = () => {
    // Shimmer effect: white-based for light mode, subtle transparency for dark mode
    const shimmer = `relative overflow-hidden 
        before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] 
        before:bg-gradient-to-r 
        before:from-transparent before:via-gray-200/50 dark:before:via-white/5 before:to-transparent`;

    // Common card styling for both modes
    const cardBase = "rounded-3xl  bg-white  dark:bg-zinc-900/40 ";
    // Placeholder block colors
    const pulseBase = "bg-gray-200 dark:bg-zinc-800";
    const pulseMuted = "bg-gray-100 dark:bg-zinc-800/50";

    return (
        <div className="max-w-7xl mx-auto p-0 space-y-6 min-h-screen transition-colors duration-300">

            {/* header action buttons */}
            <div className={`flex w-full justify-between gap-3 mx-2`}>
                <div className={`h-8 w-30 rounded-md ${pulseMuted}`} />
                <div className={`h-8 w-20 rounded-md ${pulseMuted}`} />
            </div>

            {/* --- HERO HEADER SECTION --- */}
            <div className={`h-46 p-4 flex flex-col justify-end ${cardBase} ${shimmer}`}>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* App Icon Square */}
                    <div className={`w-24 h-24 rounded-2xl shrink-0 ${pulseBase}`} />

                    <div className="space-y-4 flex-1 w-full">
                        {/* Subtitle/Category */}
                        <div className={`h-4 w-1/3 rounded ${pulseBase}`} />
                        {/* Large Title */}
                        <div className={`h-10 w-2/3 md:w-64 rounded-lg ${pulseBase}`} />
                        {/* Command Bar */}
                        <div className={`h-8 w-full max-w-lg rounded-xl ${pulseMuted}`} />
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* About Card */}
                    <div className={`p-6 space-y-5 ${cardBase} ${shimmer}`}>
                        <div className={`h-5 w-20 rounded ${pulseBase}`} />
                        <div className={`h-4 w-full rounded ${pulseMuted}`} />
                        <div className="flex gap-2">
                            <div className={`h-7 w-20 rounded-full ${pulseBase}`} />
                            <div className={`h-7 w-32 rounded-full ${pulseBase}`} />
                        </div>
                    </div>

                    {/* Included Artifacts Card */}
                    <div className={`p-6 space-y-5 ${cardBase} ${shimmer}`}>
                        <div className={`h-5 w-40 rounded ${pulseBase}`} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* App Artifact */}
                            <div className={`h-16 rounded-2xl p-4 flex items-center gap-3 ${pulseMuted}`}>
                                <div className={`w-8 h-8 rounded-lg ${pulseBase}`} />
                                <div className={`h-4 w-24 rounded ${pulseBase}`} />
                            </div>
                            {/* Zap Artifact */}
                            <div className={`h-16 rounded-2xl p-4 flex items-center gap-3 ${pulseMuted}`}>
                                <div className={`w-8 h-8 rounded-lg ${pulseBase}`} />
                                <div className={`h-4 w-32 rounded ${pulseBase}`} />
                            </div>
                        </div>
                    </div>

                    {/* Requirements Card */}
                    <div className={`p-6 space-y-4 ${cardBase} ${shimmer}`}>
                        <div className={`h-5 w-32 rounded ${pulseBase}`} />
                        <div className={`h-3 w-28 rounded ${pulseMuted}`} />
                        <div className={`h-7 w-24 rounded-full ${pulseBase}`} />
                    </div>
                </div>

                {/* RIGHT COLUMN / SIDEBAR (1/3 width) */}
                <div className="lg:col-span-1">
                    <div className={`p-6 space-y-8 min-h-[400px] ${cardBase} ${shimmer}`}>
                        <div className={`h-5 w-32 rounded ${pulseBase}`} />

                        {/* Download Source Block */}
                        <div className="space-y-3">
                            <div className={`h-3 w-28 rounded ${pulseMuted}`} />
                            <div className={`h-24 w-full rounded-xl ${pulseMuted}`} />
                        </div>

                        {/* Hash Block */}
                        <div className="space-y-3">
                            <div className={`h-3 w-24 rounded ${pulseMuted}`} />
                            <div className={`h-16 w-full rounded-xl ${pulseMuted}`} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SkeletonDetails;