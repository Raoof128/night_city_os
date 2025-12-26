
import { motion } from 'framer-motion';
import { X, Divide, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { MOCK_USERS } from '../../utils/spaces';

export default function SplitTransactionModal({ transaction, space, onClose, onSplit }) {
    // Default: Split equally among all members
    const [splitMode, setSplitMode] = useState('equal'); // 'equal', 'custom'
    const [selectedMembers, setSelectedMembers] = useState(
        space.members.map(m => m.userId)
    );
    const [customShares, setCustomShares] = useState({});

    // Comments
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const handleAddComment = () => {
        if (!comment.trim()) return;
        setComments([...comments, { id: Date.now(), text: comment, author: 'Me', time: 'Now' }]);
        setComment('');
    };

    // Calculate shares
    const amount = transaction.amount;

    const calculateShares = () => {
        if (splitMode === 'equal') {
            const count = selectedMembers.length;
            if (count === 0) return {};
            const share = amount / count;
            const shares = {};
            selectedMembers.forEach(id => shares[id] = share);
            return shares;
        } else {
            return customShares;
        }
    };

    const shares = calculateShares();

    const handleToggleMember = (userId) => {
        if (selectedMembers.includes(userId)) {
            setSelectedMembers(prev => prev.filter(id => id !== userId));
        } else {
            setSelectedMembers(prev => [...prev, userId]);
        }
    };

    const handleConfirm = () => {
        // Validation
        const totalShared = Object.values(shares).reduce((a, b) => a + b, 0);
        if (Math.abs(totalShared - amount) > 0.01 && splitMode === 'custom') {
            alert(`Total split (${totalShared}) must match transaction amount (${amount})`);
            return;
        }

        onSplit({
            originalTransactionId: transaction.id || Date.now(),
            splitMode,
            participants: selectedMembers,
            shares
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
             <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-black border border-[var(--color-blue)] w-full max-w-md shadow-[0_0_30px_rgba(0,240,255,0.1)] flex flex-col"
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[var(--color-blue)]/10">
                    <h2 className="text-[var(--color-blue)] text-lg font-black tracking-widest flex items-center gap-2">
                        <Divide size={18} /> SPLIT_TRANSACTION
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <div className="text-sm text-gray-500">TOTAL AMOUNT</div>
                        <div className="text-3xl font-mono font-bold text-white">${amount.toFixed(2)}</div>
                        <div className="text-xs text-[var(--color-yellow)] mt-1">{transaction.desc}</div>
                    </div>

                    {/* Mode Selection */}
                    <div className="flex bg-gray-900 rounded p-1">
                        <button
                            onClick={() => setSplitMode('equal')}
                            className={`flex-1 py-1 text-xs font-bold rounded ${splitMode === 'equal' ? 'bg-[var(--color-blue)] text-black' : 'text-gray-500 hover:text-white'}`}
                        >
                            EQUAL SPLIT
                        </button>
                        <button
                            onClick={() => setSplitMode('custom')}
                            className={`flex-1 py-1 text-xs font-bold rounded ${splitMode === 'custom' ? 'bg-[var(--color-blue)] text-black' : 'text-gray-500 hover:text-white'}`}
                        >
                            CUSTOM
                        </button>
                    </div>

                    {/* Member List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {space.members.map(member => {
                            const user = MOCK_USERS.find(u => u.id === member.userId) || { name: 'Unknown', id: member.userId };
                            const isSelected = selectedMembers.includes(member.userId);

                            return (
                                <div key={member.userId} className={`flex items-center justify-between p-2 border ${isSelected ? 'border-[var(--color-blue)] bg-[var(--color-blue)]/5' : 'border-gray-800 opacity-50'} transition-all`}>
                                    <div
                                        className="flex items-center gap-2 cursor-pointer flex-1"
                                        onClick={() => handleToggleMember(member.userId)}
                                    >
                                        <div className={`w-4 h-4 border ${isSelected ? 'bg-[var(--color-blue)] border-[var(--color-blue)]' : 'border-gray-600'} flex items-center justify-center`}>
                                            {isSelected && <div className="w-2 h-2 bg-black" />}
                                        </div>
                                        <span className="text-sm font-bold text-white">{user.name}</span>
                                    </div>

                                    <div className="font-mono text-white text-sm">
                                        {splitMode === 'equal' ? (
                                            isSelected ? `$${(shares[member.userId] || 0).toFixed(2)}` : '-'
                                        ) : (
                                            <input
                                                type="number"
                                                disabled={!isSelected}
                                                className="bg-black border border-gray-700 w-20 text-right p-1 text-xs outline-none focus:border-[var(--color-blue)]"
                                                value={customShares[member.userId] || ''}
                                                onChange={(e) => setCustomShares({...customShares, [member.userId]: parseFloat(e.target.value) || 0})}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* COMMENTS SECTION */}
                    <div className="border-t border-gray-800 pt-4">
                        <h3 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                            <MessageSquare size={12} /> COMMENTS
                        </h3>
                        <div className="bg-gray-900/50 p-2 max-h-32 overflow-y-auto mb-2 space-y-2">
                            {comments.length === 0 && <div className="text-xs text-gray-600 italic">No comments yet.</div>}
                            {comments.map(c => (
                                <div key={c.id} className="text-xs border-l-2 border-[var(--color-blue)] pl-2">
                                    <span className="font-bold text-[var(--color-blue)]">{c.author}</span> <span className="text-[10px] text-gray-600 ml-1">[{c.time}]</span>
                                    <div className="text-gray-300">{c.text}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add note..."
                                className="flex-1 bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)]"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            <button onClick={handleAddComment} className="bg-gray-800 text-white px-3 text-xs font-bold hover:bg-[var(--color-blue)] hover:text-black transition-colors">SEND</button>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirm}
                        className="w-full py-3 bg-[var(--color-blue)] text-black font-bold text-sm hover:bg-white transition-colors tracking-widest"
                    >
                        CONFIRM_SPLIT
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
