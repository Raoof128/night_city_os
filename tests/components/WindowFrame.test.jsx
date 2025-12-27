import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WindowFrame from '../../src/components/WindowFrame';

describe('WindowFrame Component', () => {
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

    it('should render window title', () => {
        render(<WindowFrame {...defaultProps}><div data-testid="content">Content</div></WindowFrame>);
        expect(screen.getByText('Test Window')).toBeInTheDocument();
        expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should call onClose when close button clicked', () => {
        render(<WindowFrame {...defaultProps} />);
        const closeBtn = screen.getByLabelText('Close');
        fireEvent.click(closeBtn);
        expect(defaultProps.onClose).toHaveBeenCalledWith('win-1');
    });

    it('should not render if minimized', () => {
        render(<WindowFrame {...defaultProps} item={{ ...defaultProps.item, minimized: true }} />);
        expect(screen.queryByText('Test Window')).not.toBeInTheDocument();
    });
});
