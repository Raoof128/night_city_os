import { useEffect, useRef, useState } from 'react';
import { Send, Cpu, KeyRound } from 'lucide-react';
import { useSound } from '../hooks/useSound';

const personaReplies = [
    "Listen, choom—I'll keep this tight. $INPUT$ won't save the city, but it'll buy us a window.",
    "Data smells off. Reroute your request and remember: corpos own the night, but we own the alleys.",
    "Spin up some chrome, hack the ICE, and ghost out. That's how we survive.",
    "You want truth? Burn the veneer. Your ask: $INPUT$. My answer: move fast, hit hard."
];

const generateReply = (prompt = '') => {
    const template = personaReplies[Math.floor(Math.random() * personaReplies.length)];
    return template.replace('$INPUT$', prompt || 'that request');
};

export default function ConstructApp() {
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', text: "Silverhand online. What breach do you need, samurai?", complete: true }
    ]);
    const [input, setInput] = useState('');
    const [streamingId, setStreamingId] = useState(null);
    const listRef = useRef(null);
    const { play } = useSound(0.4, false);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    const streamMessage = (id, fullText) => {
        let idx = 0;
        setStreamingId(id);
        const interval = setInterval(() => {
            idx += 1;
            setMessages(prev =>
                prev.map(msg => msg.id === id ? { ...msg, text: fullText.slice(0, idx), complete: idx >= fullText.length } : msg)
            );
            if (idx >= fullText.length) {
                clearInterval(interval);
                setStreamingId(null);
            }
        }, 20);
    };

    const sendMessage = () => {
        if (!input.trim()) return;
        const userMsg = { id: Date.now(), role: 'user', text: input.trim(), complete: true };
        const aiId = Date.now() + 1;
        const aiMsg = { id: aiId, role: 'ai', text: '', complete: false };
        setMessages(prev => [...prev, userMsg, aiMsg]);
        const reply = generateReply(input.trim());
        play('type');
        streamMessage(aiId, reply);
        setInput('');
    };

    return (
        <div className="h-full flex flex-col bg-black/70 text-[var(--color-blue)] font-mono">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-red)]">
                <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-[var(--color-yellow)]" />
                    <span className="tracking-widest text-sm">THE_CONSTRUCT // JOHNNY</span>
                </div>
                <KeyRound size={14} className="text-[var(--color-red)]" />
            </div>
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.map(msg => (
                    <div key={msg.id} className={`p-3 rounded border ${msg.role === 'ai' ? 'border-[var(--color-red)] bg-[var(--color-red)]/5' : 'border-[var(--color-blue)] bg-[var(--color-blue)]/5'} shadow-[0_0_12px_rgba(0,240,255,0.15)]`}>
                        <div className="text-[10px] uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                            <span className="text-[var(--color-yellow)]">{msg.role === 'ai' ? 'SILVERHAND_AI' : 'NETRUNNER'}</span>
                            <span className="text-gray-500">#{msg.id.toString().slice(-4)}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-white" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                            {msg.text || (streamingId === msg.id ? '...' : '')}
                        </p>
                        {!msg.complete && <div className="text-[var(--color-yellow)] text-[10px] mt-1 animate-pulse">streaming...</div>}
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-800 p-3 bg-black/60">
                <div className="flex gap-2 items-center">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="TYPE YOUR QUERY..."
                        className="flex-1 bg-black border border-[var(--color-blue)] rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-yellow)]"
                    />
                    <button
                        onClick={sendMessage}
                        className="px-4 py-2 bg-[var(--color-yellow)] text-black font-bold text-xs tracking-widest rounded hover:bg-white transition-colors flex items-center gap-2"
                    >
                        SEND <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
