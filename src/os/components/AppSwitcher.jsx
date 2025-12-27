import { useState, useEffect } from 'react';
import { useOS } from '../hooks/useOS';
import { motion } from 'framer-motion';
import { FocusTrap } from '../../components/FocusTrap';

const AppSwitcher = () => {
    const { state, actions } = useOS();
    const { windows, activeWindowId } = state;
    const [isVisible, setIsVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const uniqueWindows = windows; 

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (state.locked) return;
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
    }, [isVisible, selectedIndex, uniqueWindows, actions, state.currentSpace, state.locked]);

    // Internal navigation while visible
    useEffect(() => {
        if (!isVisible) return;
        const handleKeys = (e) => {
            if (e.key === 'ArrowRight') setSelectedIndex(p => (p + 1) % uniqueWindows.length);
            if (e.key === 'ArrowLeft') setSelectedIndex(p => (p - 1 + uniqueWindows.length) % uniqueWindows.length);
            if (e.key === 'Home') setSelectedIndex(0);
            if (e.key === 'End') setSelectedIndex(uniqueWindows.length - 1);
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [isVisible, uniqueWindows.length]);

    useEffect(() => {
        if (isVisible) {
            const currentIdx = uniqueWindows.findIndex(w => w.id === activeWindowId);
            setSelectedIndex(currentIdx !== -1 ? (currentIdx + 1) % uniqueWindows.length : 0);
        }
    }, [isVisible, activeWindowId, uniqueWindows]);

    if (!isVisible || uniqueWindows.length === 0) return null;

    return (
        <div 
            className="fixed inset-0 z-[10001] flex items-center justify-center pointer-events-none"
            role="listbox"
            aria-label="Application Switcher"
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <FocusTrap isActive={true}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#1a1a1a] border border-[var(--color-yellow)] p-8 rounded-xl shadow-2xl flex gap-6 overflow-x-auto max-w-[80vw] relative z-10 pointer-events-auto"
                >
                    {uniqueWindows.map((win, idx) => (
                        <div 
                            key={win.id}
                            role="option"
                            aria-selected={idx === selectedIndex}
                            className={`flex flex-col items-center gap-3 p-4 rounded-lg min-w-[120px] transition-all ${idx === selectedIndex ? 'bg-white/10 ring-2 ring-[var(--color-yellow)] scale-110' : 'opacity-50'}`}
                        >
                            <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-2xl font-bold text-gray-400">
                                {win.title ? win.title[0].toUpperCase() : '?'}
                            </div>
                            <span className="text-xs font-bold text-white max-w-[100px] truncate">{win.title}</span>
                        </div>
                    ))}
                </motion.div>
            </FocusTrap>
        </div>
    );
};

export default AppSwitcher;
