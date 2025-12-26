import { motion } from 'framer-motion';
import { Eye, Activity, RotateCcw } from 'lucide-react';

const ContextMenu = ({ x, y, onClose, onReset, onToggleStealth, stealthMode, onScan }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-[1200] w-64 bg-black/90 backdrop-blur-sm border border-[var(--color-yellow)] shadow-[0_0_15px_rgba(255,224,0,0.2)]"
            style={{ left: x, top: y }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-[var(--color-yellow)] px-2 py-1 text-black font-black text-xs tracking-widest flex justify-between items-center">
                <span>SYSTEM_OPS</span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
            </div>
            <div className="p-1 space-y-1">
                <button
                    onClick={() => { onToggleStealth(); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-[var(--color-blue)] hover:bg-white/10 hover:text-white transition-colors text-xs font-bold font-mono text-left group"
                >
                    <Eye size={14} className="group-hover:text-[var(--color-yellow)]" />
                    <span>{stealthMode ? "DISABLE_STEALTH" : "ENABLE_STEALTH"}</span>
                </button>
                <button
                    onClick={() => { onScan(); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-[var(--color-blue)] hover:bg-white/10 hover:text-white transition-colors text-xs font-bold font-mono text-left group"
                >
                    <Activity size={14} className="group-hover:text-[var(--color-yellow)]" />
                    <span>RUN_DIAGNOSTIC</span>
                </button>
                <button onClick={onReset} className="w-full flex items-center gap-3 px-3 py-2 text-[var(--color-red)] hover:bg-white/10 hover:text-red-400 transition-colors text-xs font-bold font-mono text-left group border-t border-gray-800 mt-1 pt-2">
                    <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>RESET_GRID_LAYOUT</span>
                </button>
            </div>
        </motion.div>
    );
};

export default ContextMenu;
