import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useDrawerBehavior(isOpen: boolean, onClose: () => void) {
    const panelRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef(onClose);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;
        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        document.body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        panelRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onCloseRef.current();
                return;
            }
            if (event.key !== "Tab" || !panelRef.current) return;

            const focusables = Array.from(
                panelRef.current.querySelectorAll<HTMLElement>(
                    FOCUSABLE_SELECTOR,
                ),
            );
            if (focusables.length === 0) {
                event.preventDefault();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;
            if (event.shiftKey) {
                if (active === first || !panelRef.current.contains(active)) {
                    event.preventDefault();
                    last.focus();
                }
            } else if (active === last || !panelRef.current.contains(active)) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
            previouslyFocusedRef.current?.focus?.();
        };
    }, [isOpen]);

    return panelRef;
}
