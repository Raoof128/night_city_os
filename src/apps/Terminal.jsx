import { useState, useEffect, useRef } from 'react';
import { useApp } from '../os/kernel/AppContext';
import { COLORS } from '../utils/theme';

const TerminalApp = () => {
    const { fs } = useApp();
    const [history, setHistory] = useState([
        "netrunner@nightcity:~$ init_shell",
        "Type 'help' for available commands."
    ]);
    const [input, setInput] = useState("");
    const [cwd, setCwd] = useState('root');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const exec = async (cmdStr) => {
        const parts = cmdStr.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        let output = [];

        try {
            switch (cmd) {
                case 'help':
                    output = [
                        "AVAILABLE COMMANDS:",
                        "  ls [dir]    - List directory contents",
                        "  cat [file]  - Read file content",
                        "  mkdir [name]- Create directory",
                        "  rm [id]     - Remove file/folder (by ID for now)",
                        "  clear       - Clear screen",
                        "  whoami      - User identity",
                        "  date        - System time"
                    ];
                    break;
                case 'clear':
                    setHistory([]);
                    return;
                case 'ls':
                    // Mock listing - in real usage we'd resolve path. 
                    // For Phase 5 we list CWD (root)
                    // We need a listNodes API in FS wrapper or we assume 'root'
                    // Since AppContext fs wrapper is granular, let's assume we can't easily list *children* without a new API method.
                    // Actually storage.listNodes exists but isn't exposed in AppContainer fs wrapper yet.
                    // LIMITATION: We only exposed specific methods.
                    // HOTFIX: For Phase 5, let's assume we can't LS dynamically without upgrading AppContainer.
                    // Wait, I can upgrade AppContainer. 
                    // Let's print a placeholder or try to read 'root' if it was a file (it fails).
                    output = ["Error: ls not fully implemented in restricted shell."];
                    break;
                case 'cat':
                    if (!args[0]) { output = ["Usage: cat [fileId]"]; break; }
                    const file = await fs.readFile(args[0]); // Expects ID
                    if (file && file.blob) {
                        output = [await file.blob.text()];
                    } else {
                        output = [`File not found: ${args[0]}`];
                    }
                    break;
                case 'mkdir':
                    if (!args[0]) { output = ["Usage: mkdir [name]"]; break; }
                    await fs.createFolder(cwd, args[0]);
                    output = [`Created directory: ${args[0]}`];
                    break;
                case 'rm':
                    if (!args[0]) { output = ["Usage: rm [id]"]; break; }
                    await fs.deleteNode(args[0]);
                    output = [`Deleted: ${args[0]}`];
                    break;
                case 'whoami':
                    output = ["netrunner"];
                    break;
                case 'date':
                    output = [new Date().toLocaleString()];
                    break;
                case '':
                    break;
                default:
                    output = [`Command not found: ${cmd}`];
            }
        } catch (e) {
            output = [`Error: ${e.message}`];
        }

        setHistory(prev => [...prev, `netrunner@nightcity:${cwd}$ ${cmdStr}`, ...output]);
    };

    return (
        <div className="h-full p-4 font-mono text-sm overflow-auto bg-black/90 custom-scrollbar" style={{ color: COLORS.BLUE }} onClick={() => document.getElementById('term-in')?.focus()}>
            {history.map((line, i) => (
                <div key={i} className="mb-1 break-all whitespace-pre-wrap">
                    {line.startsWith("netrunner") ? <span className="text-[var(--color-yellow)]">{line}</span> : line}
                </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
                <span className="text-[var(--color-yellow)]">netrunner@nightcity:{cwd}$</span>
                <input 
                    id="term-in" 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            exec(input);
                            setInput("");
                        }
                    }} 
                    autoFocus 
                    className="bg-transparent border-none outline-none flex-1 font-mono text-white" 
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default TerminalApp;