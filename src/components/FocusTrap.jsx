import { useEffect, useRef } from 'react';

/**
 * Simple Focus Trap component.
 * Traps Tab and Shift+Tab focus within children.
 */
export const FocusTrap = ({ children, isActive, onDeactivate }) => {
    const rootRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        const root = rootRef.current;
        const focusableElements = root.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && onDeactivate) {
                onDeactivate();
                return;
            }

            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        // Move focus to first element on activation
        if (focusableElements.length > 0) {
            firstElement.focus();
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, onDeactivate]);

    return (
        <div ref={rootRef} className="h-full w-full outline-none" tabIndex="-1">
            {children}
        </div>
    );
};
