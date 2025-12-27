import { useEffect, useState } from 'react';
import { useOS } from '../os/hooks/useOS';
import BootScreen from './BootScreen';
import ShutdownScreen from './ShutdownScreen';
import WindowFrame from './WindowFrame';
import Desktop from '../os/components/Desktop';
import Taskbar from '../os/components/Taskbar';

// System Components
import AppSwitcher from '../os/components/AppSwitcher';
import VirtualDesktopSwitcher from '../os/components/VirtualDesktopSwitcher';
import NotificationCenter from '../os/components/NotificationCenter';
import ToastManager from '../os/components/ToastManager';
import PermissionPrompt from '../os/components/PermissionPrompt';
import LockScreen from '../os/components/LockScreen';

// Kernel
import { SYSTEM_APPS, resolveFileHandler } from '../os/kernel/registry';
import AppContainer from '../os/kernel/AppContainer';
import { fileIndexer } from '../os/kernel/indexer';

const Shell = () => {
    const { state, actions } = useOS();
    const { bootState, windows, activeWindowId, currentSpace } = state;
    const [notifCenterOpen, setNotifCenterOpen] = useState(false);
    const [spaceSwitcherOpen, setSpaceSwitcherOpen] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [paletteCommands, setPaletteCommands] = useState([]);

    // Hydrate Commands on Open
    useEffect(() => {
        if (paletteOpen) {
            const systemCommands = Object.values(SYSTEM_APPS).map(app => ({
                name: `Open ${app.name}`,
                icon: app.icon,
                action: () => actions.openWindow(app.id, app.id)
            }));

            // Basic Search Integration
            // Ideally we pass query to palette and let it call search, but for P4 MVP we preload top results? 
            // Better: CommandPalette needs to call search on type. 
            // For now, let's just show apps. Real search happens in Palette logic if we refactor it.
            // Wait, CommandPalette logic filters `commands` prop.
            // We need to inject file results into `commands` prop dynamically? 
            // Or refactor CommandPalette to accept a `onSearch` prop.
            // Let's refactor CommandPalette next. For now, just apps.
            setPaletteCommands(systemCommands);
        }
    }, [paletteOpen, actions]);

    // Global Keyboard Shortcuts
    useEffect(() => {
        const handleGlobalKeys = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setPaletteOpen(true);
            }
        };
        window.addEventListener('keydown', handleGlobalKeys);
        return () => window.removeEventListener('keydown', handleGlobalKeys);
    }, []);

    if (bootState === 'booting') {
        return <BootScreen onComplete={actions.login} />;
    }

    if (bootState === 'shutdown') {
        return <ShutdownScreen onReboot={actions.reboot} />;
    }

    if (bootState === 'desktop') {
        // Filter windows for current space
        const visibleWindows = windows.filter(w => w.spaceId === currentSpace);

        return (
            <div className="relative w-screen h-screen overflow-hidden bg-black" onContextMenu={(e) => e.preventDefault()}>
                <LockScreen />
                <Desktop />
                
                {/* System Overlays */}
                <ToastManager />
                <PermissionPrompt />
                <CommandPalette 
                    isOpen={paletteOpen} 
                    onClose={() => setPaletteOpen(false)} 
                    commands={paletteCommands}
                    onSearch={(q) => {
                        const fileResults = fileIndexer.search(q).map(f => ({
                            name: f.name,
                            icon: SYSTEM_APPS['files'].icon, // Generic icon
                            shortcut: 'FILE',
                            action: () => {
                                const handler = resolveFileHandler(f.name);
                                if (handler) actions.openWindow(handler, handler, { fileId: f.id, name: f.name });
                            }
                        }));
                        // Merge with apps (simple logic)
                        const apps = Object.values(SYSTEM_APPS)
                            .filter(a => a.name.toLowerCase().includes(q.toLowerCase()))
                            .map(app => ({
                                name: `Open ${app.name}`,
                                icon: app.icon,
                                action: () => actions.openWindow(app.id, app.id)
                            }));
                        setPaletteCommands([...apps, ...fileResults]);
                    }}
                />
                <NotificationCenter isOpen={notifCenterOpen} onClose={() => setNotifCenterOpen(false)} />
                <AppSwitcher />
                {spaceSwitcherOpen && <VirtualDesktopSwitcher onClose={() => setSpaceSwitcherOpen(false)} />}

                {/* Window Layer */}
                {visibleWindows.map(win => {
                    const manifest = SYSTEM_APPS[win.type];
                    
                    if (!manifest) {
                        return null; // Or render a fallback error window
                    }

                    return (
                        <WindowFrame
                            key={win.id}
                            item={win}
                            isActive={activeWindowId === win.id}
                            zIndex={win.zIndex}
                            onFocus={() => actions.focusWindow(win.id)}
                            onClose={() => actions.closeWindow(win.id)}
                            onMinimize={() => actions.minimizeWindow(win.id)}
                            onMaximize={() => actions.maximizeWindow(win.id)}
                            onMove={actions.moveWindow}
                            onResize={actions.resizeWindow}
                            onSnap={actions.snapWindow}
                        >
                            <AppContainer 
                                manifest={manifest}
                                data={win.data}
                                osActions={actions}
                                osState={state}
                                onClose={actions.closeWindow}
                                dispatch={actions.dispatch}
                                isMinimized={win.minimized}
                                isActive={activeWindowId === win.id}
                            />
                        </WindowFrame>
                    );
                })}

                <Taskbar 
                    onToggleNotifCenter={() => setNotifCenterOpen(prev => !prev)}
                    onToggleSpaceSwitcher={() => setSpaceSwitcherOpen(prev => !prev)}
                />
            </div>
        );
    }

    return <div className="bg-black text-white p-10">SYSTEM_HALTED</div>;
};

export default Shell;
