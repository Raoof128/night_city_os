import { motion } from 'framer-motion';
import { BrainCircuit, Activity, ShieldCheck, HeartPulse } from 'lucide-react';
import SpendingHeatmap from './SpendingHeatmap';
import ImpulseIce from './ImpulseIce';
import HoloGoals from './HoloGoals';
import LootLog from './LootLog';
import StreetCred from './StreetCred';

const PsychoCybernetics = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full flex flex-col gap-6"
        >
            {/* Header / Diagnostics */}
            <div className="flex items-center justify-between bg-[var(--color-surface)]/30 border border-gray-800 p-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--color-blue)]/10 rounded-full border border-[var(--color-blue)]/30">
                        <BrainCircuit size={24} className="text-[var(--color-blue)]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black tracking-widest text-white">PSYCHO_CYBERNETICS <span className="text-[var(--color-blue)]">v1.0</span></h2>
                        <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
                            <Activity size={10} /> NEURAL_CALIBRATION: <span className="text-[var(--color-green)]">OPTIMAL</span>
                            <span className="text-gray-600">|</span>
                            <HeartPulse size={10} /> CORTISOL: <span className="text-[var(--color-yellow)]">ELEVATED</span>
                        </div>
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                     <div className="text-[10px] text-gray-500 font-mono mb-1">SYSTEM MESSAGE</div>
                     <div className="text-xs text-[var(--color-blue)] font-bold bg-black/50 px-3 py-1 border border-[var(--color-blue)]/30">
                        &ldquo;The City wants you broke. We keep you liquid.&rdquo;
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Column 1: Behavior & Defense */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1 min-h-[200px]">
                        <SpendingHeatmap />
                    </div>
                    <div className="flex-1 min-h-[200px]">
                        <ImpulseIce />
                    </div>
                </div>

                {/* Column 2: Goals & Gratitude */}
                <div className="flex flex-col gap-6">
                    <div className="flex-[2] bg-[var(--color-surface)]/30 border border-gray-800 p-1 flex flex-col">
                        <div className="text-[10px] bg-black text-gray-500 font-bold p-1 border-b border-gray-800 mb-2">VISUAL_CORTEX_PROJECTION</div>
                        <HoloGoals />
                    </div>
                    <div className="flex-1">
                        <LootLog />
                    </div>
                </div>

                {/* Column 3: Social & Benchmarking */}
                <div className="flex flex-col gap-6">
                     <StreetCred />

                     {/* Mini Diagnostics Panel */}
                     <div className="bg-black/40 border border-gray-800 p-4 flex-1">
                        <h3 className="text-xs font-bold text-gray-500 mb-4 flex items-center gap-2">
                            <ShieldCheck size={12} /> SYSTEM_DIAGNOSTICS
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-mono mb-1">
                                    <span className="text-gray-400">IMPULSE_CONTROL</span>
                                    <span className="text-[var(--color-red)]">40% EFFICIENT</span>
                                </div>
                                <div className="h-1 bg-gray-800">
                                    <div className="h-full w-[40%] bg-[var(--color-red)] animate-pulse" />
                                </div>
                                <div className="text-[10px] text-gray-500 mt-1 italic">
                                    &ldquo;Recommend: 5-minute breathing exercise before next purchase.&rdquo;
                                </div>
                            </div>

                             <div>
                                <div className="flex justify-between text-[10px] font-mono mb-1">
                                    <span className="text-gray-400">LONG_TERM_VISION</span>
                                    <span className="text-[var(--color-blue)]">85% EFFICIENT</span>
                                </div>
                                <div className="h-1 bg-gray-800">
                                    <div className="h-full w-[85%] bg-[var(--color-blue)]" />
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PsychoCybernetics;
