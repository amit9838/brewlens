/**
 * @file ModalContexts.tsx
 * Global modal state management via React Context.
 *
 * Uses a factory pattern: `openModal` accepts `() => ReactNode` rather than
 * `ReactNode` directly. This prevents an infinite re-render loop that would
 * occur if JSX were stored in context state — each parent re-render would
 * create new JSX, update context, trigger re-renders, and loop indefinitely.
 *
 * Usage:
 * ```tsx
 * const { openModal, closeModal } = useModal();
 * openModal(() => <MyModal />, { closeOnBackdropClick: true });
 * ```
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { type ReactNode } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalOptions {
    size?: ModalSize;
    closeOnBackdropClick?: boolean;
    showCloseButton?: boolean;
}

type ModalFactory = () => ReactNode;

interface ModalContextType {
    isOpen: boolean;
    modalContent: ModalFactory | null;
    modalOptions: ModalOptions;
    openModal: (content: ModalFactory, options?: ModalOptions) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ModalFactory | null>(null);
    const [modalOptions, setModalOptions] = useState<ModalOptions>({});

    const openModal = useCallback((content: ModalFactory, options?: ModalOptions) => {
        setModalContent(() => content);
        setModalOptions(options || {});
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setModalContent(null);
        setModalOptions({});
        document.body.style.overflow = 'unset';
    }, []);

    return (
        <ModalContext.Provider value={{ isOpen, modalContent, modalOptions, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
