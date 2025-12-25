import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from '../utils/theme';

const TerminalApp = ({ financeData }) => {
    const [history, setHistory] = useState([
        "netrunner@nightcity:~# init_finance_daemon",
        "Listening for encrypted shards...",
        "Gemini_Link: ESTABLISHED",
        "Type 'help' for available daemons."
    ]);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleCommand = (cmd) => {
        const cleanCmd = cmd.trim().toLowerCase();
        let output = [];

        switch (cleanCmd) {
            case 'help':
                output = ["AVAILABLE DAEMONS:", "  balance  - Check current eddies", "  clear    - Flush terminal buffer", "  date     - System timestamp", "  whoami   - User identity", "  hack     - Run breach protocol simulation"];
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'balance':
                output = [`CURRENT_BALANCE: ${financeData.balance.toLocaleString()} €$`];
                break;
            case 'date':
                output = [new Date().toLocaleString()];
                break;
            case 'whoami':
                output = ["USER: RAOUF", "CLASS: NETRUNNER", "CLEARANCE: TOP_SECRET"];
                break;
            case 'hack':
                output = ["Initiating Breach Protocol...", "Bypassing ICE... [SUCCESS]", "Downloading Arasaka Database... [||||||||||] 100%", "DATA_SECURE."];
                break;
            case '':
                break;
            default:
                output = [`Command not found: ${cleanCmd}. Try 'help'.`];
        }
        setHistory(prev => [...prev, `netrunner@nightcity:~# ${cmd}`, ...output]);
    };

    return (
        <div className="h-full p-6 font-mono text-sm overflow-auto bg-black custom-scrollbar" style={{ color: COLORS.BLUE }} onClick={() => document.getElementById('terminal-input')?.focus()}>
            {history.map((line, i) => (
                <div key={i} className="mb-1 break-all">
                    {line.startsWith("netrunner") ? <span className="text-[var(--color-blue)]">{line}</span> : line.includes("[SUCCESS]") ? <span style={{ color: COLORS.YELLOW }}>{line}</span> : line.includes("Command not found") ? <span style={{ color: COLORS.RED }}>{line}</span> : <span style={{ color: COLORS.BLUE }}>{line}</span>}
                </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
                <span className="text-[var(--color-blue)]">netrunner@nightcity:~#</span>
                <input id="terminal-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (handleCommand(input), setInput(""))} autoFocus className="bg-transparent border-none outline-none flex-1 font-mono" style={{ color: COLORS.YELLOW }} />
                <span className="w-2 h-4 bg-[var(--color-yellow)] animate-pulse inline-block align-middle" />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default TerminalApp;
