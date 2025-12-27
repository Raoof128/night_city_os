import { describe, it, expect, vi } from 'vitest';
import { PermissionManager } from '../../src/os/kernel/PermissionManager';
import { ACTIONS } from '../../src/os/store/osReducer';

describe('Permission Manager Integration', () => {
    
    it('should return granted if already allowed', async () => {
        const state = {
            permissions: {
                'app-1': { 'files:read': 'granted' }
            }
        };
        const dispatch = vi.fn();
        const pm = new PermissionManager(dispatch, state);

        const result = await pm.request('app-1', 'files:read');
        expect(result).toBe('granted');
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('should request permission if not decided', async () => {
        const state = { permissions: {} };
        const dispatch = vi.fn();
        const pm = new PermissionManager(dispatch, state);

        // Mock the window event dispatching to simulate user allowing
        const requestPromise = pm.request('app-1', 'files:read');
        
        // Dispatch was called with REQUEST_PERMISSION?
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: ACTIONS.REQUEST_PERMISSION,
            payload: expect.objectContaining({
                appId: 'app-1',
                permission: 'files:read'
            })
        }));

        // Get the reqId from the dispatch call to simulate resolution
        const reqId = dispatch.mock.calls[0][0].payload.reqId;

        // Simulate resolution event
        window.dispatchEvent(new CustomEvent('sys:perm_resolved', {
            detail: { reqId, decision: 'granted' }
        }));

        const result = await requestPromise;
        expect(result).toBe('granted');
    });
});
