import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FocusTrap } from './FocusTrap';

const ContextMenu = ({ x, y, onClose, title = "SYSTEM_OPS", options = [] }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (options.length === 0) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % options.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + options.length) % options.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (options[selectedIndex]) {
                    options[selectedIndex].action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, options, onClose]);

    if (options.length === 0) return null;

    return (
        <FocusTrap isActive={true} onDeactivate={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.1 }}
                className="absolute z-[1200] w-64 bg-black/95 backdrop-blur-md border border-[var(--color-yellow)] shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-hidden"
                style={{ left: x, top: y }}
                role="menu"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-[var(--color-yellow)] px-3 py-1.5 text-black font-black text-[10px] tracking-[0.2em] flex justify-between items-center uppercase">
                    <span>{title}</span>
                    <div className="flex gap-1 opacity-50">
                        <div className="w-1 h-1 bg-black rounded-full" />
                        <div className="w-1 h-1 bg-black rounded-full" />
                    </div>
                </div>
                <div className="p-1">
                    {options.map((opt, i) => (
                        <button
                            key={opt.id || i}
                            role="menuitem"
                            disabled={opt.disabled}
                            onClick={() => { if(!opt.disabled) { opt.action(); onClose(); } }}
                            onMouseEnter={() => setSelectedIndex(i)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all text-xs font-bold font-mono text-left group border border-transparent ${i === selectedIndex ? 'bg-[var(--color-yellow)] text-black border-[var(--color-yellow)] shadow-[0_0_15px_rgba(252,238,10,0.3)]' : 'text-gray-400 hover:bg-white/5'} ${opt.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                            {opt.icon && <opt.icon size={14} className={i === selectedIndex ? 'text-black' : (opt.color ? '' : 'text-[var(--color-blue)]')} style={!opt.color || i === selectedIndex ? {} : { color: opt.color }} />}
                            <span className="flex-1">{opt.label}</span>
                            {opt.shortcut && <span className={`text-[9px] opacity-50 ${i === selectedIndex ? 'text-black' : ''}`}>{opt.shortcut}</span>}
                        </button>
                    ))}
                </div>
            </motion.div>
        </FocusTrap>
    );
};

export default ContextMenu;
