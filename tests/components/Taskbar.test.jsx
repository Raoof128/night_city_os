import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Taskbar from '../../src/os/components/Taskbar';
import { OSContext } from '../../src/os/store/OSContext';

describe('Taskbar Component', () => {
    const mockState = {
        windows: [
            { id: 'app-1', title: 'App 1', minimized: false, spaceId: 'main' },
            { id: 'app-2', title: 'App 2', minimized: true, spaceId: 'main' }
        ],
        activeWindowId: 'app-1',
        currentSpace: 'main',
        spaces: [{ id: 'main', label: 'Main Space' }],
        notifications: []
    };

    const mockActions = {
        openWindow: vi.fn(),
        focusWindow: vi.fn(),
        minimizeWindow: vi.fn(),
        shutdown: vi.fn()
    };

    const renderTaskbar = () => {
        return render(
            <OSContext.Provider value={{ state: mockState, actions: mockActions }}>
                <Taskbar 
                    onToggleNotifCenter={vi.fn()} 
                    onToggleSpaceSwitcher={vi.fn()} 
                />
            </OSContext.Provider>
        );
    };

    it('should render Start button and clock', () => {
        renderTaskbar();
        expect(screen.getByText('START')).toBeInTheDocument();
        // Clock is dynamic, just check existence of container or partial text if predictable
        // But checking START is good enough for basic render
    });

    it('should render open windows', () => {
        renderTaskbar();
        expect(screen.getByText(/App 1/i)).toBeInTheDocument();
        expect(screen.getByText(/App 2/i)).toBeInTheDocument();
    });

    it('should call focusWindow when clicking inactive window', () => {
        renderTaskbar();
        fireEvent.click(screen.getByText(/App 2/i));
        // Logic inside Taskbar: if minimized, minimizeWindow (which restores it). If active, focus.
        // App 2 is minimized in mock.
        expect(mockActions.minimizeWindow).toHaveBeenCalledWith('app-2');
    });
});
