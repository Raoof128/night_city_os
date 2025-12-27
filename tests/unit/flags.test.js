import { describe, it, expect } from 'vitest';
import { osReducer, ACTIONS, INITIAL_STATE } from '../../src/os/store/osReducer';

describe('Feature Flags Reducer', () => {
    
    it('should toggle a feature flag', () => {
        const action = {
            type: ACTIONS.SET_FLAG,
            payload: { key: 'liveWallpaper', value: true }
        };
        const state = osReducer(INITIAL_STATE, action);
        
        expect(state.flags.liveWallpaper).toBe(true);
    });

    it('should keep other flags unchanged', () => {
        const action = {
            type: ACTIONS.SET_FLAG,
            payload: { key: 'wasmEnabled', value: true }
        };
        const state = osReducer(INITIAL_STATE, action);
        
        expect(state.flags.wasmEnabled).toBe(true);
        expect(state.flags.liveWallpaper).toBe(false);
    });
});
