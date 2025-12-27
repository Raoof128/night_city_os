import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WindowFrame from '../../src/components/WindowFrame';
import { OSContext } from '../../src/os/store/OSContext';

describe('WindowFrame Component', () => {
    const mockState = {
        theme: { volume: 0.5, muted: false }
    };
    const mockActions = {};

    const defaultProps = {
        item: {
            id: 'win-1',
            title: 'Test Window',
            minimized: false,
            maximized: false,
            pos: { x: 100, y: 100 },
            size: { w: 400, h: 300 }
        },
        isActive: true,
        onFocus: vi.fn(),
        onClose: vi.fn(),
        onMinimize: vi.fn(),
        onMaximize: vi.fn(),
        onMove: vi.fn(),
        onResize: vi.fn()
    };

    const renderWindow = (props = defaultProps) => {
        return render(
            <OSContext.Provider value={{ state: mockState, actions: mockActions }}>
                <WindowFrame {...props}><div data-testid="content">Content</div></WindowFrame>
            </OSContext.Provider>
        );
    };

    it('should render window title', () => {
        renderWindow();
        expect(screen.getByText('Test Window')).toBeInTheDocument();
        expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should call onClose when close button clicked', () => {
        renderWindow();
        const closeBtn = screen.getByLabelText('Close');
        fireEvent.click(closeBtn);
        expect(defaultProps.onClose).toHaveBeenCalledWith('win-1');
    });

    it('should not render if minimized', () => {
        renderWindow({ ...defaultProps, item: { ...defaultProps.item, minimized: true } });
        expect(screen.queryByText('Test Window')).not.toBeInTheDocument();
    });
});
