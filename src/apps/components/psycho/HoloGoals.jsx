import { motion } from 'framer-motion';
import { Target, Zap } from 'lucide-react';

const HoloGoals = () => {
    // Mock Data
    const goals = [
        { id: 1, name: 'ARASAKA_CYBERDECK', target: 15000, current: 4500, icon: Zap },
        { id: 2, name: 'APARTMENT_DOWNPAYMENT', target: 50000, current: 12000, icon: Target },
    ];

    return (
        <div className="space-y-4 h-full overflow-auto custom-scrollbar">
             {goals.map(goal => {
                 const percent = Math.min(100, (goal.current / goal.target) * 100);
                 const isSolid = percent > 80;

                 return (
                    <div key={goal.id} className="bg-black/40 border border-gray-800 p-4 relative group">
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className="flex items-center gap-2">
                                <goal.icon size={16} className={percent > 50 ? 'text-[var(--color-yellow)]' : 'text-gray-600'} />
                                <h3 className="text-xs font-bold text-gray-300">{goal.name}</h3>
                            </div>
                            <div className="text-xs font-mono text-[var(--color-blue)]">{percent.toFixed(0)}%</div>
                        </div>

                        {/* Visual Representation (Abstract 3D-ish bar) */}
                        <div className="h-8 bg-gray-900 border border-gray-700 relative overflow-hidden mb-2">
                            {/* Grid/Wireframe BG */}
                            <div className="absolute inset-0 opacity-20"
                                style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%, transparent 50%, #333 50%, #333 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}
                            />

                            {/* Progress Bar with Glitch Effect */}
                            <motion.div
                                className={`h-full relative ${isSolid ? 'bg-[var(--color-yellow)]' : 'bg-[var(--color-blue)]/50'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <div className="absolute inset-0 bg-white/10 animate-pulse" />
                                {percent < 100 && (
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-pulse shadow-[0_0_10px_white]" />
                                )}
                            </motion.div>
                        </div>

                        <div className="flex justify-between text-[10px] font-mono text-gray-500 relative z-10">
                            <span>{goal.current.toLocaleString()} €$</span>
                            <span>{goal.target.toLocaleString()} €$</span>
                        </div>

                        {/* Glitch Overlay for Low Progress */}
                        {percent < 30 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                                <span className="text-[var(--color-red)] font-black text-2xl opacity-10 tracking-[1em] animate-pulse">LOCKED</span>
                            </div>
                        )}
                    </div>
                 );
             })}
        </div>
    );
};

export default HoloGoals;
