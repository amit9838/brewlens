/**
 * @file Modal.tsx
 * Standardized Global Modal System.
 * Provides the Modal renderer and structural sub-components (Header, Body, Footer).
 */

import React, { useEffect, useRef, type ReactNode } from 'react';
import { useModal } from '../contexts/ModalContexts';
import { Button } from './Button';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Sub-components for standardization ---

interface ModalHeaderProps {
    title: ReactNode;
    subtitle?: ReactNode;
    icon?: ReactNode;
    children?: ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, subtitle, icon, children }) => {
    const { closeModal } = useModal();
    return (
        <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-inherit z-20">
            <div className="flex items-center gap-3">
                {icon && <div className="p-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">{icon}</div>}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{title}</h2>
                    {subtitle && <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {children}
                <Button
                    onClick={closeModal}
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                    <X size={20} />
                </Button>
            </div>
        </div>
    );
};

export const ModalBody: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("p-6", className)}>
        {children}
    </div>
);

export const ModalFooter: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("px-6 py-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex items-center justify-end gap-3", className)}>
        {children}
    </div>
);

// --- Main Modal Renderer ---

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]',
};

export const Modal: React.FC = () => {
    const { isOpen, modalContent, modalOptions, closeModal } = useModal();
    const modalRef = useRef<HTMLDivElement>(null);

    const {
        size = 'md',
        closeOnBackdropClick = true,
    } = modalOptions;

    // ESC key listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) closeModal();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeModal]);

    // Focus first element
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const firstInput = modalRef.current.querySelector('input, button:not([aria-label="Close modal"])') as HTMLElement;
            firstInput?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
                onClick={closeOnBackdropClick ? closeModal : undefined}
            />

            {/* Modal Container */}
            <div
                ref={modalRef}
                className={cn(
                    "relative w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-white/20 dark:border-zinc-800/50 overflow-hidden flex flex-col transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-4",
                    sizeClasses[size]
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {modalContent?.()}
            </div>
        </div>
    );
};