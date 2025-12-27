import { useState, useEffect } from 'react';
import { useOS } from '../hooks/useOS';
import { Wifi, Search, Layout, Bell, Monitor } from 'lucide-react';
import StartMenu from '../../components/StartMenu';
import QuickSettings from './QuickSettings';

const Taskbar = ({ onToggleNotifCenter, onToggleSpaceSwitcher }) => {
    const { state, actions } = useOS();
    const { windows, activeWindowId, currentSpace, spaces, notifications } = state;
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Windows in current space for taskbar
    const currentSpaceWindows = windows.filter(w => w.spaceId === currentSpace);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <>
            <StartMenu
                isOpen={startMenuOpen}
                onClose={() => setStartMenuOpen(false)}
                onOpenApp={(id) => actions.openWindow(id, id)}
                onShutdown={actions.shutdown}
            />

            {quickSettingsOpen && <QuickSettings onClose={() => setQuickSettingsOpen(false)} />}

            <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/90 backdrop-blur-md border-t border-gray-800 flex items-center justify-between px-2 z-[9999] select-none">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setStartMenuOpen(!startMenuOpen)}
                        aria-label="Start Menu"
                        className={`h-12 px-6 flex items-center justify-center transition-all font-black text-lg tracking-wider ${startMenuOpen ? 'bg-[var(--color-red)] text-black' : 'bg-[var(--color-yellow)] hover:bg-white hover:text-black text-black'}`}
                        style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }}
                    >
                        START
                    </button>

                    <button 
                        onClick={onToggleSpaceSwitcher}
                        aria-label="Switch Space"
                        className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Switch Desktop"
                    >
                        <Layout size={16} />
                        <span className="text-xs font-bold uppercase hidden md:inline">
                            {spaces.find(s => s.id === currentSpace)?.label || 'SPACE'}
                        </span>
                    </button>

                    <div className="flex items-center gap-2 bg-[var(--color-surface)]/50 border border-white/5 rounded-full px-4 py-1.5 focus-within:border-[var(--color-blue)] transition-colors">
                        <Search size={14} className="text-[var(--color-blue)]" />
                        <input
                            type="text"
                            aria-label="Search"
                            placeholder="SEARCH_NET..."
                            className="bg-transparent border-none outline-none text-xs w-24 md:w-48 text-[var(--color-yellow)] placeholder:text-gray-700 font-mono uppercase"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto mx-4 no-scrollbar">
                    {currentSpaceWindows.map(win => (
                        <button
                            key={win.id}
                            aria-label={`Switch to ${win.title}`}
                            onClick={() => win.minimized ? actions.minimizeWindow(win.id) : actions.focusWindow(win.id)}
                            className={`h-8 px-4 relative group flex items-center gap-2 border-b-2 transition-all rounded-t-lg shrink-0 ${activeWindowId === win.id && !win.minimized ? 'bg-white/10 border-[var(--color-yellow)]' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                        >
                            <span className={`text-xs font-bold uppercase ${activeWindowId === win.id ? 'text-[var(--color-yellow)]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                {win.title || win.type}
                            </span>
                            {activeWindowId === win.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-yellow)] shadow-[0_0_10px_var(--color-yellow)]" />}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 pr-2 text-xs font-mono font-bold shrink-0">
                    <button 
                        onClick={onToggleNotifCenter}
                        aria-label="Notifications"
                        className="p-2 hover:bg-white/10 rounded-full relative text-gray-400 hover:text-white transition-colors"
                    >
                        <Bell size={16} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-red)] rounded-full animate-pulse" />
                        )}
                    </button>

                    <button 
                        onClick={() => setQuickSettingsOpen(!quickSettingsOpen)}
                        aria-label="Quick Settings"
                        className={`flex items-center gap-3 px-3 py-1.5 rounded transition-colors ${quickSettingsOpen ? 'bg-white/20' : 'hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-2 text-[var(--color-red)]">
                            <Wifi size={14} />
                        </div>
                        <div className="flex items-center gap-2 text-[var(--color-blue)]">
                            <Monitor size={14} />
                        </div>
                        <div className="text-right">
                            <div className="leading-none">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            <div className="text-[9px] text-gray-500 leading-none mt-0.5">{currentTime.toLocaleDateString()}</div>
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Taskbar;
