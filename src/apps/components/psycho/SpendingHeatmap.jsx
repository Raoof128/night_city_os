import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const SpendingHeatmap = () => {
    // Mock Data: 0 = Low, 1 = Med, 2 = High (Burn Rate)
    const weekData = [
        { day: 'MON', burn: 0, label: 'Recovery' },
        { day: 'TUE', burn: 0, label: 'Work Mode' },
        { day: 'WED', burn: 1, label: 'Hump Day' },
        { day: 'THU', burn: 1, label: 'Pre-Game' },
        { day: 'FRI', burn: 2, label: 'CORPO PAYDAY' },
        { day: 'SAT', burn: 2, label: 'EDGERUNNER WKD' },
        { day: 'SUN', burn: 1, label: 'Comedown' },
    ];

    return (
        <div className="bg-black/40 border border-gray-800 p-4 relative overflow-hidden group h-full flex flex-col">
             <div className="flex items-center gap-2 mb-4 text-[var(--color-yellow)]">
                <Activity size={16} />
                <h3 className="text-sm font-bold tracking-widest">TEMPORAL_BURN_CYCLES</h3>
            </div>

            <div className="flex justify-between items-end flex-1 gap-2 min-h-[100px]">
                {weekData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group/bar h-full">
                        <div className="relative w-full flex-1 flex flex-col justify-end">
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/bar:opacity-100 text-[10px] bg-black border border-gray-700 p-1 whitespace-nowrap z-10 pointer-events-none text-[var(--color-yellow)]">
                                {d.label}
                            </div>
                            <motion.div
                                className={`w-full ${d.burn === 2 ? 'bg-[var(--color-red)] shadow-[0_0_10px_var(--color-red)]' : d.burn === 1 ? 'bg-[var(--color-yellow)]' : 'bg-gray-800'}`}
                                initial={{ height: 0 }}
                                animate={{ height: `${(d.burn + 1) * 33}%` }}
                                transition={{ delay: i * 0.1 }}
                            />
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono rotate-90 sm:rotate-0">{d.day}</div>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-[10px] font-mono text-gray-400 border-t border-gray-800 pt-2">
                PATTERN: <span className="text-[var(--color-red)] animate-pulse">WEEKEND_BINGE</span>.
                <br/>
                ADVICE: INITIATE LOCKDOWN FRIDAY 18:00.
            </div>
        </div>
    );
};

export default SpendingHeatmap;