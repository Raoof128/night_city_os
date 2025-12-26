import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, Trash2, Sparkles } from 'lucide-react';

const LootLog = () => {
    const [logs, setLogs] = useState([
        { id: 1, item: 'Kiroshi Optics Mk.1', rating: 5, date: '2023-10-24' }
    ]);
    const [newItem, setNewItem] = useState('');

    const addLog = () => {
        if (!newItem.trim()) return;
        setLogs(prev => [{ id: Date.now(), item: newItem, rating: 5, date: new Date().toISOString().split('T')[0] }, ...prev]);
        setNewItem('');
    };

    return (
        <div className="bg-black/40 border border-gray-800 p-4 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-[var(--color-blue)]">
                <Sparkles size={16} />
                <h3 className="text-sm font-bold tracking-widest">DOPAMINE_LOG</h3>
            </div>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Identify high-ROI acquisition..."
                    className="flex-1 bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)]"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addLog()}
                />
                <button
                    onClick={addLog}
                    className="bg-[var(--color-blue)]/20 text-[var(--color-blue)] border border-[var(--color-blue)] px-3 text-xs font-bold hover:bg-[var(--color-blue)] hover:text-black transition-colors"
                >
                    LOG
                </button>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar space-y-2">
                <AnimatePresence>
                    {logs.map(log => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="p-2 border border-gray-800 bg-white/5 flex justify-between items-center group"
                        >
                            <div>
                                <div className="text-xs text-gray-200 font-bold">{log.item}</div>
                                <div className="text-[10px] text-gray-500 font-mono">{log.date}</div>
                            </div>
                            <div className="flex gap-1 text-[var(--color-yellow)]">
                                {[...Array(log.rating)].map((_, i) => <ThumbsUp key={i} size={10} />)}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {logs.length === 0 && (
                    <div className="text-center text-gray-600 text-xs py-4">NO_DATA. ACQUIRE GOODS.</div>
                )}
            </div>
        </div>
    );
};

export default LootLog;