import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, Activity, RotateCcw } from 'lucide-react';
import { FocusTrap } from './FocusTrap';

const ContextMenu = ({ x, y, onClose, onReset, onToggleStealth, stealthMode, onScan }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const options = useMemo(() => [
        { id: 'stealth', label: stealthMode ? "DISABLE_STEALTH" : "ENABLE_STEALTH", icon: Eye, action: onToggleStealth },
        { id: 'scan', label: "RUN_DIAGNOSTIC", icon: Activity, action: onScan },
        { id: 'reset', label: "RESET_GRID_LAYOUT", icon: RotateCcw, action: onReset, color: 'var(--color-red)' }
    ], [stealthMode, onToggleStealth, onScan, onReset]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % options.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + options.length) % options.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                options[selectedIndex].action();
                onClose();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, options, onClose]);

    return (
        <FocusTrap isActive={true} onDeactivate={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute z-[1200] w-64 bg-black/95 backdrop-blur-sm border border-[var(--color-yellow)] shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                style={{ left: x, top: y }}
                role="menu"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-[var(--color-yellow)] px-2 py-1 text-black font-black text-xs tracking-widest flex justify-between items-center">
                    <span>SYSTEM_OPS</span>
                    <div className="flex gap-1 text-[8px] opacity-50">
                        <span>CTRL_V.5</span>
                    </div>
                </div>
                <div className="p-1">
                    {options.map((opt, i) => (
                        <button
                            key={opt.id}
                            role="menuitem"
                            onClick={() => { opt.action(); onClose(); }}
                            onMouseEnter={() => setSelectedIndex(i)}
                            className={`w-full flex items-center gap-3 px-3 py-2 transition-colors text-xs font-bold font-mono text-left group ${i === selectedIndex ? 'bg-[var(--color-yellow)] text-black' : 'text-[var(--color-blue)] hover:bg-white/5'}`}
                        >
                            <opt.icon size={14} className={i === selectedIndex ? 'text-black' : (opt.color ? 'text-red-500' : 'group-hover:text-[var(--color-yellow)]')} />
                            <span className={opt.color && i !== selectedIndex ? 'text-red-500' : ''}>{opt.label}</span>
                        </button>
                    ))}
                </div>
            </motion.div>
        </FocusTrap>
    );
};

export default ContextMenu;
