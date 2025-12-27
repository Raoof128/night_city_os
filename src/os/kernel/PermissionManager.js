import { ACTIONS } from '../store/osReducer';

export class PermissionManager {
    constructor(dispatch, state) {
        this.dispatch = dispatch;
        this.state = state;
    }

    /**
     * Check if an app has a specific permission.
     * @param {string} appId 
     * @param {string} permission 
     * @returns {'granted' | 'denied' | 'prompt'}
     */
    check(appId, permission) {
        const appPerms = this.state.permissions[appId];
        if (appPerms && appPerms[permission]) {
            return appPerms[permission];
        }
        return 'prompt';
    }

    /**
     * Request a permission. If already decided, returns decision.
     * If not, triggers prompt UI and waits for resolution.
     * @param {string} appId 
     * @param {string} permission 
     * @returns {Promise<'granted' | 'denied'>}
     */
    async request(appId, permission) {
        const status = this.check(appId, permission);
        if (status !== 'prompt') return status;

        return new Promise((resolve) => {
            // We need a unique ID for this request to match the resolution
            // Ideally we store the resolve callback in a transient store or window object
            // But since our reducer is pure, we can't store callbacks there.
            // Workaround: We'll use a custom event on the EventBus or a window-level map.
            
            const reqId = `perm_${Date.now()}_${Math.random()}`;
            
            // Temporary handler for resolution
            const handler = (e) => {
                if (e.detail.reqId === reqId) {
                    window.removeEventListener('sys:perm_resolved', handler);
                    resolve(e.detail.decision);
                }
            };
            window.addEventListener('sys:perm_resolved', handler);

            this.dispatch({
                type: ACTIONS.REQUEST_PERMISSION,
                payload: { appId, permission, reqId }
            });
        });
    }
}
