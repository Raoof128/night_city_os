import { motion } from 'framer-motion';
import { Users, TrendingUp, Award, Crown } from 'lucide-react';

const StreetCred = () => {
    return (
        <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4 h-full relative overflow-hidden">
             <div className="flex items-center gap-2 mb-4 text-[var(--color-yellow)]">
                <Crown size={16} />
                <h3 className="text-sm font-bold tracking-widest">THE_FIXER_NETWORK</h3>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 border-2 border-[var(--color-yellow)] rounded-full flex items-center justify-center bg-[var(--color-yellow)]/10 relative">
                    <Crown size={24} className="text-[var(--color-yellow)]" />
                    <div className="absolute -bottom-2 bg-black px-1 border border-[var(--color-yellow)] text-[8px] font-bold text-[var(--color-yellow)]">
                        GOLD
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-mono">CURRENT RANK</div>
                    <div className="text-xl font-black text-white italic">"STREET_SAMURAI"</div>
                    <div className="text-[10px] text-[var(--color-green)]">TOP 10% OF NETRUNNERS IN SYDNEY</div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-wider border-b border-gray-800 pb-1">Crowdsourced Intel</h4>

                <div className="p-2 bg-white/5 border-l-2 border-[var(--color-blue)]">
                    <div className="flex items-start gap-2">
                        <Users size={12} className="text-[var(--color-blue)] mt-1" />
                        <p className="text-xs text-gray-300">
                            <span className="text-[var(--color-blue)] font-bold">78%</span> of users with your profile reduced 'Dining' spend by 20% after activating the 'Weekday ICE' protocol.
                        </p>
                    </div>
                </div>

                <div className="p-2 bg-white/5 border-l-2 border-[var(--color-red)]">
                     <div className="flex items-start gap-2">
                        <TrendingUp size={12} className="text-[var(--color-red)] mt-1" />
                        <p className="text-xs text-gray-300">
                            Rent in "Combat Zone" is <span className="text-[var(--color-red)] font-bold">15% higher</span> than your current district. Stay put.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreetCred;