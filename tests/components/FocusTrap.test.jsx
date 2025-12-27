import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FocusTrap } from '../../src/components/FocusTrap';

describe('FocusTrap Component', () => {
    it('should move focus to the first element when activated', () => {
        render(
            <FocusTrap isActive={true}>
                <button data-testid="btn1">Button 1</button>
                <button data-testid="btn2">Button 2</button>
            </FocusTrap>
        );
        
        expect(screen.getByTestId('btn1')).toHaveFocus();
    });

    it('should cycle focus within children', () => {
        render(
            <FocusTrap isActive={true}>
                <button data-testid="btn1">Button 1</button>
                <button data-testid="btn2">Button 2</button>
            </FocusTrap>
        );
        
        const btn1 = screen.getByTestId('btn1');
        const btn2 = screen.getByTestId('btn2');

        // Tab from last to first
        btn2.focus();
        fireEvent.keyDown(window, { key: 'Tab' });
        expect(btn1).toHaveFocus();

        // Shift+Tab from first to last
        btn1.focus();
        fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
        expect(btn2).toHaveFocus();
    });

    it('should call onDeactivate on Escape key', () => {
        const onDeactivate = vi.fn();
        render(
            <FocusTrap isActive={true} onDeactivate={onDeactivate}>
                <button>Content</button>
            </FocusTrap>
        );
        
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onDeactivate).toHaveBeenCalled();
    });
});
