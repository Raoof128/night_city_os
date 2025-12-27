
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Command } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose, commands, onSearch }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    // If onSearch provided, commands are managed externally
    const filteredCommands = commands;

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
            if (onSearch) onSearch(''); // Init list
        }
    }, [isOpen, onSearch]);

    useEffect(() => {
        if (isOpen && onSearch) {
            onSearch(query);
            setSelectedIndex(0);
        }
    }, [query, isOpen, onSearch]);

    // Keyboard nav
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredCommands, selectedIndex, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-black border border-[var(--color-yellow)] shadow-[0_0_50px_rgba(255,224,0,0.2)]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 p-4 border-b border-gray-800">
                    <Command className="text-[var(--color-yellow)]" />
                    <input
                        ref={inputRef}
                        className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-white placeholder:text-gray-700 uppercase"
                        placeholder="BREACH_PROTOCOL_V.5.0..."
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                    />
                    <div className="text-[10px] bg-gray-900 border border-gray-700 px-2 py-1 text-gray-400">ESC TO CANCEL</div>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {filteredCommands.map((cmd, i) => (
                        <button
                            key={i}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between group transition-colors ${i === selectedIndex ? 'bg-[var(--color-yellow)] text-black' : 'text-gray-400 hover:bg-white/5'}`}
                            onClick={() => { cmd.action(); onClose(); }}
                            onMouseEnter={() => setSelectedIndex(i)}
                        >
                            <div className="flex items-center gap-3">
                                {cmd.icon && <cmd.icon size={16} className={i === selectedIndex ? 'text-black' : 'text-[var(--color-blue)]'} />}
                                <span className="font-bold uppercase tracking-wider text-sm">{cmd.name}</span>
                            </div>
                            {cmd.shortcut && (
                                <span className={`text-[10px] font-mono ${i === selectedIndex ? 'text-black/70' : 'text-gray-600'}`}>{cmd.shortcut}</span>
                            )}
                        </button>
                    ))}
                    {filteredCommands.length === 0 && (
                        <div className="p-8 text-center text-gray-600 font-mono text-sm">NO_DAEMONS_FOUND</div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default CommandPalette;
