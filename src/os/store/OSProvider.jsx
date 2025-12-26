import { useReducer, useEffect } from 'react';
import { osReducer, INITIAL_STATE, ACTIONS } from './osReducer';
import { EventBus, EVENTS } from '../kernel/eventBus';
import { OSContext } from './OSContext';

const STORAGE_KEY = 'nc_os_v5_snapshot';

export const OSProvider = ({ children }) => {
    const [state, dispatch] = useReducer(osReducer, INITIAL_STATE);

    // Persistence Middleware
    useEffect(() => {
        const snapshot = {
            windows: state.windows,
            theme: state.theme,
            desktopIcons: state.desktopIcons
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
        } catch (e) {
            console.error('Failed to persist OS state', e);
        }
    }, [state.windows, state.theme, state.desktopIcons]);

    // Hydration
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const snapshot = JSON.parse(saved);
                // Validate schema rudimentarily
                if (Array.isArray(snapshot.windows)) {
                    dispatch({ type: ACTIONS.RESTORE_STATE, payload: snapshot });
                }
            }
        } catch (e) {
            console.error('Failed to load OS state', e);
        }
    }, []);

    // Event Bus Bridge
    useEffect(() => {
        const handleSysError = (err) => {
            console.error('CRITICAL OS ERROR:', err);
            // In a real scenario, we might dispatch an error state here
        };

        const cleanup = EventBus.on(EVENTS.SYS_ERROR, handleSysError);
        return cleanup;
    }, []);

    // Command Interface
    const osActions = {
        boot: () => dispatch({ type: ACTIONS.BOOT_START }),
        login: () => dispatch({ type: ACTIONS.BOOT_COMPLETE }),
        shutdown: () => dispatch({ type: ACTIONS.SHUTDOWN }),
        reboot: () => {
            dispatch({ type: ACTIONS.SHUTDOWN });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        },

        openWindow: (id, type, data, title) => {
            dispatch({ type: ACTIONS.OPEN_WINDOW, payload: { id, type, data, title } });
            EventBus.emit(EVENTS.WIN_OPEN, { id, type });
        },
        closeWindow: (id) => {
            dispatch({ type: ACTIONS.CLOSE_WINDOW, payload: { id } });
            EventBus.emit(EVENTS.WIN_CLOSE, { id });
        },
        focusWindow: (id) => dispatch({ type: ACTIONS.FOCUS_WINDOW, payload: { id } }),
        minimizeWindow: (id) => dispatch({ type: ACTIONS.MINIMIZE_WINDOW, payload: { id } }),
        maximizeWindow: (id) => dispatch({ type: ACTIONS.MAXIMIZE_WINDOW, payload: { id } }),
        moveWindow: (id, pos) => dispatch({ type: ACTIONS.UPDATE_WINDOW_POS, payload: { id, pos } }),
        resizeWindow: (id, size) => dispatch({ type: ACTIONS.UPDATE_WINDOW_SIZE, payload: { id, size } }),

        resetState: () => {
            localStorage.removeItem(STORAGE_KEY);
            dispatch({ type: ACTIONS.RESET_STATE });
            window.location.reload();
        }
    };

    return (
        <OSContext.Provider value={{ state, actions: osActions, dispatch }}>
            {children}
        </OSContext.Provider>
    );
};
