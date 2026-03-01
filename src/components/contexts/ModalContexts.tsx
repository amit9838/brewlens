import React, { createContext, useContext, useState } from 'react';
import { type ReactNode } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalOptions {
    size?: ModalSize;
    closeOnBackdropClick?: boolean;
    showCloseButton?: boolean;
}

interface ModalContextType {
    isOpen: boolean;
    modalContent: ReactNode | null;
    modalOptions: ModalOptions;
    openModal: (content: ReactNode, options?: ModalOptions) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ReactNode | null>(null);
    const [modalOptions, setModalOptions] = useState<ModalOptions>({});

    const openModal = (content: ReactNode, options?: ModalOptions) => {
        setModalContent(content);
        setModalOptions(options || {});
        setIsOpen(true);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsOpen(false);
        setModalContent(null);
        setModalOptions({});
        document.body.style.overflow = 'unset';
    };

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