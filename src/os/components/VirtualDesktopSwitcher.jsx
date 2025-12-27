import { useOS } from '../hooks/useOS';
import { motion } from 'framer-motion';
import { Plus, Monitor, X } from 'lucide-react';

const VirtualDesktopSwitcher = ({ onClose }) => {
    const { state, actions } = useOS();
    const { spaces, currentSpace, windows } = state;

    return (
        <div className="absolute bottom-16 left-0 right-0 z-[9990] flex justify-center pointer-events-none">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-end gap-4 pointer-events-auto shadow-2xl"
            >
                {spaces.map(space => {
                    const isActive = currentSpace === space.id;
                    const spaceWindows = windows.filter(w => w.spaceId === space.id);

                    return (
                        <div key={space.id} className="relative group">
                            {/* Delete Button (hover) */}
                            {spaces.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        actions.removeSpace(space.id);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110"
                                >
                                    <X size={10} />
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    actions.setSpace(space.id);
                                    if (onClose) onClose();
                                }}
                                className={`w-32 h-20 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden ${isActive ? 'border-[var(--color-yellow)] bg-white/10' : 'border-white/10 hover:border-white/30 bg-black/50'}`}
                            >
                                {/* Mini Window Preview (Simulated) */}
                                <div className="absolute inset-0 p-2 opacity-30 flex flex-wrap gap-1 content-start">
                                    {spaceWindows.map(w => (
                                        <div key={w.id} className="w-6 h-4 bg-white/50 rounded-[1px]" />
                                    ))}
                                </div>

                                <Monitor size={20} className={isActive ? 'text-[var(--color-yellow)]' : 'text-gray-500'} />
                                <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                    {space.label}
                                </span>
                            </button>
                        </div>
                    );
                })}

                <button
                    onClick={() => actions.addSpace()}
                    className="w-12 h-20 rounded-lg border-2 border-dashed border-white/10 hover:border-white/30 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                >
                    <Plus size={20} />
                </button>
            </motion.div>
        </div>
    );
};

export default VirtualDesktopSwitcher;
