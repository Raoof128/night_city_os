// Initial state definition
export const INITIAL_STATE = {
    bootState: 'off', // off | booting | login | desktop | shutdown
    windows: [], // { id, type, title, zIndex, minimized, maximized, pos: {x,y}, size: {w,h}, data, spaceId, snapState }
    activeWindowId: null,
    desktopIcons: [
        // { id: 'tracker', label: 'Finance', x: 20, y: 20 },
        { id: 'files', label: 'Files', x: 20, y: 120 },
        { id: 'terminal', label: 'Terminal', x: 20, y: 220 },
        { id: 'network', label: 'NetTrace', x: 20, y: 320 },
        { id: 'textpad', label: 'TextPad', x: 20, y: 420 },
        { id: 'calc', label: 'Calc', x: 120, y: 20 },
        { id: 'music', label: 'Music', x: 120, y: 120 },
        { id: 'settings', label: 'Settings', x: 120, y: 220 },
        { id: 'sysmon', label: 'SysMon', x: 120, y: 320 }
    ], // { id, label, type, x, y }
    notifications: [], // { id, title, message, type, timestamp, read, appId }
    spaces: [{ id: 'main', label: 'Main Space' }],
    currentSpace: 'main',
    // File System Metadata Cache
    fs: {
        nodes: {}, // map id -> node
        rootId: 'root'
    },
    theme: {
        mode: 'night',
        volume: 0.5,
        muted: false
    },
    quickSettings: {
        dnd: false,
        wifi: true,
        bluetooth: true,
        reducedMotion: false,
        contrast: false,
        performanceMode: false
    },
    permissions: {}, // { appId: { permission: 'granted' | 'denied' } }
    permissionRequest: null, // { appId, permission, resolve, reject }
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
    SNAP_WINDOW: 'SNAP_WINDOW',
    MOVE_WINDOW_TO_SPACE: 'MOVE_WINDOW_TO_SPACE',

    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
    CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',

    ADD_SPACE: 'ADD_SPACE',
    REMOVE_SPACE: 'REMOVE_SPACE',
    SET_SPACE: 'SET_SPACE',
    UPDATE_SPACE_LABEL: 'UPDATE_SPACE_LABEL',

    // File System Actions
    FS_SET_NODES: 'FS_SET_NODES',
    FS_UPDATE_NODE: 'FS_UPDATE_NODE',
    FS_DELETE_NODE: 'FS_DELETE_NODE',

    // Permission Actions
    REQUEST_PERMISSION: 'REQUEST_PERMISSION',
    RESOLVE_PERMISSION: 'RESOLVE_PERMISSION',

    SET_THEME: 'SET_THEME',
    SET_QUICK_SETTING: 'SET_QUICK_SETTING',
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
                // Restore if minimized, focus, switch to its space if needed
                const isDifferentSpace = existing.spaceId !== state.currentSpace;
                return {
                    ...state,
                    windows: state.windows.map(w =>
                        w.id === id ? { ...w, minimized: false, zIndex: getNextZ(state.windows) } : w
                    ),
                    activeWindowId: id,
                    currentSpace: isDifferentSpace ? existing.spaceId : state.currentSpace
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
                data: data || {},
                spaceId: state.currentSpace, // Assign to current space
                snapState: null // null | 'left' | 'right' | 'tl' | 'tr' | 'bl' | 'br'
            };

            return {
                ...state,
                windows: [...state.windows, newWindow],
                activeWindowId: newWindow.id
            };
        }

        case ACTIONS.CLOSE_WINDOW: {
            const remainingWindows = state.windows.filter(w => w.id !== action.payload.id);
            let nextActiveId = state.activeWindowId === action.payload.id ? null : state.activeWindowId;

            // If we closed the active window, focus the one with highest z-index in current space
            if (state.activeWindowId === action.payload.id && remainingWindows.length > 0) {
                // Filter by space if we want to be strict, but for now just global z
                const sameSpace = remainingWindows.filter(w => w.spaceId === state.currentSpace);
                if (sameSpace.length > 0) {
                    const top = sameSpace.reduce((prev, current) => (prev.zIndex > current.zIndex) ? prev : current);
                    nextActiveId = top.id;
                }
            }

            return {
                ...state,
                windows: remainingWindows,
                activeWindowId: nextActiveId
            };
        }

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
                    w.id === action.payload.id ? { 
                        ...w, 
                        maximized: !w.maximized, 
                        snapState: null,
                        // Store pre-max size if maximizing
                        preSnapSize: !w.maximized ? w.size : w.preSnapSize,
                        preSnapPos: !w.maximized ? w.pos : w.preSnapPos,
                        // Restore if unmaximizing
                        size: w.maximized && w.preSnapSize ? w.preSnapSize : w.size,
                        pos: w.maximized && w.preSnapPos ? w.preSnapPos : w.pos
                    } : w
                )
            };

        case ACTIONS.UPDATE_WINDOW_POS:
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.payload.id ? { 
                        ...w, 
                        pos: action.payload.pos, 
                        snapState: null, 
                        maximized: false,
                        // Restore size if we were snapped/maximized and now moving
                        size: (w.snapState || w.maximized) && w.preSnapSize ? w.preSnapSize : w.size
                    } : w
                )
            };

        case ACTIONS.UPDATE_WINDOW_SIZE:
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.payload.id ? { 
                        ...w, 
                        size: action.payload.size, 
                        snapState: null, 
                        maximized: false 
                    } : w
                )
            };

        case ACTIONS.SNAP_WINDOW:
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.payload.id ? {
                        ...w,
                        // Save state before snapping if not already snapped
                        preSnapSize: w.snapState ? w.preSnapSize : w.size,
                        preSnapPos: w.snapState ? w.preSnapPos : w.pos,
                        pos: action.payload.pos,
                        size: action.payload.size,
                        snapState: action.payload.snapState,
                        maximized: false
                    } : w
                )
            };

        case ACTIONS.MOVE_WINDOW_TO_SPACE:
            return {
                ...state,
                windows: state.windows.map(w =>
                    w.id === action.payload.id ? { ...w, spaceId: action.payload.spaceId } : w
                )
            };

        case ACTIONS.ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [
                    {
                        id: `notif-${Date.now()}-${Math.random()}`,
                        timestamp: Date.now(),
                        read: false,
                        ...action.payload
                    },
                    ...state.notifications
                ].slice(0, 100) // Keep last 100
            };

        case ACTIONS.REMOVE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload.id)
            };

        case ACTIONS.CLEAR_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload && action.payload.appId
                    ? state.notifications.filter(n => n.appId !== action.payload.appId)
                    : []
            };

        case ACTIONS.ADD_SPACE: {
            const newSpaceId = `space-${Date.now()}`;
            return {
                ...state,
                spaces: [...state.spaces, { id: newSpaceId, label: `Space ${state.spaces.length + 1}` }],
                currentSpace: newSpaceId
            };
        }

        case ACTIONS.REMOVE_SPACE: {
            if (state.spaces.length <= 1) return state; // Don't delete last space
            const spacesAfterRemove = state.spaces.filter(s => s.id !== action.payload.id);
            
            // Move windows from deleted space to main space (or first available)
            const fallbackSpaceId = spacesAfterRemove[0].id;
            const updatedWindows = state.windows.map(w => 
                w.spaceId === action.payload.id ? { ...w, spaceId: fallbackSpaceId } : w
            );

            return {
                ...state,
                spaces: spacesAfterRemove,
                windows: updatedWindows,
                currentSpace: state.currentSpace === action.payload.id ? fallbackSpaceId : state.currentSpace
            };
        }

        case ACTIONS.SET_SPACE:
            return {
                ...state,
                currentSpace: action.payload.id
            };
        
        case ACTIONS.UPDATE_SPACE_LABEL:
            return {
                ...state,
                spaces: state.spaces.map(s => s.id === action.payload.id ? { ...s, label: action.payload.label } : s)
            };

        case ACTIONS.FS_SET_NODES:
            return {
                ...state,
                fs: { ...state.fs, nodes: action.payload }
            };

        case ACTIONS.FS_UPDATE_NODE:
            return {
                ...state,
                fs: {
                    ...state.fs,
                    nodes: { ...state.fs.nodes, [action.payload.id]: action.payload }
                }
            };

        case ACTIONS.FS_DELETE_NODE: {
            const newNodes = { ...state.fs.nodes };
            delete newNodes[action.payload.id];
            return {
                ...state,
                fs: { ...state.fs, nodes: newNodes }
            };
        }

        case ACTIONS.REQUEST_PERMISSION:
            return {
                ...state,
                permissionRequest: action.payload // { appId, permission, resolveId }
            };

        case ACTIONS.RESOLVE_PERMISSION: {
            const { appId, permission, decision } = action.payload;
            return {
                ...state,
                permissionRequest: null,
                permissions: {
                    ...state.permissions,
                    [appId]: {
                        ...state.permissions[appId],
                        [permission]: decision
                    }
                }
            };
        }

        case ACTIONS.SET_QUICK_SETTING:
            return {
                ...state,
                quickSettings: { ...state.quickSettings, [action.payload.key]: action.payload.value }
            };

        case ACTIONS.RESET_STATE:
            return INITIAL_STATE;

        case ACTIONS.RESTORE_STATE:
            // Merge restored state with initial structure to ensure new fields exist
            return { 
                ...INITIAL_STATE, 
                ...action.payload,
                // Ensure spaces exist if restoring from old state
                spaces: action.payload.spaces || INITIAL_STATE.spaces,
                currentSpace: action.payload.currentSpace || INITIAL_STATE.currentSpace,
                quickSettings: { ...INITIAL_STATE.quickSettings, ...(action.payload.quickSettings || {}) },
                fs: { ...INITIAL_STATE.fs, ...(action.payload.fs || {}) },
                permissions: action.payload.permissions || {}
            };

        default:
            return state;
    }
}

function getNextZ(windows) {
    if (windows.length === 0) return Z_INDEX_BASE;
    return Math.max(...windows.map(w => w.zIndex || 0)) + 1;
}
