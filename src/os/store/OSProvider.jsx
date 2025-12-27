import { useReducer, useEffect } from 'react';
import { osReducer, INITIAL_STATE, ACTIONS } from './osReducer';
import { EventBus, EVENTS } from '../kernel/eventBus';
import { OSContext } from './OSContext';
import { storage } from '../kernel/storage';
import { fileIndexer } from '../kernel/indexer';
import { nanoid } from 'nanoid';

export const OSProvider = ({ children }) => {
    const [state, dispatch] = useReducer(osReducer, INITIAL_STATE);

    // Initial Load & Persistence
    useEffect(() => {
        const initOS = async () => {
            await storage.init();

            // 1. Load System State
            const savedState = await storage.loadSysState();
            if (savedState) {
                dispatch({ type: ACTIONS.RESTORE_STATE, payload: savedState });
            }

            // 2. Load File System Metadata (Flat list of all nodes)
            // For Phase 2, we load all nodes into memory. Real OS would paginate/lazy load.
            // IDB `getAll` isn't exposed in our storage wrapper for all nodes, let's add a helper or iterate.
            // Actually, let's just use `storage.db.getAll('fs_nodes')` directly here or add `loadAllNodes` to storage.
            // Since I can't easily edit storage.js without a separate tool call, I'll access the public db instance if available or just rely on 'root' listing?
            // Wait, Redux needs the whole tree to be useful for global selectors.
            // Let's assume we list from 'root' recursively or just fetch all if possible.
            // For now, let's trust that the user starts at root and we load children on demand? 
            // NO, the requirements said "Move persistence...". Ideally we load the "nodes" map.
            
            // Let's fetch all nodes from IDB manually using the exposed db instance or adding a method.
            // Accessing `storage.db` directly is fine since it's a singleton export.
            if (storage.db) {
                const allNodes = await storage.db.getAll('fs_nodes');
                const nodeMap = allNodes.reduce((acc, node) => {
                    acc[node.id] = node;
                    return acc;
                }, {});
                
                // Seed root if empty
                if (!nodeMap['root']) {
                    const rootNode = { id: 'root', name: 'Root', type: 'folder', parentId: null, created: Date.now(), modified: Date.now() };
                    await storage.createNode(rootNode);
                    nodeMap['root'] = rootNode;
                }

                dispatch({ type: ACTIONS.FS_SET_NODES, payload: nodeMap });
            }
        };

        initOS();
    }, []);

    // A11y & System Prefs
    useEffect(() => {
        const root = document.documentElement;
        
        // Apply Font Scale
        root.style.fontSize = `${(state.quickSettings.fontScale || 1.0) * 16}px`;
        
        // Apply High Contrast
        if (state.quickSettings.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Apply Reduced Motion
        if (state.quickSettings.reducedMotion) {
            root.classList.add('reduced-motion');
        } else {
            root.classList.remove('reduced-motion');
        }
    }, [state.quickSettings.fontScale, state.quickSettings.highContrast, state.quickSettings.reducedMotion]);

    // System Media Query Listeners
    useEffect(() => {
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const contrastQuery = window.matchMedia('(prefers-contrast: more)');

        const handleMotion = (e) => dispatch({ 
            type: ACTIONS.SET_QUICK_SETTING, 
            payload: { key: 'reducedMotion', value: e.matches } 
        });
        const handleContrast = (e) => dispatch({ 
            type: ACTIONS.SET_QUICK_SETTING, 
            payload: { key: 'highContrast', value: e.matches } 
        });

        motionQuery.addEventListener('change', handleMotion);
        contrastQuery.addEventListener('change', handleContrast);

        return () => {
            motionQuery.removeEventListener('change', handleMotion);
            contrastQuery.removeEventListener('change', handleContrast);
        };
    }, []);

    // Persistence Middleware (Debounced ideally, but here just effect)
    useEffect(() => {
        if (!state) return;
        
        // Save only non-FS state to sys_snapshot
        const snapshot = {
            windows: state.windows,
            theme: state.theme,
            desktopIcons: state.desktopIcons,
            spaces: state.spaces,
            currentSpace: state.currentSpace,
            quickSettings: state.quickSettings,
            permissions: state.permissions,
            flags: state.flags
        };
        
        storage.saveSysState(snapshot).catch(e => console.error('State Save Failed', e));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.windows, state.theme, state.desktopIcons, state.spaces, state.currentSpace, state.quickSettings, state.permissions, state.flags]);

    // Event Bus Bridge
    useEffect(() => {
        const handleSysError = (payload) => {
            console.error('CRITICAL OS ERROR:', payload);
            dispatch({
                type: ACTIONS.ADD_NOTIFICATION,
                payload: {
                    title: 'System Error',
                    message: typeof payload === 'string' ? payload : (payload.error || 'Unknown Error'),
                    type: 'error',
                    appId: 'system'
                }
            });
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
        snapWindow: (id, pos, size, snapState) => dispatch({ type: ACTIONS.SNAP_WINDOW, payload: { id, pos, size, snapState } }),

        // Notifications
        addNotification: (notif) => dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notif }),
        removeNotification: (id) => dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: { id } }),
        clearNotifications: (appId) => dispatch({ type: ACTIONS.CLEAR_NOTIFICATIONS, payload: { appId } }),

        // Spaces
        addSpace: () => dispatch({ type: ACTIONS.ADD_SPACE }),
        removeSpace: (id) => dispatch({ type: ACTIONS.REMOVE_SPACE, payload: { id } }),
        setSpace: (id) => dispatch({ type: ACTIONS.SET_SPACE, payload: { id } }),
        updateSpaceLabel: (id, label) => dispatch({ type: ACTIONS.UPDATE_SPACE_LABEL, payload: { id, label } }),
        moveWindowToSpace: (id, spaceId) => dispatch({ type: ACTIONS.MOVE_WINDOW_TO_SPACE, payload: { id, spaceId } }),

        // Settings
        setQuickSetting: (key, value) => dispatch({ type: ACTIONS.SET_QUICK_SETTING, payload: { key, value } }),
        setFlag: (key, value) => dispatch({ type: ACTIONS.SET_FLAG, payload: { key, value } }),

        // Permissions
        resolvePermission: (appId, permission, decision) => dispatch({ type: ACTIONS.RESOLVE_PERMISSION, payload: { appId, permission, decision } }),
        revokePermission: (appId, permission) => dispatch({ type: ACTIONS.REVOKE_PERMISSION, payload: { appId, permission } }),

        // Profiles
        setProfile: async (profileId) => {
            // Persist current state before switch
            const snapshot = {
                windows: state.windows,
                theme: state.theme,
                desktopIcons: state.desktopIcons,
                spaces: state.spaces,
                currentSpace: state.currentSpace,
                quickSettings: state.quickSettings,
                permissions: state.permissions
            };
            await storage.saveSysState(snapshot);

            // Switch Storage
            storage.setProfile(profileId);
            await storage.init();

            // Load New State
            const newState = await storage.loadSysState();
            // Reset to clean slate if no state found
            dispatch({ type: ACTIONS.RESTORE_STATE, payload: newState || INITIAL_STATE });
            
            // Reload FS Metadata for new profile
            if (storage.db) {
                const allNodes = await storage.db.getAll('fs_nodes');
                const nodeMap = allNodes.reduce((acc, node) => {
                    acc[node.id] = node;
                    return acc;
                }, {});
                
                if (!nodeMap['root']) {
                    const rootNode = { id: 'root', name: 'Root', type: 'folder', parentId: null, created: Date.now(), modified: Date.now() };
                    await storage.createNode(rootNode);
                    nodeMap['root'] = rootNode;
                }
                dispatch({ type: ACTIONS.FS_SET_NODES, payload: nodeMap });
            }
            
            // Save active profile preference globally (using localStorage as meta-store)
            localStorage.setItem('nc_active_profile', profileId);
        },

        // --- File System Operations ---
        fs: {
            createFile: async (parentId, name, content = '') => {
                const id = nanoid();
                const node = {
                    id,
                    parentId,
                    name,
                    type: 'file',
                    mime: 'text/plain', // Simplification
                    size: content.length,
                    created: Date.now(),
                    modified: Date.now()
                };
                const blob = new Blob([content], { type: 'text/plain' });
                await storage.createNode(node, blob);
                fileIndexer.add(node, content); // Indexing
                dispatch({ type: ACTIONS.FS_UPDATE_NODE, payload: node });
                return node;
            },
            createFolder: async (parentId, name) => {
                const id = nanoid();
                const node = {
                    id,
                    parentId,
                    name,
                    type: 'folder',
                    created: Date.now(),
                    modified: Date.now()
                };
                await storage.createNode(node);
                fileIndexer.add(node); // Index folder name
                dispatch({ type: ACTIONS.FS_UPDATE_NODE, payload: node });
                return node;
            },
            deleteNode: async (id) => {
                await storage.deleteNode(id);
                fileIndexer.remove(id); // Remove from index
                dispatch({ type: ACTIONS.FS_DELETE_NODE, payload: { id } });
            },
            readFile: async (id) => {
                return await storage.readFile(id);
            },
            listNodes: async (parentId) => {
                return await storage.listNodes(parentId);
            },
            updateFile: async (id, content) => {
                // Update blob in OPFS
                const node = state.fs.nodes[id];
                if (!node) return;
                
                const blob = new Blob([content], { type: node.mime || 'text/plain' });
                // We reuse createNode for overwrite in our simple storage implementation logic, 
                // but storage.js creates a new handle. It supports overwrite naturally.
                // We must also update metadata (modified time/size).
                const updatedNode = { ...node, modified: Date.now(), size: blob.size };
                await storage.createNode(updatedNode, blob); 
                fileIndexer.add(updatedNode, content); // Re-index
                dispatch({ type: ACTIONS.FS_UPDATE_NODE, payload: updatedNode });
            },
            mountDrive: async () => {
                try {
                    const dirHandle = await window.showDirectoryPicker();
                    const mountId = await storage.mountDrive(dirHandle);
                    
                    // The mount creates a virtual node in storage.js, we need to sync it to Redux
                    const mountNode = await storage.getNode(mountId); // Use same ID or specific logic? 
                    // storage.mountDrive created a node with id=mountId.
                    // Let's fetch it.
                    if (mountNode) {
                         dispatch({ type: ACTIONS.FS_UPDATE_NODE, payload: mountNode });
                    }
                } catch (e) {
                    if (e.name !== 'AbortError') console.error('Mount failed', e);
                }
            }
        },

        resetState: () => {
            // Clear IDB? Ideally yes.
            // localStorage.removeItem(STORAGE_KEY);
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