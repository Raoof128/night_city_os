import { useOS } from '../hooks/useOS';
import { motion } from 'framer-motion';
import { Wifi, Volume2, Moon, Sun, Shield, Battery, Activity, Monitor } from 'lucide-react';

const QuickToggle = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${active ? 'bg-[var(--color-blue)] text-black' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
    >
        <Icon size={20} />
        <span className="text-[10px] font-bold mt-1 uppercase">{label}</span>
    </button>
);

const QuickSettings = ({ onClose }) => {
    const { state, actions } = useOS();
    const { theme, quickSettings } = state;

    return (
        <>
            <div className="fixed inset-0 z-[9998]" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-16 right-2 w-80 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl z-[9999]"
            >
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <QuickToggle 
                        icon={Wifi} 
                        label="WiFi" 
                        active={quickSettings.wifi} 
                        onClick={() => actions.setQuickSetting('wifi', !quickSettings.wifi)} 
                    />
                    <QuickToggle 
                        icon={theme.mode === 'dark' ? Moon : Sun} 
                        label="Theme" 
                        active={theme.mode === 'dark'} 
                        onClick={() => actions.dispatch({ type: 'SET_THEME', payload: { mode: theme.mode === 'dark' ? 'light' : 'dark' } })} 
                    />
                    <QuickToggle 
                        icon={Shield} 
                        label="DND" 
                        active={quickSettings.dnd} 
                        onClick={() => actions.setQuickSetting('dnd', !quickSettings.dnd)} 
                    />
                    <QuickToggle 
                        icon={Activity} 
                        label="Perf" 
                        active={quickSettings.performanceMode} 
                        onClick={() => actions.setQuickSetting('performanceMode', !quickSettings.performanceMode)} 
                    />
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-400">
                            <span className="flex items-center gap-2"><Volume2 size={12} /> VOLUME</span>
                            <span>{Math.round(theme.volume * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={theme.volume}
                            onChange={(e) => actions.dispatch({ type: 'SET_THEME', payload: { ...theme, volume: parseFloat(e.target.value) } })}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--color-blue)] [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-400">
                            <span className="flex items-center gap-2"><Monitor size={12} /> BRIGHTNESS</span>
                            <span>85%</span>
                        </div>
                        <input 
                            type="range" 
                            disabled
                            value="0.85"
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none opacity-50 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <Battery size={14} className="text-green-500" />
                        <span>74% EST. 4H</span>
                    </div>
                    <button onClick={onClose} className="hover:text-white transition-colors">CLOSE</button>
                </div>
            </motion.div>
        </>
    );
};

export default QuickSettings;
