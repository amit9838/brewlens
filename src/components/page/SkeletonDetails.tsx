const Pulse = ({ className }: { className: string }) => <div className={`animate-pulse bg-chip ${className}`} />;

/** Placeholder for cask / formula detail pages. */
export default function SkeletonDetails() {
    return (
        <div role="status" aria-label="Loading package" className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-7 rounded-[32px] bg-surface p-8">
                <Pulse className="h-32 w-32 rounded-[30px]" />
                <div className="flex flex-1 basis-[420px] flex-col gap-3">
                    <Pulse className="h-4 w-48 rounded-full" />
                    <Pulse className="h-11 w-72 rounded-xl" />
                    <Pulse className="h-5 w-96 max-w-full rounded-full" />
                    <Pulse className="mt-2 h-[52px] w-80 max-w-full rounded-full" />
                </div>
            </div>
            <div className="flex flex-wrap gap-6">
                <div className="flex flex-[999_1_560px] flex-col gap-6"><Pulse className="h-44 rounded-3xl" /><Pulse className="h-44 rounded-3xl" /></div>
                <div className="flex flex-[1_1_340px] flex-col gap-6"><Pulse className="h-44 rounded-3xl" /><Pulse className="h-44 rounded-3xl" /></div>
            </div>
        </div>
    );
}
