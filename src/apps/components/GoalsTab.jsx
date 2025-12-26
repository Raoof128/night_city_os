
import { motion } from 'framer-motion';
import { Target, TrendingUp, Plus } from 'lucide-react';
import { useState } from 'react';
import { checkPermission, ACTIONS } from '../../utils/spaces';

export default function GoalsTab({ space, currentUser, onUpdateSpace }) {
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: '', target: '', current: 0 });

    const goals = space.data?.goals || [];
    const canEdit = checkPermission(space, currentUser.id, ACTIONS.EDIT_DATA);

    const handleAddGoal = () => {
        if (!newGoal.title || !newGoal.target) return;
        const goal = {
            id: Date.now(),
            title: newGoal.title,
            targetAmount: parseFloat(newGoal.target),
            currentAmount: parseFloat(newGoal.current) || 0,
            contributors: []
        };

        const updatedSpace = {
            ...space,
            data: {
                ...space.data,
                goals: [...goals, goal]
            }
        };
        onUpdateSpace(updatedSpace);
        setNewGoal({ title: '', target: '', current: 0 });
        setShowAddGoal(false);
    };

    const handleContribute = (goalId) => {
        const amount = prompt("Amount to contribute:");
        if (!amount) return;

        const updatedSpace = {
            ...space,
            data: {
                ...space.data,
                goals: goals.map(g => {
                    if (g.id === goalId) {
                        return {
                            ...g,
                            currentAmount: g.currentAmount + parseFloat(amount)
                        };
                    }
                    return g;
                })
            }
        };
        onUpdateSpace(updatedSpace);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h3 className="text-[var(--color-blue)] font-bold tracking-widest flex items-center gap-2">
                    <Target size={18} /> SHARED_GOALS
                </h3>
                {canEdit && !showAddGoal && (
                    <button
                        onClick={() => setShowAddGoal(true)}
                        className="flex items-center gap-2 bg-[var(--color-blue)]/20 text-[var(--color-blue)] px-3 py-1 text-xs font-bold hover:bg-[var(--color-blue)] hover:text-black transition-colors"
                    >
                        <Plus size={12} /> NEW_GOAL
                    </button>
                )}
            </div>

            {showAddGoal && (
                <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4 space-y-4">
                    <h4 className="text-white text-sm font-bold">Define Target</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Goal Title (e.g. New Couch)"
                            className="bg-black border border-gray-700 p-2 text-xs text-white"
                            value={newGoal.title}
                            onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Target Amount"
                            className="bg-black border border-gray-700 p-2 text-xs text-white"
                            value={newGoal.target}
                            onChange={e => setNewGoal({...newGoal, target: e.target.value})}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAddGoal(false)} className="text-gray-500 text-xs font-bold px-3 py-1">CANCEL</button>
                        <button onClick={handleAddGoal} className="bg-[var(--color-blue)] text-black text-xs font-bold px-3 py-1">CREATE</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.length === 0 && !showAddGoal && (
                    <div className="col-span-2 text-center text-gray-500 py-10 font-mono text-xs">
                        NO_ACTIVE_GOALS_FOUND
                    </div>
                )}
                {goals.map(goal => {
                    const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);

                    return (
                        <div key={goal.id} className="bg-black border border-gray-800 p-4 relative overflow-hidden group hover:border-[var(--color-blue)] transition-colors">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <div className="text-white font-bold text-sm">{goal.title}</div>
                                    <div className="text-xs text-gray-500 font-mono">
                                        ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-[var(--color-blue)] font-mono font-bold text-lg">{progress.toFixed(0)}%</div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 bg-gray-900 w-full mb-4 relative z-10 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-[var(--color-blue)]"
                                />
                            </div>

                            <button
                                onClick={() => handleContribute(goal.id)}
                                className="w-full border border-gray-700 text-gray-400 text-xs font-bold py-2 hover:bg-[var(--color-blue)] hover:text-black hover:border-[var(--color-blue)] transition-colors relative z-10 flex items-center justify-center gap-2"
                            >
                                <TrendingUp size={12} /> CONTRIBUTE
                            </button>

                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[var(--color-blue)]/5 to-transparent skew-x-12 z-0" />
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
