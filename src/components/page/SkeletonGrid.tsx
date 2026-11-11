const Pulse = ({ className }: { className: string }) => <div className={`animate-pulse rounded-xl bg-chip ${className}`} />;

/** Placeholder grid shown while the Homebrew catalogue loads. */
export default function SkeletonGrid({ count = 12 }: { count?: number }) {
    return (
        <div role="status" aria-label="Loading packages" className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {Array.from({ length: Math.min(count, 12) }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3.5 rounded-[22px] bg-surface p-[18px]">
                    <Pulse className="h-[60px] w-[60px] !rounded-2xl" />
                    <Pulse className="h-4 w-2/3" />
                    <Pulse className="h-3 w-full" />
                    <Pulse className="h-3 w-4/5" />
                    <div className="flex gap-2"><Pulse className="h-7 w-16 !rounded-full" /><Pulse className="ml-auto h-10 w-20 !rounded-full" /></div>
                </div>
            ))}
        </div>
    );
}
