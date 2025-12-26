import { useEffect, useMemo, useState } from 'react';
import { Play, TerminalSquare } from 'lucide-react';
import { usePersistentState } from '../hooks/usePersistentState';
import { highlightCode } from '../utils/codeHighlighter';
import { useSound } from '../hooks/useSound';

const defaultSnippet = `// Welcome to ICEBREAKER
const hack = () => {
  const payload = "wake up samurai";
  return payload.toUpperCase();
}

hack();`;

export default function IcebreakerApp() {
    const [code, setCode] = usePersistentState('os_icebreaker_code', defaultSnippet);
    const [consoleLines, setConsoleLines] = useState([]);
    const { play } = useSound(0.35, false);

    useEffect(() => {
        play('hover');
    }, [play]);

    const highlighted = useMemo(() => ({ __html: highlightCode(code) }), [code]);
    const lineCount = useMemo(() => code.split('\n').length, [code]);

    const runCode = () => {
        play('hum');
        try {
            const fn = new Function(code);
            const result = fn();
            setConsoleLines(prev => [...prev, { id: Date.now(), level: 'log', message: String(result) }]);
        } catch (error) {
            setConsoleLines(prev => [...prev, { id: Date.now(), level: 'error', message: error.message }]);
            play('error');
        }
    };

    return (
        <div className="h-full flex flex-col bg-black/70 text-white">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-blue)]">
                <div className="flex items-center gap-2 text-[var(--color-blue)]">
                    <TerminalSquare size={16} /> <span className="text-xs tracking-[0.2em]">ICEBREAKER_EDITOR</span>
                </div>
                <button onClick={runCode} className="px-3 py-1 bg-[var(--color-yellow)] text-black text-xs font-bold rounded hover:bg-white flex items-center gap-1">
                    <Play size={14} /> RUN
                </button>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-12 bg-black/80 border-r border-gray-800 text-[10px] text-gray-500 text-right pr-2 pt-3 font-mono select-none">
                    {Array.from({ length: lineCount }, (_, idx) => (
                        <div key={idx}>{idx + 1}</div>
                    ))}
                </div>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 bg-black/70 text-sm p-3 text-white font-mono focus:outline-none resize-none custom-scrollbar"
                    spellCheck={false}
                />
            </div>
            <div className="h-32 bg-black/80 border-t border-gray-800 overflow-auto custom-scrollbar p-2 text-xs font-mono">
                <div className="mb-1 text-[var(--color-yellow)]">SYNTAX</div>
                <pre className="text-[11px] leading-5" dangerouslySetInnerHTML={highlighted} />
            </div>
            <div className="h-32 bg-black/90 border-t border-[var(--color-red)] overflow-auto custom-scrollbar p-2 text-xs font-mono">
                <div className="mb-1 text-[var(--color-red)]">CONSOLE</div>
                {consoleLines.length === 0 && <div className="text-gray-600">Awaiting execution...</div>}
                {consoleLines.map(line => (
                    <div key={line.id} className={line.level === 'error' ? 'text-[var(--color-red)]' : 'text-[var(--color-blue)]'}>
                        {line.level === 'error' ? 'ERR> ' : 'OUT> '}{line.message}
                    </div>
                ))}
            </div>
        </div>
    );
}
