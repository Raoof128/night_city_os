import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HardDrive,
    Activity,
    Grid,
    Terminal,
    Power,
    ChevronRight,
    Share2,
    FileEdit,
    Bell,
    Settings,
    Lock
} from 'lucide-react';
import { COLORS } from '../utils/theme';
import { FocusTrap } from './FocusTrap';

const StartMenu = ({ isOpen, onOpenApp, onShutdown, onClose }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const menuItems = [
        { id: 'terminal', label: 'TERMINAL', icon: Terminal },
        { id: 'tracker', label: 'FINANCE_DASH', icon: Activity },
        { id: 'network', label: 'NET_TRACE', icon: Share2 },
        { id: 'files', label: 'DATA_SHARDS', icon: HardDrive },
        { id: 'textpad', label: 'TEXT_PAD', icon: FileEdit },
        { id: 'icebreaker', label: 'ICEBREAKER', icon: Grid },
        { id: 'construct', label: 'CONSTRUCT', icon: Power },
        { id: 'sysmon', label: 'SYS_MON', icon: Activity },
        { id: 'vault', label: 'VAULT', icon: Lock },
        { id: 'calc', label: 'CALCULATOR', icon: Grid },
        { id: 'music', label: 'MEDIA_AMP', icon: Bell },
        { id: 'settings', label: 'SYS_CONFIG', icon: Settings },
        { id: 'shutdown', label: 'JACK_OUT', icon: Power, color: 'var(--color-red)', action: onShutdown }
    ];

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % menuItems.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + menuItems.length) % menuItems.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const item = menuItems[selectedIndex];
                if (item.id === 'shutdown') {
                    onShutdown();
                } else {
                    onOpenApp(item.id);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, onOpenApp, onShutdown]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, skewX: 0 }}
                    animate={{ opacity: 1, y: 0, skewX: -5 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute bottom-20 left-6 w-80 z-50 p-1 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                    style={{ backgroundColor: COLORS.YELLOW }}
                >
                    <FocusTrap isActive={isOpen} onDeactivate={onClose}>
                        <div className="bg-black/95 backdrop-blur-xl p-1 h-full w-full" style={{ skewX: 5 }}>
                            <div className="bg-black/80 p-6 border border-gray-800 relative overflow-hidden" role="menu">
                                {/* Decorative background */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-blue)] opacity-5 rounded-full blur-3xl -translate-y-10 translate-x-10" />

                                <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-4 relative z-10">
                                    <div className="w-14 h-14 bg-[var(--color-red)] flex items-center justify-center clip-hex-sm shadow-[0_0_15px_var(--color-red)]">
                                        <span className="font-black text-black text-2xl">R</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-xl tracking-tighter" style={{ color: COLORS.YELLOW }}>RAOUF</div>
                                        <div className="text-[10px] tracking-[0.2em] font-bold" style={{ color: COLORS.BLUE }}>NETRUNNER // LVL 50</div>
                                    </div>
                                </div>

                                <div className="space-y-1 relative z-10 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                    {menuItems.map((app, i) => (
                                        <button 
                                            key={app.id} 
                                            role="menuitem"
                                            onClick={() => app.action ? app.action() : onOpenApp(app.id)} 
                                            onMouseEnter={() => setSelectedIndex(i)}
                                            className={`w-full flex items-center justify-between p-2.5 rounded group transition-all duration-150 ${i === selectedIndex ? 'bg-[var(--color-yellow)] text-black' : 'hover:bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 flex items-center justify-center rounded ${i === selectedIndex ? 'bg-black/20' : 'bg-white/5'}`}>
                                                    <app.icon size={14} className={app.id === 'shutdown' ? 'text-[var(--color-red)]' : (i === selectedIndex ? 'text-black' : 'text-[var(--color-blue)]')} />
                                                </div>
                                                <span className={`font-bold tracking-wide text-xs ${i === selectedIndex ? 'text-black' : (app.id === 'shutdown' ? 'text-[var(--color-red)]' : 'text-gray-300')}`}>
                                                    {app.label}
                                                </span>
                                            </div>
                                            <ChevronRight size={12} className={`${i === selectedIndex ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} transition-all`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FocusTrap>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StartMenu;
