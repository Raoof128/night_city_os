import { Component, Suspense, useMemo } from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Loader } from 'lucide-react';
import { PermissionManager } from './PermissionManager';
import { ClipboardManager } from './Clipboard';
import AppContext from './AppContext';

// --- Error Boundary ---
class AppErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(`[App Crash] ${this.props.appId}:`, error, errorInfo);
    }

    handleRestart = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-full flex flex-col items-center justify-center bg-black/90 p-6 text-center">
                    <AlertTriangle size={48} className="text-[var(--color-red)] mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">APP CRASHED</h2>
                    <p className="text-xs text-gray-400 font-mono mb-6 max-w-xs break-words">
                        {this.state.error?.message || 'Unknown runtime error'}
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={this.handleRestart}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-blue)] text-black font-bold rounded hover:bg-white transition-colors"
                        >
                            <RefreshCw size={16} /> RESTART
                        </button>
                        <button 
                            onClick={this.props.onClose}
                            className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white font-bold rounded hover:bg-white/10 transition-colors"
                        >
                            <X size={16} /> CLOSE
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// --- App Container ---
const AppContainer = ({ manifest, data, osActions, osState, onClose, dispatch, isMinimized, isActive }) => {
    
    // Memoize the API to avoid re-renders
    const appApi = useMemo(() => {
        const pm = new PermissionManager(dispatch, osState);
        const clipboard = new ClipboardManager(pm);

        const checkPerm = async (perm) => {
            const result = await pm.request(manifest.id, perm);
            if (result !== 'granted') throw new Error(`Permission denied: ${perm}`);
        };

        return {
            meta: {
                id: manifest.id,
                name: manifest.name,
                version: manifest.version
            },
            lifecycle: {
                status: isMinimized ? 'suspended' : (isActive ? 'active' : 'background'),
            },
            openWindow: osActions.openWindow,
            closeWindow: osActions.closeWindow,
            addNotification: osActions.addNotification,
            
            // System State Access (Read-Only)
            system: {
                permissions: osState.permissions,
                windows: osState.windows,
                theme: osState.theme,
                spaces: osState.spaces,
                flags: osState.flags,
                quickSettings: osState.quickSettings,
                revokePermission: osActions.revokePermission,
                setQuickSetting: osActions.setQuickSetting,
                setFlag: osActions.setFlag
            },

            // Clipboard Wrapper
            clipboard: {
                readText: () => clipboard.readText(manifest.id),
                writeText: (text) => clipboard.writeText(manifest.id, text)
            },

            // App-Specific KV Storage
            storage: {
                getItem: (key) => localStorage.getItem(`app:${manifest.id}:${key}`),
                setItem: (key, value) => localStorage.setItem(`app:${manifest.id}:${key}`, value),
                removeItem: (key) => localStorage.removeItem(`app:${manifest.id}:${key}`),
                clear: () => {
                    const prefix = `app:${manifest.id}:`;
                    Object.keys(localStorage)
                        .filter(k => k.startsWith(prefix))
                        .forEach(k => localStorage.removeItem(k));
                }
            },

            // Wrapped File System
            fs: {
                createFile: async (...args) => {
                    await checkPerm('files:write');
                    return osActions.fs.createFile(...args);
                },
                createFolder: async (...args) => {
                    await checkPerm('files:write');
                    return osActions.fs.createFolder(...args);
                },
                updateFile: async (...args) => {
                    await checkPerm('files:write');
                    return osActions.fs.updateFile(...args);
                },
                deleteNode: async (...args) => {
                    await checkPerm('files:manage');
                    return osActions.fs.deleteNode(...args);
                },
                readFile: async (...args) => {
                    await checkPerm('files:read');
                    return osActions.fs.readFile(...args);
                },
                listNodes: async (...args) => {
                    await checkPerm('files:read');
                    return osActions.fs.listNodes(...args);
                },
                mountDrive: async (...args) => {
                    await checkPerm('mount:manage');
                    return osActions.fs.mountDrive(...args);
                }
            },
            
            launchArgs: data
        };
    }, [manifest.id, manifest.name, manifest.version, osActions, osState, dispatch, data, isMinimized, isActive]);

    const AppComponent = manifest.component;

    return (
        <AppContext.Provider value={appApi}>
            <AppErrorBoundary appId={manifest.id} onClose={() => onClose(manifest.id)}>
                <Suspense fallback={
                    <div className="h-full flex items-center justify-center text-[var(--color-yellow)]">
                        <Loader className="animate-spin" />
                    </div>
                }>
                    {/* Inject props for backward compatibility with P0 apps that expect props directly */}
                    <AppComponent 
                        data={data} 
                        config={osState.theme} 
                        // Audit log injection if needed by old apps
                        auditLog={[]} 
                    />
                </Suspense>
            </AppErrorBoundary>
        </AppContext.Provider>
    );
};

export default AppContainer;
