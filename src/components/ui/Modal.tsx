import React, { useEffect, useRef } from 'react';
import { useModal } from '../contexts/ModalContexts';
import { Button } from './Button';
import { X } from 'lucide-react';


export const Modal: React.FC = () => {
    const { isOpen, modalContent, modalOptions, closeModal } = useModal();
    const modalRef = useRef<HTMLDivElement>(null);

    const {
        closeOnBackdropClick = true,
        showCloseButton = true,
    } = modalOptions;

    // Close on ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeModal]);

    // Focus trap: keep focus inside modal when open
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                (focusableElements[0] as HTMLElement).focus();
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = () => {
        if (closeOnBackdropClick) {
            closeModal();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40  backdrop-blur-sm saturation-200"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={modalRef}
                className={` relative bg-slate-50 border border-white dark:bg-zinc-900 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-auto`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                {/* Header with optional close button */}
                {showCloseButton && (
                    <div className=" absolute top-0 right-0 p-6 z-10">
                        <Button onClick={closeModal}
                            aria-label="Close modal"
                            variant='ghost'
                            size='icon'
                        >
                            <X size={20} />
                        </Button>
                    </div>
                )}

                {/* Modal content */}
                <div className="m-1 md:p-3 pt-0">{modalContent}</div>
            </div>
        </div>
    );
};