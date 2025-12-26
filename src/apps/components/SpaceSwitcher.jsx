
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Users, Shield } from 'lucide-react';
import { useState } from 'react';
import { createSpace } from '../../utils/spaces';

export default function SpaceSwitcher({ spaces, currentSpace, currentUser, onSwitchSpace, onAddSpace }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showNewSpaceInput, setShowNewSpaceInput] = useState(false);
    const [newSpaceName, setNewSpaceName] = useState('');
    const [newSpaceType, setNewSpaceType] = useState('family');

    const handleCreateSpace = () => {
        if (!newSpaceName) return;
        const space = createSpace(newSpaceName, newSpaceType, currentUser.id);
        onAddSpace(space);
        setNewSpaceName('');
        setShowNewSpaceInput(false);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-[var(--color-surface)]/50 border border-gray-700 px-3 py-1 text-xs font-bold text-white hover:border-[var(--color-yellow)] transition-colors"
            >
                {currentSpace?.type === 'personal' ? <Shield size={12} className="text-[var(--color-blue)]" /> : <Users size={12} className="text-[var(--color-yellow)]" />}
                <span className="uppercase max-w-[100px] truncate">{currentSpace?.name || 'SELECT_SPACE'}</span>
                <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-black border border-gray-700 z-50 shadow-xl"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {spaces.map(space => (
                                <button
                                    key={space.id}
                                    onClick={() => {
                                        onSwitchSpace(space.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-bold hover:bg-white/10 flex items-center justify-between ${currentSpace.id === space.id ? 'text-[var(--color-yellow)]' : 'text-gray-400'}`}
                                >
                                    <span>{space.name}</span>
                                    {space.type === 'personal' && <Shield size={10} />}
                                </button>
                            ))}
                        </div>

                        {!showNewSpaceInput ? (
                            <button
                                onClick={() => setShowNewSpaceInput(true)}
                                className="w-full text-left px-3 py-2 border-t border-gray-800 text-xs text-[var(--color-blue)] hover:bg-[var(--color-blue)]/10 font-bold flex items-center gap-2"
                            >
                                <Plus size={12} /> CREATE_NEW_SPACE
                            </button>
                        ) : (
                            <div className="p-2 border-t border-gray-800">
                                <input
                                    autoFocus
                                    className="w-full bg-black border border-gray-700 text-xs p-1 mb-2 text-white outline-none focus:border-[var(--color-blue)]"
                                    placeholder="SPACE_NAME"
                                    value={newSpaceName}
                                    onChange={e => setNewSpaceName(e.target.value)}
                                />
                                <select
                                    className="w-full bg-black border border-gray-700 text-xs p-1 mb-2 text-white outline-none"
                                    value={newSpaceType}
                                    onChange={e => setNewSpaceType(e.target.value)}
                                >
                                    <option value="family">FAMILY</option>
                                    <option value="roommates">ROOMMATES</option>
                                    <option value="couple">COUPLE</option>
                                </select>
                                <div className="flex gap-1">
                                    <button
                                        onClick={handleCreateSpace}
                                        className="flex-1 bg-[var(--color-blue)] text-black text-[10px] font-bold py-1"
                                    >
                                        CREATE
                                    </button>
                                    <button
                                        onClick={() => setShowNewSpaceInput(false)}
                                        className="flex-1 bg-gray-800 text-white text-[10px] font-bold py-1"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
