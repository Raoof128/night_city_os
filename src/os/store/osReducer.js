// Initial state definition
export const INITIAL_STATE = {
    bootState: 'off', // off | booting | login | desktop | shutdown
    windows: [], // { id, type, title, zIndex, minimized, maximized, pos: {x,y}, size: {w,h}, data }
    activeWindowId: null,
    desktopIcons: [], // { id, label, type, x, y }
    theme: {
        mode: 'night',
        volume: 0.5,
        muted: false
    },
    user: null
};

// Action Types
export const ACTIONS = {
    BOOT_START: 'BOOT_START',
    BOOT_COMPLETE: 'BOOT_COMPLETE',
    SHUTDOWN: 'SHUTDOWN',

    OPEN_WINDOW: 'OPEN_WINDOW',
    CLOSE_WINDOW: 'CLOSE_WINDOW',
    FOCUS_WINDOW: 'FOCUS_WINDOW',
    MINIMIZE_WINDOW: 'MINIMIZE_WINDOW',
    MAXIMIZE_WINDOW: 'MAXIMIZE_WINDOW',
    UPDATE_WINDOW_POS: 'UPDATE_WINDOW_POS',
    UPDATE_WINDOW_SIZE: 'UPDATE_WINDOW_SIZE',

    SET_THEME: 'SET_THEME',
    RESET_STATE: 'RESET_STATE',
    RESTORE_STATE: 'RESTORE_STATE'
};

const Z_INDEX_BASE = 100;

export function osReducer(state, action) {
    switch (action.type) {
        case ACTIONS.BOOT_START:
            return { ...state, bootState: 'booting' };

        case ACTIONS.BOOT_COMPLETE:
            return { ...state, bootState: 'desktop' };

        case ACTIONS.SHUTDOWN:
            return { ...state, bootState: 'shutdown' };

        case ACTIONS.OPEN_WINDOW: {
            const { id, type, title, data, pos, size } = action.payload;
            const existing = state.windows.find(w => w.id === id);

            if (existing) {
                // Restore if minimized, focus
                return {
                    ...state,
                    windows: state.windows.map(w =>
                        w.id === id ? { ...w, minimized: false, zIndex: getNextZ(state.windows) } : w
                    ),
                    activeWindowId: id
                };
            }

            const newWindow = {
                id: id || `${type}-${Date.now()}`,
                type,
                title: title || type,
                zIndex: getNextZ(state.windows),
                minimized: false,
                maximized: false,
                pos: pos || { x: 100, y: 100 },
                size: size || { w: 800, h: 600 },
                data: data || {}
            };

            return {
                ...state,
                windows: [...state.windows, newWindow],
                activeWindowId: newWindow.id
            };
        }

        case ACTIONS.CLOSE_WINDOW:
            return {
                ...state,
                windows: state.windows.filter(w => w.id !== action.payload.id),
                activeWindowId: state.activeWindowId === action.payload.id ? null : state.activeWindowId
            };

        case ACTIONS.FOCUS_WINDOW:
            if (state.activeWindowId === action.payload.id) return state;
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.payload.id ? { ...w, zIndex: getNextZ(state.windows) } : w
                ),
                activeWindowId: action.payload.id
            };

        case ACTIONS.MINIMIZE_WINDOW:
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.payload.id ? { ...w, minimized: !w.minimized } : w
                )
            };

        case ACTIONS.MAXIMIZE_WINDOW:
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.payload.id ? { ...w, maximized: !w.maximized } : w
                )
            };

        case ACTIONS.UPDATE_WINDOW_POS:
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.payload.id ? { ...w, pos: action.payload.pos } : w
                )
            };

        case ACTIONS.UPDATE_WINDOW_SIZE:
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.payload.id ? { ...w, size: action.payload.size } : w
                )
            };

        case ACTIONS.RESET_STATE:
            return INITIAL_STATE;

        case ACTIONS.RESTORE_STATE:
            return { ...state, ...action.payload };

        default:
            return state;
    }
}

function getNextZ(windows) {
    if (windows.length === 0) return Z_INDEX_BASE;
    return Math.max(...windows.map(w => w.zIndex || 0)) + 1;
}
