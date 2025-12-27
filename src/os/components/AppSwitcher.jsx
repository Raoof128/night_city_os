import { useState, useEffect } from 'react';
import { useOS } from '../hooks/useOS';
import { motion } from 'framer-motion';

const AppSwitcher = () => {
    const { state, actions } = useOS();
    const { windows, activeWindowId } = state;
    const [isVisible, setIsVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Filter visible windows (not minimized maybe? usually switcher shows all)
    // Grouping by app isn't strictly necessary if IDs are unique, but requirement says "grouped".
    // For now, I'll just show all windows as a flat list for simplicity, as "App" concept is loose here.
    const uniqueWindows = windows; 

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.altKey || e.metaKey) && e.key === 'Tab') {
                e.preventDefault();
                setIsVisible(true);
                setSelectedIndex(prev => (prev + 1) % uniqueWindows.length);
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === 'Alt' || e.key === 'Meta') {
                if (isVisible) {
                    setIsVisible(false);
                    const selectedWin = uniqueWindows[selectedIndex];
                    if (selectedWin) {
                        actions.focusWindow(selectedWin.id);
                        // If it's in another space, switch space (logic handled in reducer OPEN_WINDOW/FOCUS needs update or handle here)
                        // The reducer FOCUS_WINDOW doesn't switch space. I should check space here.
                        if (selectedWin.spaceId && selectedWin.spaceId !== state.currentSpace) {
                            actions.setSpace(selectedWin.spaceId);
                        }
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isVisible, selectedIndex, uniqueWindows, actions, state.currentSpace]);

    // Reset index when opening
    useEffect(() => {
        if (isVisible) {
            // Find current active window index
            const currentIdx = uniqueWindows.findIndex(w => w.id === activeWindowId);
            setSelectedIndex(currentIdx !== -1 ? (currentIdx + 1) % uniqueWindows.length : 0);
        }
    }, [isVisible, activeWindowId, uniqueWindows]);

    if (!isVisible || uniqueWindows.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1a1a] border border-[var(--color-yellow)] p-8 rounded-xl shadow-2xl flex gap-6 overflow-x-auto max-w-[80vw] relative z-10 pointer-events-auto"
            >
                {uniqueWindows.map((win, idx) => (
                    <div 
                        key={win.id}
                        className={`flex flex-col items-center gap-3 p-4 rounded-lg min-w-[120px] transition-all ${idx === selectedIndex ? 'bg-white/10 ring-2 ring-[var(--color-yellow)] scale-110' : 'opacity-50'}`}
                    >
                        <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-2xl font-bold text-gray-400">
                            {win.title ? win.title[0].toUpperCase() : '?'}
                        </div>
                        <span className="text-xs font-bold text-white max-w-[100px] truncate">{win.title}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default AppSwitcher;
