import { describe, it, expect } from 'vitest';
import { osReducer, ACTIONS, INITIAL_STATE } from '../../src/os/store/osReducer';

describe('Window Manager Unit Tests', () => {
    
    it('should open a new window with correct z-index', () => {
        const action = {
            type: ACTIONS.OPEN_WINDOW,
            payload: { id: 'test-app', type: 'tracker' }
        };
        const state = osReducer(INITIAL_STATE, action);
        
        expect(state.windows).toHaveLength(1);
        expect(state.windows[0].id).toBe('test-app');
        expect(state.activeWindowId).toBe('test-app');
        expect(state.windows[0].zIndex).toBeGreaterThanOrEqual(100);
    });

    it('should snap a window and persist pre-snap dimensions', () => {
        // 1. Open
        let state = osReducer(INITIAL_STATE, {
            type: ACTIONS.OPEN_WINDOW,
            payload: { id: 'snap-test', type: 'terminal', size: { w: 500, h: 400 }, pos: { x: 10, y: 10 } }
        });

        // 2. Snap Left
        state = osReducer(state, {
            type: ACTIONS.SNAP_WINDOW,
            payload: { 
                id: 'snap-test', 
                pos: { x: 0, y: 0 }, 
                size: { w: 400, h: 800 }, 
                snapState: 'left' 
            }
        });

        const win = state.windows[0];
        expect(win.snapState).toBe('left');
        expect(win.preSnapSize).toEqual({ w: 500, h: 400 });
        expect(win.preSnapPos).toEqual({ x: 10, y: 10 });
    });

    it('should focus the next top window when active window closes', () => {
        // Setup: Two windows
        let state = osReducer(INITIAL_STATE, {
            type: ACTIONS.OPEN_WINDOW,
            payload: { id: 'win-1', type: 'app' }
        });
        state = osReducer(state, {
            type: ACTIONS.OPEN_WINDOW,
            payload: { id: 'win-2', type: 'app' }
        }); // win-2 is active, zIndex > win-1

        // Close active (win-2)
        state = osReducer(state, {
            type: ACTIONS.CLOSE_WINDOW,
            payload: { id: 'win-2' }
        });

        expect(state.windows).toHaveLength(1);
        expect(state.activeWindowId).toBe('win-1'); // Should fallback to win-1
    });
});
