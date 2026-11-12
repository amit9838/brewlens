/**
 * @file Modal.tsx
 * Global modal renderer driven by ModalContext. Content components render
 * their own header/body/footer; `ModalShell` provides the common layout.
 */
import React, { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useModal } from '../contexts/ModalContexts';
import { cn } from '../../lib/utils';
import { IconButton } from './kit';

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-[600px]',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]',
};

export const ModalShell: React.FC<{
    title: ReactNode;
    subtitle?: ReactNode;
    icon?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    id?: string;
}> = ({ title, subtitle, icon, children, footer, id = 'modal-title' }) => {
    const { closeModal } = useModal();
    return (
        <div role="dialog" aria-modal="true" aria-labelledby={id} className="flex max-h-[calc(100vh-48px)] flex-col">
            <div className="flex items-center gap-3 px-6 pb-4 pt-5">
                {icon && (
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-tint text-accent-tint-ink">{icon}</span>
                )}
                <div className="flex-1">
                    <h2 id={id} className="m-0 text-[22px] font-extrabold tracking-[-0.02em]">{title}</h2>
                    {subtitle && <div className="text-sm text-muted">{subtitle}</div>}
                </div>
                <IconButton aria-label="Close" onClick={closeModal}><X size={18} strokeWidth={2.4} /></IconButton>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-3">{children}</div>
            {footer && (
                <div className="flex flex-wrap items-center gap-2.5 border-t border-line px-6 pb-5 pt-4">{footer}</div>
            )}
        </div>
    );
};

export const Modal: React.FC = () => {
    const { isOpen, modalContent, modalOptions, closeModal } = useModal();
    const ref = useRef<HTMLDivElement>(null);
    const { size = 'md', closeOnBackdropClick = true } = modalOptions;

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, closeModal]);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.activeElement as HTMLElement | null;
        const t = setTimeout(() => {
            ref.current?.querySelector<HTMLElement>('textarea, input, button')?.focus();
        }, 0);
        return () => {
            clearTimeout(t);
            prev?.focus?.();
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(17,17,20,0.45)] p-6"
            onClick={closeOnBackdropClick ? closeModal : undefined}
        >
            <div
                ref={ref}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    'flex w-full flex-col overflow-hidden rounded-[28px] bg-canvas text-ink shadow-[0_24px_64px_rgba(17,17,20,0.28)]',
                    sizeClasses[size],
                )}
            >
                {modalContent?.()}
            </div>
        </div>
    );
};
