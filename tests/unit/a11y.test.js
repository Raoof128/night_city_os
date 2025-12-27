import { describe, it, expect } from 'vitest';
import { osReducer, ACTIONS, INITIAL_STATE } from '../../src/os/store/osReducer';

describe('Accessibility Reducer Logic', () => {
    
    it('should update fontScale in quickSettings', () => {
        const action = {
            type: ACTIONS.SET_QUICK_SETTING,
            payload: { key: 'fontScale', value: 1.2 }
        };
        const state = osReducer(INITIAL_STATE, action);
        
        expect(state.quickSettings.fontScale).toBe(1.2);
    });

    it('should update highContrast in quickSettings', () => {
        const action = {
            type: ACTIONS.SET_QUICK_SETTING,
            payload: { key: 'highContrast', value: true }
        };
        const state = osReducer(INITIAL_STATE, action);
        
        expect(state.quickSettings.highContrast).toBe(true);
    });

    it('should handle LOCK/UNLOCK actions', () => {
        let state = osReducer(INITIAL_STATE, { type: ACTIONS.LOCK_SESSION });
        expect(state.locked).toBe(true);

        state = osReducer(state, { type: ACTIONS.UNLOCK_SESSION });
        expect(state.locked).toBe(false);
    });
});
