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
    Settings
} from 'lucide-react';
import { COLORS } from '../utils/theme';

const StartMenu = ({ isOpen, onOpenApp, onShutdown }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, skewX: 0 }}
                    animate={{ opacity: 1, y: 0, skewX: -5 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute bottom-20 left-6 w-80 z-50 p-1"
                    style={{ backgroundColor: COLORS.YELLOW }}
                >
                    <div className="bg-black/95 backdrop-blur-xl p-1 h-full w-full" style={{ skewX: 5 }}>
                        <div className="bg-black/80 p-6 border border-gray-800 relative overflow-hidden">
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

                            <div className="space-y-2 relative z-10">
                                {[
                                    { id: 'terminal', label: 'TERMINAL', icon: Terminal },
                                    { id: 'tracker', label: 'FINANCE_DASH', icon: Activity },
                                    { id: 'network', label: 'NET_TRACE', icon: Share2 },
                                    { id: 'files', label: 'DATA_SHARDS', icon: HardDrive },
                                    { id: 'textpad', label: 'TEXT_PAD', icon: FileEdit },
                                    { id: 'calc', label: 'CALCULATOR', icon: Grid },
                                    { id: 'music', label: 'MEDIA_AMP', icon: Bell },
                                    { id: 'settings', label: 'SYS_CONFIG', icon: Settings }
                                ].map(app => (
                                    <button key={app.id} onClick={() => onOpenApp(app.id)} className="w-full flex items-center justify-between p-3 rounded group hover:bg-[var(--color-yellow)] transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 flex items-center justify-center bg-white/5 rounded group-hover:bg-black/20 transition-colors">
                                                <app.icon size={14} className="text-[var(--color-blue)] group-hover:text-black" />
                                            </div>
                                            <span className="font-bold text-gray-300 group-hover:text-black tracking-wide text-sm">{app.label}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-[var(--color-red)] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-bold" />
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-800 relative z-10">
                                <button onClick={onShutdown} className="w-full flex items-center gap-3 p-3 text-[var(--color-red)] hover:bg-[var(--color-red)]/10 hover:text-red-400 rounded transition-colors group">
                                    <Power size={18} className="group-hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]" /><span className="font-bold">JACK_OUT</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StartMenu;
