/**
 * @file ScreenshotsModal.tsx
 * Large screenshot viewer opened from the detail page's Screenshots card.
 * Arrow buttons and the ← / → keys step through the shots.
 */
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { ModalShell } from './Modal';
import { IconButton } from './kit';

const ScreenshotsModal: React.FC<{ name: string; shots: string[]; start: number }> = ({ name, shots, start }) => {
    const [index, setIndex] = useState(start);
    const total = shots.length;

    useEffect(() => {
        if (total < 2) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + total) % total);
            if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % total);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [total]);

    const step = (d: number) => setIndex((i) => (i + d + total) % total);

    return (
        <ModalShell
            title={`${name} screenshots`}
            subtitle={<span aria-live="polite">{index + 1} of {total}</span>}
            icon={<Images size={20} />}
            id="screenshots-title"
        >
            <div className="relative flex items-center justify-center">
                <img
                    src={shots[index]}
                    alt={`${name} screenshot ${index + 1}`}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="max-h-[70vh] w-full rounded-2xl border border-line bg-raised object-contain"
                />
                {total > 1 && (
                    <>
                        <IconButton aria-label="Previous screenshot" onClick={() => step(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 border border-white/50 dark:border-white/15 bg-raised/30 shadow-pill backdrop-blur-xl backdrop-saturate-150 hover:bg-raised/50">
                            <ChevronLeft size={20} />
                        </IconButton>
                        <IconButton aria-label="Next screenshot" onClick={() => step(1)} className="absolute right-3 top-1/2 -translate-y-1/2 border border-white/50 dark:border-white/15 bg-raised/30 shadow-pill backdrop-blur-xl backdrop-saturate-150 hover:bg-raised/50">
                            <ChevronRight size={20} />
                        </IconButton>
                    </>
                )}
            </div>
        </ModalShell>
    );
};

export default ScreenshotsModal;
