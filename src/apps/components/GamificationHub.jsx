import { motion } from 'framer-motion';
import { Trophy, Target, Shield, Star, Lock } from 'lucide-react';
import { getLevelInfo, BADGES } from '../../utils/gamificationEngine';

const GamificationHub = ({ gamification, onUpdateGamification }) => {
    const { xp, badges, quests } = gamification;
    const levelInfo = getLevelInfo(xp);

    const handleClaimQuest = (questId) => {
         // Logic to complete quest.
         const quest = quests.find(q => q.id === questId);
         if (quest && !quest.completed) {
             const newQuests = quests.map(q => q.id === questId ? { ...q, completed: true } : q);
             onUpdateGamification({
                 quests: newQuests,
                 xp: xp + quest.xp
             });
         }
    };

    return (
        <div className="space-y-6 text-white font-mono">
           {/* Level Progress */}
           <div className="border border-[var(--color-blue)] p-4 bg-[var(--color-blue)]/5 relative overflow-hidden">
               <div className="flex justify-between items-end mb-2 relative z-10">
                   <div>
                       <div className="text-xs text-[var(--color-blue)] font-bold mb-1">CURRENT_RANK</div>
                       <div className="text-2xl font-black tracking-widest text-white">{levelInfo.title}</div>
                   </div>
                   <div className="text-right">
                       <div className="text-xs text-gray-400">XP: {levelInfo.currentXp} / {levelInfo.nextLevelXp || 'MAX'}</div>
                       <div className="text-xl font-bold text-[var(--color-yellow)]">LVL {levelInfo.level}</div>
                   </div>
               </div>

               {/* Bar */}
               <div className="h-2 bg-gray-800 w-full relative z-10">
                   <motion.div
                       className="h-full bg-[var(--color-yellow)] box-shadow-[0_0_10px_var(--color-yellow)]"
                       initial={{ width: 0 }}
                       animate={{ width: `${levelInfo.progress}%` }}
                       transition={{ duration: 1 }}
                   />
               </div>

               {/* Decor */}
               <Trophy className="absolute -right-4 -bottom-4 text-[var(--color-blue)] opacity-10" size={120} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Quests */}
               <div className="space-y-4">
                   <h3 className="text-[var(--color-yellow)] font-bold text-sm tracking-widest border-b border-gray-800 pb-2 flex items-center gap-2">
                       <Target size={16} /> DAILY_CONTRACTS
                   </h3>
                   <div className="space-y-2">
                       {quests.map(q => (
                           <div key={q.id} className={`p-3 border transition-all flex justify-between items-center ${q.completed ? 'border-gray-800 opacity-50' : 'border-gray-700 bg-black/40 hover:border-[var(--color-yellow)]'}`}>
                               <div>
                                   <div className={`text-sm font-bold ${q.completed ? 'text-gray-500 line-through' : 'text-white'}`}>{q.text}</div>
                                   <div className="text-[10px] text-[var(--color-yellow)]">REWARD: {q.xp} XP</div>
                               </div>
                               <button
                                   onClick={() => handleClaimQuest(q.id)}
                                   disabled={q.completed}
                                   className={`px-3 py-1 text-xs font-bold border ${q.completed ? 'border-transparent text-gray-500' : 'border-[var(--color-blue)] text-[var(--color-blue)] hover:bg-[var(--color-blue)] hover:text-black'}`}
                               >
                                   {q.completed ? 'CLAIMED' : 'CLAIM'}
                               </button>
                           </div>
                       ))}
                   </div>
               </div>

               {/* Badges */}
               <div className="space-y-4">
                   <h3 className="text-[var(--color-yellow)] font-bold text-sm tracking-widest border-b border-gray-800 pb-2 flex items-center gap-2">
                       <Shield size={16} /> ACHIEVEMENTS
                   </h3>
                   <div className="grid grid-cols-3 gap-2">
                       {BADGES.map(badge => {
                           const isUnlocked = badges.includes(badge.id);
                           return (
                               <div key={badge.id} className={`aspect-square flex flex-col items-center justify-center p-2 border ${isUnlocked ? 'border-[var(--color-yellow)] bg-[var(--color-yellow)]/10' : 'border-gray-800 bg-black/40 grayscale opacity-60'} group relative`}>
                                   {isUnlocked ? <Star className="text-[var(--color-yellow)] mb-2" size={24} /> : <Lock className="text-gray-600 mb-2" size={24} />}
                                   <div className="text-[9px] text-center font-bold truncate w-full">{badge.title}</div>

                                   {/* Tooltip */}
                                   <div className="absolute inset-0 bg-black/95 flex items-center justify-center text-center p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                       <span className="text-[10px] text-gray-300">{badge.desc}</span>
                                   </div>
                               </div>
                           );
                       })}
                   </div>
               </div>
           </div>
        </div>
    );
};

export default GamificationHub;
