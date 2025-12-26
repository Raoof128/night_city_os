import { useState, useEffect } from 'react';
import { useOS } from '../hooks/useOS';
import { Wifi, Search } from 'lucide-react';
import StartMenu from '../../components/StartMenu';

const Taskbar = () => {
    const { state, actions } = useOS();
    const { windows, activeWindowId } = state;
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <StartMenu
                isOpen={startMenuOpen}
                onClose={() => setStartMenuOpen(false)}
                onOpenApp={(id) => actions.openWindow(id, id)}
                onShutdown={actions.shutdown}
            />

            <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/90 backdrop-blur-md border-t border-gray-800 flex items-center justify-between px-2 z-[9999] select-none">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setStartMenuOpen(!startMenuOpen)}
                        className={`h-12 px-6 flex items-center justify-center transition-all font-black text-lg tracking-wider ${startMenuOpen ? 'bg-[var(--color-red)] text-black' : 'bg-[var(--color-yellow)] hover:bg-white hover:text-black text-black'}`}
                        style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }}
                    >
                        START
                    </button>

                    <div className="flex items-center gap-2 bg-[var(--color-surface)]/50 border border-white/5 rounded-full px-4 py-1.5 focus-within:border-[var(--color-blue)] transition-colors">
                        <Search size={14} className="text-[var(--color-blue)]" />
                        <input
                            type="text"
                            placeholder="SEARCH_NET..."
                            className="bg-transparent border-none outline-none text-xs w-48 text-[var(--color-yellow)] placeholder:text-gray-700 font-mono uppercase"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto">
                    {windows.map(win => (
                        <button
                            key={win.id}
                            onClick={() => win.minimized ? actions.minimizeWindow(win.id) : actions.focusWindow(win.id)}
                            className={`h-8 px-4 relative group flex items-center gap-2 border-b-2 transition-all rounded-t-lg ${activeWindowId === win.id && !win.minimized ? 'bg-white/10 border-[var(--color-yellow)]' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                        >
                            <span className={`text-xs font-bold uppercase ${activeWindowId === win.id ? 'text-[var(--color-yellow)]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                {win.title || win.type}
                            </span>
                            {activeWindowId === win.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-yellow)] shadow-[0_0_10px_var(--color-yellow)]" />}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-6 pr-6 text-xs font-mono font-bold">
                    <button onClick={actions.resetState} className="text-red-900 hover:text-red-500">RESET</button>
                    <div className="flex items-center gap-2 text-[var(--color-red)]"><Wifi size={14} /><span className="hidden md:inline">CONNECTED</span></div>
                    <div className="text-[var(--color-blue)] bg-white/5 px-3 py-1 rounded">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Taskbar;
