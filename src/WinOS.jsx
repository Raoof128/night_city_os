import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HardDrive,
    Activity,
    UploadCloud,
    X,
    Minus,
    Square,
    Wifi,
    Search,
    Grid,
    FileText,
    TrendingUp,
    Wallet,
    CreditCard,
    Terminal,
    Power,
    ChevronRight,
    ShieldAlert,
    ScanLine,
    Share2,
    Lock,
    Clock,
    RotateCcw,
    Eye,
    FileEdit,
    Bell,
    Maximize2,
    Settings
} from 'lucide-react';

// --- CYBERPUNK 2077 OFFICIAL PALETTE ---
const COLORS = {
    yellow: '#FCEE0A',
    blue: '#00F0FF',
    red: '#FF003C',
    void: '#000000',
    surface: '#131313',
    grid: '#2a2a2a',
};

// --- API CONFIG ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; // Runtime injected via .env

// --- UTILS ---
const getPersianDate = () => {
    try {
        return new Intl.DateTimeFormat('fa-IR', {
            calendar: 'persian',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date());
    } catch (e) {
        return new Date().toLocaleDateString();
    }
};

// --- DRAGGABLE WRAPPER ---
const DraggableItem = ({ children, initialX, initialY, className = "", constraintsRef }) => (
    <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        initial={{ x: 0, y: 0 }}
        className={`absolute cursor-move z-20 hover:z-30 ${className}`}
        style={{ left: initialX, top: initialY }}
    >
        {children}
    </motion.div>
);

// --- TOAST NOTIFICATION ---
const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="absolute top-20 right-4 z-[999] bg-black border-l-4 p-4 shadow-lg w-72"
            style={{ borderColor: type === 'error' ? COLORS.red : COLORS.yellow }}
        >
            <div className="flex items-center gap-3">
                {type === 'error' ? <ShieldAlert size={20} color={COLORS.red} /> : <Bell size={20} color={COLORS.yellow} />}
                <div>
                    <div className="text-xs font-black tracking-widest text-gray-500">SYSTEM_ALERT</div>
                    <div className="text-sm font-bold text-white">{message}</div>
                </div>
            </div>
        </motion.div>
    );
};

// --- CONTEXT MENU COMPONENT ---
const ContextMenu = ({ x, y, onClose, onReset, onToggleStealth, stealthMode, onScan }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 w-64 bg-black border border-yellow-400 shadow-[4px_4px_0px_0px_rgba(255,0,60,0.5)]"
            style={{ left: x, top: y }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-yellow-400 px-2 py-1 text-black font-black text-xs tracking-widest flex justify-between items-center">
                <span>SYSTEM_OPS</span>
                <Square size={8} fill="black" />
            </div>
            <div className="p-1 space-y-1">
                <button
                    onClick={() => { onToggleStealth(); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-cyan-400 hover:bg-white/10 hover:text-white transition-colors text-xs font-bold font-mono text-left group"
                >
                    <Eye size={14} className="group-hover:text-yellow-400" />
                    <span>{stealthMode ? "DISABLE_STEALTH" : "ENABLE_STEALTH"}</span>
                </button>
                <button
                    onClick={() => { onScan(); onClose(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-cyan-400 hover:bg-white/10 hover:text-white transition-colors text-xs font-bold font-mono text-left group"
                >
                    <Activity size={14} className="group-hover:text-yellow-400" />
                    <span>RUN_DIAGNOSTIC</span>
                </button>
                <button onClick={onReset} className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-white/10 hover:text-red-400 transition-colors text-xs font-bold font-mono text-left group border-t border-gray-800">
                    <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>RESET_GRID_LAYOUT</span>
                </button>
            </div>
        </motion.div>
    );
};

// --- SYSTEM BOOT SEQUENCE ---
const BootScreen = ({ onComplete }) => {
    const [lines, setLines] = useState([]);

    useEffect(() => {
        const bootText = [
            "BIOS_REL_2077 // ARASAKA_KERNEL_V14",
            "OVERRIDING_SECURITY... [SUCCESS]",
            `INJECTING_COLOR_MATRIX... #FCEE0A`,
            "ESTABLISHING_NEURAL_LINK... DONE",
            "WAKE_UP_SAMURAI...",
            "USER: RAOUF"
        ];

        let delay = 0;
        bootText.forEach((line, i) => {
            delay += Math.random() * 600 + 200;
            setTimeout(() => {
                setLines(prev => [...prev, line]);
                if (i === bootText.length - 1) {
                    setTimeout(onComplete, 1200);
                }
            }, delay);
        });
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black font-mono p-10 z-[100] flex flex-col justify-end selection:bg-red-500 selection:text-black">
            {/* Glitch Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 animate-pulse bg-red-900/20 mix-blend-overlay"></div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.1, repeat: 4, repeatType: "mirror" }}
                >
                    <div
                        className="text-6xl font-black tracking-tighter mb-2 glitch"
                        data-text="NIGHT_CITY_OS"
                        style={{ color: COLORS.yellow, textShadow: `4px 4px 0px ${COLORS.red}` }}
                    >
                        NIGHT_CITY_OS
                    </div>
                </motion.div>
                <div className="h-2 w-64 bg-red-600 mx-auto mt-4 overflow-hidden relative">
                    <motion.div
                        className="h-full bg-yellow-400"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "circIn" }}
                    />
                </div>
            </div>
            <div className="space-y-1 text-sm md:text-base font-bold">
                {lines.map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <span style={{ color: COLORS.red }} className="mr-2">[{new Date().toLocaleTimeString()}]</span>
                        <span style={{ color: COLORS.blue }}>{line}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --- SHUTDOWN SCREEN ---
const ShutdownScreen = ({ onReboot }) => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center font-mono"
    >
        <div className="text-red-500 text-4xl font-black tracking-widest mb-4">SYSTEM HALTED</div>
        <div className="text-gray-500 text-sm mb-8">It is safe to turn off your neural link.</div>
        <button
            onClick={onReboot}
            className="px-6 py-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors font-bold"
        >
            MANUAL_REBOOT
        </button>
    </motion.div>
);

// --- WINDOW COMPONENT ---
const WindowFrame = ({ title, icon: Icon, children, onClose, onMinimize, isActive, onFocus, initialPos, isMinimized, zIndex, constraintsRef }) => {
    const [isMaximized, setIsMaximized] = useState(false);

    if (isMinimized) return null;

    return (
        <motion.div
            drag={!isMaximized}
            dragConstraints={constraintsRef}
            dragMomentum={false}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                width: isMaximized ? '100%' : '800px',
                height: isMaximized ? 'calc(100% - 48px)' : '500px',
                top: isMaximized ? 0 : (initialPos?.y || '100px'),
                left: isMaximized ? 0 : (initialPos?.x || 'calc(50% - 400px)'),
                position: 'absolute'
            }}
            exit={{ scale: 0.95, opacity: 0, duration: 0.1 }}
            onMouseDown={onFocus}
            className={`flex flex-col transition-all duration-200`}
            style={{
                zIndex: zIndex,
                backgroundColor: COLORS.surface,
                border: `1px solid ${isActive ? COLORS.yellow : '#333'}`,
                boxShadow: isActive ? `8px 8px 0px 0px ${COLORS.void}, 9px 9px 0px 0px ${COLORS.yellow}` : 'none',
            }}
        >
            <div className="h-12 flex items-center justify-between px-4 select-none cursor-move active:cursor-grabbing relative overflow-hidden"
                style={{ backgroundColor: isActive ? COLORS.yellow : '#333' }}
                onDoubleClick={() => setIsMaximized(!isMaximized)}>
                <div className="absolute top-0 right-0 w-32 h-full bg-black opacity-10 skew-x-[-45deg] translate-x-10"></div>
                <div className="flex items-center gap-2 z-10">
                    <Icon size={18} className={isActive ? "text-black" : "text-gray-500"} />
                    <span className={`text-sm font-black tracking-widest uppercase ${isActive ? "text-black" : "text-gray-500"}`}>{title}</span>
                </div>
                <div className="flex items-center gap-3 z-10">
                    <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="p-1 hover:bg-black/20 transition-colors"><Minus size={16} className={isActive ? "text-black" : "text-gray-500"} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }} className="p-1 hover:bg-black/20 transition-colors"><Maximize2 size={16} className={isActive ? "text-black" : "text-gray-500"} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:bg-red-600 hover:text-white transition-colors"><X size={16} className={isActive ? "text-black hover:text-white" : "text-gray-500"} /></button>
                </div>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar p-0 relative bg-black/95">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `linear-gradient(${COLORS.blue} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.blue} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                <div className="relative z-10 h-full">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

// --- APP: TEXT EDITOR ---
const TextPadApp = () => {
    const [text, setText] = useState("// NOTES_BUFFER_V1\n// ENCRYPTED: YES\n\n- Buy more RAM for the cyberdeck.\n- Meeting with Fixer at 10 PM.\n");

    return (
        <div className="h-full flex flex-col bg-black">
            <div className="bg-gray-900 px-2 py-1 text-xs text-gray-500 font-mono flex gap-2">
                <span>UTF-8</span>
                <span>RO-RW</span>
                <span className="text-green-500">SAVED</span>
            </div>
            <textarea
                className="flex-1 bg-transparent text-cyan-400 font-mono p-4 outline-none resize-none selection:bg-yellow-400 selection:text-black"
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck="false"
            />
        </div>
    );
};

// --- APP: NETWORK MAP ---
const NetworkMapApp = () => {
    const nodes = [
        { id: 1, x: 20, y: 20, label: "MAIN_FRAME" },
        { id: 2, x: 50, y: 30, label: "PROXY_01" },
        { id: 3, x: 80, y: 20, label: "ARASAKA_DB" },
        { id: 4, x: 35, y: 60, label: "ICE_WALL" },
        { id: 5, x: 70, y: 70, label: "GHOST_SERVER" },
    ];

    const connections = [
        { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 1, to: 4 }, { from: 4, to: 5 }, { from: 2, to: 5 }
    ];

    return (
        <div className="h-full w-full p-6 relative overflow-hidden bg-black text-cyan-500 font-mono">
            <div className="absolute top-4 left-4 z-10 bg-black/80 border border-cyan-500 p-2 text-xs">
                <div>STATUS: <span className="text-green-500">ACTIVE_TRACE</span></div>
                <div>NODES: 5</div>
                <div>PING: 12ms</div>
            </div>

            <svg className="w-full h-full">
                {connections.map((conn, i) => {
                    const fromNode = nodes.find(n => n.id === conn.from);
                    const toNode = nodes.find(n => n.id === conn.to);
                    return (
                        <g key={i}>
                            <line
                                x1={`${fromNode.x}%`} y1={`${fromNode.y}%`}
                                x2={`${toNode.x}%`} y2={`${toNode.y}%`}
                                stroke={COLORS.blue} strokeWidth="1" opacity="0.4"
                            />
                            <circle r="3" fill={COLORS.yellow}>
                                <animateMotion
                                    dur={`${2 + i}s`}
                                    repeatCount="indefinite"
                                    path={`M ${fromNode.x * 8} ${fromNode.y * 5} L ${toNode.x * 8} ${toNode.y * 5}`}
                                />
                                <animate attributeName="opacity" values="0;1;0" dur={`${2 + i}s`} repeatCount="indefinite" />
                            </circle>
                        </g>
                    )
                })}

                {nodes.map(node => (
                    <g key={node.id}>
                        <circle cx={`${node.x}%`} cy={`${node.y}%`} r="6" fill="black" stroke={COLORS.red} strokeWidth="2" className="cursor-pointer hover:fill-red-900" />
                        <text x={`${node.x}%`} y={`${node.y + 5}%`} textAnchor="middle" fill={COLORS.yellow} fontSize="10" className="font-bold tracking-widest">{node.label}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

// --- APP: TERMINAL ---
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
        <div className="h-full p-6 font-mono text-sm overflow-auto bg-black custom-scrollbar" style={{ color: COLORS.blue }} onClick={() => document.getElementById('terminal-input')?.focus()}>
            {history.map((line, i) => (
                <div key={i} className="mb-1 break-all">
                    {line.startsWith("netrunner") ? <span className="text-green-400">{line}</span> : line.includes("[SUCCESS]") ? <span style={{ color: COLORS.yellow }}>{line}</span> : line.includes("Command not found") ? <span style={{ color: COLORS.red }}>{line}</span> : <span style={{ color: COLORS.blue }}>{line}</span>}
                </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
                <span className="text-green-400">netrunner@nightcity:~#</span>
                <input id="terminal-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (handleCommand(input), setInput(""))} autoFocus className="bg-transparent border-none outline-none flex-1 font-mono" style={{ color: COLORS.yellow }} />
                <span className="w-2 h-4 bg-yellow-400 animate-pulse inline-block align-middle" />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

// --- APP: TRACKER ---
const TrackerAppContent = ({ data }) => (
    <div className="p-6 h-full font-mono relative" style={{ color: COLORS.yellow }}>
        <div className="relative z-10">
            <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                <div>
                    <div className="text-xs mb-1" style={{ color: COLORS.blue }}>CURRENT_BALANCE</div>
                    <div className="text-5xl font-black tracking-tighter text-white">
                        {data.balance.toLocaleString()}<span style={{ color: COLORS.yellow }}>.00</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2 justify-end" style={{ color: COLORS.blue }}>
                        <TrendingUp size={20} />
                        <span className="font-bold">+24.5%</span>
                    </div>
                    <div className="text-xs text-gray-500">LAST_CYCLE</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900/50 border border-gray-800 p-4">
                    <div className="flex items-center gap-2 mb-4" style={{ color: COLORS.red }}>
                        <Wallet size={18} />
                        <span className="font-bold text-sm">CRYPTO_STASH</span>
                    </div>
                    <div className="text-2xl font-bold text-white">4.20 BTC</div>
                    <div className="w-full bg-gray-800 h-1 mt-4">
                        <div className="h-full w-3/4 bg-red-600" />
                    </div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 p-4">
                    <div className="flex items-center gap-2 mb-4" style={{ color: COLORS.blue }}>
                        <CreditCard size={18} />
                        <span className="font-bold text-sm">EDDIES_SPENT</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{data.spent.toLocaleString()} €$</div>
                    <div className="w-full bg-gray-800 h-1 mt-4">
                        <div className="h-full bg-cyan-400" style={{ width: `${Math.min((data.spent / 10000) * 100, 100)}%` }} />
                    </div>
                </div>
            </div>

            <div>
                <div className="text-xs font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.blue }}>
                    <Square size={8} fill={COLORS.blue} /> RECENT_TRANSACTIONS
                </div>
                <div className="space-y-2 h-48 overflow-y-auto custom-scrollbar">
                    {data.recent.map((tx, i) => (
                        <div key={i} className="flex justify-between items-center p-3 border-l-2 border-transparent hover:border-yellow-400 hover:bg-white/5 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="text-xs font-bold text-gray-500">{tx.time}</div>
                                <div className="font-bold text-white uppercase">{tx.desc}</div>
                            </div>
                            <div className="font-mono" style={{ color: COLORS.yellow }}>-{tx.amount} €$</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// --- WIDGET: CALENDAR ---
const DesktopCalendarWidget = ({ constraintsRef }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const gregDate = time.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const gregTime = time.toLocaleTimeString('en-US', { hour12: false });
    const persianDate = getPersianDate();

    return (
        <DraggableItem initialX="auto" initialY="240px" className="right-10 w-64" constraintsRef={constraintsRef}>
            <div className="bg-black/80 border border-red-900 p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-400" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-400" />

                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-red-500 tracking-widest">SYNC_CHRONO</span>
                    <span className="text-xs text-gray-500 animate-pulse">● LIVE</span>
                </div>

                <div className="flex items-end gap-2 mb-2">
                    <Clock size={24} className="text-black mb-1 bg-yellow-400 rounded-full p-0.5" />
                    <span className="text-4xl font-black text-white tracking-tighter" style={{ textShadow: `2px 2px 0px ${COLORS.red}` }}>{gregTime}</span>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-1">
                        <span className="text-xs text-cyan-400 font-bold">GREGORIAN</span>
                        <span className="text-sm font-mono text-gray-300">{gregDate}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-yellow-400 font-bold">SOLAR HIJRI</span>
                        <span className="text-sm font-bold text-white font-sans">{persianDate}</span>
                    </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20 animate-scanline" style={{ animationDuration: '3s' }} />
            </div>
        </DraggableItem>
    );
};

// --- WIDGET: GEMINI UPLOAD ---
const DesktopUploadWidget = ({ onTransactionUpdate, onFileUpload, constraintsRef }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('IDLE');

    const processFile = async (file) => {
        if (!file) return;
        setStatus('ANALYZING');
        try {
            // Check if it's an image for receipt scanning
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const base64Data = reader.result.split(',')[1];
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
                    const prompt = "Analyze this image (receipt/statement). Extract the TOTAL amount and the MERCHANT/CATEGORY. Return ONLY a valid JSON object with keys: 'amount' (number) and 'summary' (string, max 15 chars). Example: {\"amount\": 120, \"summary\": \"GROCERIES\"}.";
                    const payload = { contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: file.type, data: base64Data } }] }], generationConfig: { responseMimeType: "application/json" } };

                    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    const result = await response.json();
                    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

                    if (text) {
                        const data = JSON.parse(text);
                        onTransactionUpdate(data);
                        setStatus('SUCCESS');
                        setTimeout(() => setStatus('IDLE'), 2000);
                    } else { throw new Error("No data returned from AI"); }
                };
            } else {
                // If it's not an image (or if AI fails), treat as generic file upload
                onFileUpload(file);
                setStatus('SUCCESS');
                setTimeout(() => setStatus('IDLE'), 2000);
            }
        } catch (e) {
            console.error(e);
            // Fallback to generic file upload on error
            onFileUpload(file);
            setStatus('SUCCESS'); // Technically a "success" as a file, even if AI failed
            setTimeout(() => setStatus('IDLE'), 3000);
        }
    };

    return (
        <DraggableItem initialX="auto" initialY="40px" className="right-10 w-64" constraintsRef={constraintsRef}>
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
                className={`relative p-6 border-2 transition-all duration-100 group min-h-[140px] flex flex-col items-center justify-center ${isDragging ? 'bg-yellow-400/20 border-yellow-400' : 'bg-black/80 border-gray-700 hover:border-cyan-400'}`}
            >
                <div className="absolute top-0 left-0 w-2 h-2 bg-white -translate-x-1 -translate-y-1" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-white translate-x-1 -translate-y-1" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-white -translate-x-1 translate-y-1" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-white translate-x-1 translate-y-1" />

                {status === 'ANALYZING' && (
                    <div className="text-center w-full">
                        <ScanLine size={32} className="mx-auto mb-2 text-cyan-400 animate-bounce" />
                        <div className="text-xs font-black text-cyan-400 animate-pulse">NEURAL_SCANNING...</div>
                        <div className="w-full h-1 bg-gray-800 mt-2 overflow-hidden"><motion.div className="h-full bg-yellow-400" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }} /></div>
                    </div>
                )}
                {status === 'SUCCESS' && <div className="text-center"><div className="text-green-500 font-bold text-sm">UPLOAD_COMPLETE</div></div>}
                {status === 'ERROR' && <div className="text-center"><div className="text-red-500 font-bold text-sm">SCAN_FAILED</div></div>}
                {status === 'IDLE' && (
                    <div className="text-center group-hover:scale-105 transition-transform pointer-events-none">
                        <UploadCloud size={32} className="mx-auto mb-2 text-gray-500 group-hover:text-cyan-400" />
                        <div className="font-bold text-sm text-gray-300">DROP_RECEIPT_OR_DATA</div>
                    </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && processFile(e.target.files[0])} />
            </div>
        </DraggableItem>
    );
};

// --- START MENU ---
const StartMenu = ({ isOpen, onOpenApp, onShutdown }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, skewX: 0 }}
                    animate={{ opacity: 1, y: 0, skewX: -5 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute bottom-20 left-6 w-72 z-50 p-1"
                    style={{ backgroundColor: COLORS.yellow }}
                >
                    <div className="bg-black p-1 h-full w-full" style={{ skewX: 5 }}>
                        <div className="bg-black p-4 border border-gray-800">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                                <div className="w-12 h-12 bg-red-600 flex items-center justify-center"><span className="font-black text-black text-xl">R</span></div>
                                <div><div className="font-bold text-lg" style={{ color: COLORS.yellow }}>RAOUF</div><div className="text-xs tracking-widest" style={{ color: COLORS.blue }}>NETRUNNER // LVL 50</div></div>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { id: 'terminal', label: 'TERMINAL', icon: Terminal },
                                    { id: 'tracker', label: 'FINANCE_DASH', icon: Activity },
                                    { id: 'network', label: 'NET_TRACE', icon: Share2 },
                                    { id: 'files', label: 'DATA_SHARDS', icon: HardDrive },
                                    { id: 'textpad', label: 'TEXT_PAD', icon: FileEdit }
                                ].map(app => (
                                    <button key={app.id} onClick={() => onOpenApp(app.id)} className="w-full flex items-center justify-between p-3 group hover:bg-yellow-400 transition-colors">
                                        <div className="flex items-center gap-3"><app.icon size={16} className="text-cyan-400 group-hover:text-black" /><span className="font-bold text-gray-300 group-hover:text-black">{app.label}</span></div>
                                        <ChevronRight size={14} className="text-red-600 opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-800">
                                <button onClick={onShutdown} className="w-full flex items-center gap-3 p-2 text-red-500 hover:text-red-400">
                                    <Power size={16} /><span className="font-bold">JACK_OUT</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- APPS & WIDGETS ---

// 1. CALCULATOR APP
const CalculatorApp = () => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handlePress = (val) => {
        if (val === 'C') {
            setDisplay('0');
            setEquation('');
        } else if (val === '=') {
            try {
                const result = Function('"use strict";return (' + equation + display + ')')();
                // Fix floating point precision issues (e.g. 0.1 + 0.2)
                const preciseResult = parseFloat(parseFloat(result).toPrecision(12));
                setDisplay(String(preciseResult));
                setEquation('');
            } catch (e) {
                setDisplay('ERR');
            }
        } else if (['+', '-', '*', '/'].includes(val)) {
            setEquation(display + val);
            setDisplay('0');
        } else {
            setDisplay(display === '0' ? val : display + val);
        }
    };

    const btnClass = "h-12 border border-gray-800 bg-gray-900/50 text-cyan-400 hover:bg-yellow-400 hover:text-black font-bold text-lg transition-colors";

    return (
        <div className="h-full flex flex-col p-4 bg-black">
            <div className="bg-gray-900 border border-gray-700 p-4 mb-4 text-right font-mono">
                <div className="text-xs text-gray-500 h-4">{equation}</div>
                <div className="text-3xl text-yellow-400 font-bold tracking-widest">{display}</div>
            </div>
            <div className="grid grid-cols-4 gap-2 flex-1">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(btn => (
                    <button key={btn} onClick={() => handlePress(btn)} className={btnClass}>
                        {btn}
                    </button>
                ))}
                <button onClick={() => handlePress('C')} className={`${btnClass} col-span-4 border-red-500 text-red-500`}>CLEAR_MEMORY</button>
            </div>
        </div>
    );
};

// 2. SETTINGS APP
const SettingsApp = ({ config, onUpdateConfig }) => {
    return (
        <div className="p-8 space-y-8 font-mono text-cyan-400">
            <section>
                <h3 className="text-yellow-400 text-xl font-bold mb-4 border-b border-gray-800 pb-2">DISPLAY_CONFIG</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span>BACKGROUND_FIT</span>
                        <div className="flex gap-2">
                            {['cover', 'contain', 'fill'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => onUpdateConfig('bgFit', mode)}
                                    className={`px-3 py-1 border ${config.bgFit === mode ? 'bg-yellow-400 text-black border-yellow-400' : 'border-gray-700 hover:border-white'}`}
                                >
                                    {mode.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-yellow-400 text-xl font-bold mb-4 border-b border-gray-800 pb-2">SYSTEM_AUDIO</h3>
                <div className="flex items-center gap-4">
                    <span>MASTER_VOLUME</span>
                    <input
                        type="range"
                        min="0" max="100"
                        className="flex-1 accent-yellow-400 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </section>

            <section>
                <h3 className="text-yellow-400 text-xl font-bold mb-4 border-b border-gray-800 pb-2">USER_PROFILE</h3>
                <div className="flex items-center gap-4 border border-gray-800 p-4">
                    <div className="w-16 h-16 bg-red-600 flex items-center justify-center font-black text-2xl text-black">R</div>
                    <div>
                        <div className="text-white font-bold">IDENTITY: RAOUF</div>
                        <div className="text-xs text-gray-500">CLASS: NETRUNNER</div>
                        <div className="text-xs text-green-500">STATUS: ONLINE</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// 3. MUSIC PLAYER (CYBER-AMP)
const MusicPlayerApp = () => {
    const [playing, setPlaying] = useState(false);
    const [track, setTrack] = useState(0);
    const tracks = ["NIGHT_CITY_RADIO_V1", "SAMURAI_NEVER_FADE", "ARASAKA_CORP_ANTHEM", "BADLANDS_WIND"];

    return (
        <div className="h-full bg-black p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Audio Visualizer Background Mockup */}
            {playing && <div className="absolute inset-0 opacity-20 flex items-end justify-center gap-1 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-2 bg-yellow-400"
                        animate={{ height: ["10%", "80%", "30%"] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
                    />
                ))}
            </div>}

            <div className="w-48 h-48 border-4 border-gray-800 rounded-full flex items-center justify-center mb-8 relative z-10 bg-black">
                <motion.div
                    animate={{ rotate: playing ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-0 border-t-4 border-yellow-400 rounded-full"
                />
                <div className="text-6xl text-gray-800 select-none">♪</div>
            </div>

            <div className="text-cyan-400 font-mono text-lg mb-2 tracking-widest relative z-10">{tracks[track]}</div>
            <div className="text-xs text-red-500 font-bold mb-4 relative z-10">{playing ? "PLAYING..." : "PAUSED"}</div>

            {/* Progress Bar Mock */}
            <div className="w-full h-1 bg-gray-800 mb-8 relative z-10">
                <motion.div
                    className="h-full bg-yellow-400"
                    initial={{ width: "0%" }}
                    animate={{ width: playing ? "100%" : "0%" }}
                    transition={{ duration: 180, ease: "linear" }} // Mock 3 min song
                />
            </div>

            <div className="flex items-center gap-6 relative z-10">
                <button onClick={() => setTrack(t => (t - 1 + tracks.length) % tracks.length)} className="p-3 border border-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"><ChevronRight className="rotate-180" /></button>
                <button onClick={() => setPlaying(!playing)} className="p-4 border-2 border-yellow-400 bg-yellow-400/10 hover:bg-yellow-400 hover:text-black transition-colors rounded-full">
                    {playing ? <Square size={24} fill="currentColor" /> : <ChevronRight size={24} fill="currentColor" />}
                </button>
                <button onClick={() => setTrack(t => (t + 1) % tracks.length)} className="p-3 border border-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"><ChevronRight /></button>
            </div>
        </div>
    );
};

// --- MAIN UPGRADED COMPONENT ---
export default function WinOS() {
    // --- MOBILE WARNING ---
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    // --- PERSISTENCE HOOK ---
    const usePersistentState = (key, defaultValue) => {
        const [state, setState] = useState(() => {
            try {
                const saved = localStorage.getItem(key);
                return saved ? JSON.parse(saved) : defaultValue;
            } catch (e) {
                console.warn("Storage corruption detected, resetting " + key);
                return defaultValue;
            }
        });
        useEffect(() => {
            try {
                localStorage.setItem(key, JSON.stringify(state));
            } catch (e) {
                console.error("Storage write failed", e);
            }
        }, [key, state]);
        return [state, setState];
    };

    const desktopRef = useRef(null);
    const [booted, setBooted] = useState(false);
    const [shutDown, setShutDown] = useState(false);

    // Persistent States
    const [windows, setWindows] = usePersistentState('os_windows', []);
    const [files, setFiles] = usePersistentState('os_files', []);
    const [sysConfig, setSysConfig] = usePersistentState('os_config', { bgFit: 'cover' }); // cover, contain, fill

    const [activeWindowId, setActiveWindowId] = useState(null);
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showPersianDate, setShowPersianDate] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const [desktopKey, setDesktopKey] = useState(0);
    const [stealthMode, setStealthMode] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Financial Data (Mock - could be persistent too)
    const [financeData, setFinanceData] = useState({
        balance: 1240500.00,
        spent: 4230,
        recent: [{ time: "10:42 AM", desc: "TRANSFER_TO_RAOUF", amount: 500 }]
    });

    // Clean up closed windows from persistence on load to avoid zombie processes if needed, 
    // but here we keep them to simulate "hibernate". 
    // However, minimization implementation requires non-persistent activeWindowId.

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const addNotification = (msg, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, msg, type }]);
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleCloseContextMenu = () => setContextMenu(null);

    const handleResetDesktop = () => {
        setDesktopKey(prev => prev + 1);
        handleCloseContextMenu();
        addNotification("GRID LAYOUT RESET", "info");
    };

    const handleShutdown = () => {
        setStartMenuOpen(false);
        setShutDown(true);
        // Clear window state on proper shutdown
        setWindows([]);
    };

    const handleReboot = () => {
        setShutDown(false);
        setBooted(false);
    };

    // --- APP REGISTRY ---
    const apps = {
        tracker: { name: 'FINANCE', icon: Activity, component: TrackerAppContent, props: { data: financeData } },
        files: { name: 'SHARDS', icon: HardDrive, component: null }, // Handled inline due to complexity
        terminal: { name: 'CMD', icon: Terminal, component: TerminalApp, props: { financeData } },
        network: { name: 'NET_TRACE', icon: Share2, component: NetworkMapApp },
        textpad: { name: 'TEXT_PAD', icon: FileEdit, component: TextPadApp },
        calc: { name: 'CALCULATOR', icon: Grid, component: CalculatorApp },
        music: { name: 'MEDIA_AMP', icon: Bell, component: MusicPlayerApp },
        settings: { name: 'SYS_CONFIG', icon: Settings, component: SettingsApp, props: { config: sysConfig, onUpdateConfig: (k, v) => setSysConfig(prev => ({ ...prev, [k]: v })) } },
        img_view: { name: 'IMAGE_VIEWER', icon: Eye, component: null } // Special handler
    };

    const desktopIcons = [
        { id: 'tracker', defaultY: '40px' },
        { id: 'files', defaultY: '140px' },
        { id: 'terminal', defaultY: '240px' },
        { id: 'network', defaultY: '340px' },
        { id: 'textpad', defaultY: '440px' },
        { id: 'calc', defaultY: '40px', x: '120px' }, // Second column
        { id: 'music', defaultY: '140px', x: '120px' },
        { id: 'settings', defaultY: '240px', x: '120px' },
    ];

    const bringToFront = (id) => {
        setWindows(prev => {
            const others = prev.filter(w => w.id !== id);
            const target = prev.find(w => w.id === id);
            return target ? [...others, target] : prev;
        });
        setActiveWindowId(id);
    };

    const openWindow = (appId, data = null) => {
        setStartMenuOpen(false);
        const existing = windows.find(w => w.id === appId);

        if (existing) {
            setWindows(prev => prev.map(w => w.id === appId ? { ...w, minimized: false, data: data || w.data } : w));
            bringToFront(appId);
            return;
        }

        setWindows(prev => [...prev, { id: appId, minimized: false, data }]);
        setActiveWindowId(appId);
    };

    const closeWindow = (id) => setWindows(windows.filter(w => w.id !== id));

    const toggleMinimize = (id) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: !w.minimized } : w));
        if (activeWindowId === id) setActiveWindowId(null);
    };

    const handleFileUpload = (file) => {
        const newFile = {
            name: file.name || `shard_${Math.floor(Math.random() * 99)}.dat`,
            date: new Date().toLocaleDateString(),
            type: file.type
        };
        setFiles(prev => [...prev, newFile]);
        openWindow('files');
        addNotification("DATA SHARD RECEIVED", "info");
    };

    // Receipt scanning / finance update handler
    const handleTransactionUpdate = (newData) => {
        setFinanceData(prev => ({
            ...prev,
            spent: prev.spent + newData.amount,
            balance: prev.balance - newData.amount,
            recent: [{
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                desc: newData.summary || "UNKNOWN",
                amount: newData.amount
            }, ...prev.recent]
        }));
        openWindow('tracker');
        addNotification("SECURE DATA PARSED", "info");
    };

    if (isMobile) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center font-mono text-red-500 z-[9999]">
                <ShieldAlert size={64} className="mb-4 animate-pulse" />
                <h1 className="text-2xl font-black tracking-widest mb-2">SYSTEM ERROR</h1>
                <p className="text-sm border flex items-center gap-2 px-2 py-1 mb-8 border-red-900 bg-red-900/10">ERROR_CODE: VIEWPORT_TOO_SMALL</p>
                <p className="text-gray-500 text-xs">This Neural Interface requires a standard desktop resolution to function safely.</p>
                <div className="mt-8 text-xs text-yellow-500">PLEASE ACCESS VIA TERMINAL (DESKTOP)</div>
            </div>
        );
    }

    if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;
    if (shutDown) return <ShutdownScreen onReboot={handleReboot} />;

    return (
        <div className="relative w-screen h-screen overflow-hidden font-sans bg-black selection:bg-yellow-400 selection:text-black"
            onClick={() => { setStartMenuOpen(false); handleCloseContextMenu(); }}
            onContextMenu={handleContextMenu}>

            {/* NOTIFICATIONS */}
            <AnimatePresence>
                {notifications.map(n => (
                    <Toast key={n.id} message={n.msg} type={n.type} onClose={() => setNotifications(prev => prev.filter(item => item.id !== n.id))} />
                ))}
            </AnimatePresence>

            {/* BACKGROUND LAYER */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className={`absolute inset-0 bg-center transition-all duration-500`}
                    style={{
                        backgroundImage: "url('/os_background.jpg')",
                        backgroundSize: sysConfig.bgFit
                    }}
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* Visual Overlays */}
                {!stealthMode && (
                    <>
                        {/* CRT Lines */}
                        <div className="absolute inset-0 z-[100] opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
                        {/* Grid */}
                        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`, backgroundSize: '50px 50px', opacity: 0.15 }} />
                    </>
                )}
                {/* Vignettes */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-900/10 to-transparent" />

                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-white/5 select-none pointer-events-none whitespace-nowrap z-0 glitch" data-text="NIGHT CITY">NIGHT CITY</div>
            </div>

            {/* DESKTOP AREA (Keyed for Reset) */}
            <div ref={desktopRef} className="relative z-10 w-full h-full p-6 pb-20" key={desktopKey} onClick={(e) => e.stopPropagation()}>

                {/* DRAGGABLE ICONS */}
                {desktopIcons.map((item) => {
                    const app = apps[item.id];
                    if (!app) return null;
                    return (
                        <DraggableItem key={item.id} initialX={item.x || "20px"} initialY={item.defaultY} className="w-24" constraintsRef={desktopRef}>
                            <button onDoubleClick={() => openWindow(item.id)} className="group flex flex-col items-center gap-2 focus:outline-none w-full">
                                <div className="w-14 h-14 bg-black/50 border border-gray-600 flex items-center justify-center group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-all duration-100 shadow-[4px_4px_0px_0px_rgba(255,0,0,0.5)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,240,255,0.8)]">
                                    <app.icon size={28} className="text-cyan-400 group-hover:text-black" />
                                </div>
                                <span className="text-xs font-bold tracking-widest bg-black/80 px-2 py-0.5 text-gray-300 group-hover:text-yellow-400">{app.name}</span>
                            </button>
                        </DraggableItem>
                    )
                })}

                {/* WIDGETS */}
                <DesktopCalendarWidget constraintsRef={desktopRef} />
                <DesktopUploadWidget onTransactionUpdate={handleTransactionUpdate} onFileUpload={handleFileUpload} constraintsRef={desktopRef} />

                {/* WINDOWS LAYER */}
                <AnimatePresence>
                    {windows.map((win, index) => {
                        const app = apps[win.id] || {};
                        const Component = app.component;
                        const title = app.name || win.id;
                        const Icon = app.icon || Eye;

                        return (
                            <WindowFrame
                                key={win.id}
                                title={title}
                                icon={Icon}
                                isActive={activeWindowId === win.id}
                                isMinimized={win.minimized}
                                onFocus={() => bringToFront(win.id)}
                                onClose={() => closeWindow(win.id)}
                                onMinimize={() => toggleMinimize(win.id)}
                                initialPos={{ x: (200 + index * 40) + 'px', y: (100 + index * 40) + 'px' }}
                                zIndex={100 + index}
                                constraintsRef={desktopRef}
                            >
                                {Component ? <Component {...(app.props || {})} /> :
                                    win.id === 'files' ? (
                                        <div className="p-4 bg-black h-full">
                                            <h3 className="text-xs font-bold mb-6 text-red-500">/VAR/ROOT/USER/SHARDS</h3>
                                            <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
                                                <button onClick={() => document.getElementById('hidden-upload').click()} className="px-3 py-1 bg-yellow-400 text-black text-xs font-bold">IMPORT_SHARD</button>
                                                <input id="hidden-upload" type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
                                            </div>
                                            {files.length === 0 ? <div className="text-center mt-20 text-gray-600 font-mono">NO_DATA_FOUND</div> :
                                                <div className="grid grid-cols-4 gap-4">
                                                    {files.map((f, i) => (
                                                        <div
                                                            key={i}
                                                            onDoubleClick={() => openWindow('img_view', f)}
                                                            className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 cursor-pointer border border-transparent hover:border-yellow-400 group"
                                                        >
                                                            <FileText size={32} className="text-cyan-400 group-hover:text-yellow-400" />
                                                            <span className="text-xs text-center truncate w-full text-gray-400">{f.name}</span>
                                                        </div>
                                                    ))}
                                                </div>}
                                        </div>
                                    ) : win.id === 'img_view' ? (
                                        <div className="flex items-center justify-center h-full bg-black min-h-[400px]">
                                            {win.data ? (
                                                <div className="text-center">
                                                    <div className="mb-4 text-green-500 font-mono">DECRYPTED_SEGMENT__</div>
                                                    <div className="p-4 border border-green-500 bg-green-500/10 text-green-400 font-mono max-w-md break-all">
                                                        {win.data.name} <br />
                                                        TYPE: {win.data.type || 'UNKNOWN_BIN'} <br />
                                                        SIZE: {Math.floor(Math.random() * 5000)} KB <br />
                                                        DATE: {win.data.date}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Lock size={48} className="mx-auto mb-4 text-red-500" />
                                                    <p className="text-red-500 font-mono font-bold">ENCRYPTED CONTENT</p>
                                                    <p className="text-xs text-gray-500">DECRYPTION KEY REQUIRED</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : null
                                }
                            </WindowFrame>
                        );
                    })}
                </AnimatePresence>

                <StartMenu
                    isOpen={startMenuOpen}
                    onClose={() => setStartMenuOpen(false)}
                    onOpenApp={openWindow}
                    onShutdown={handleShutdown}
                />

                {/* CONTEXT MENU */}
                <AnimatePresence>
                    {contextMenu && (
                        <ContextMenu
                            x={contextMenu.x}
                            y={contextMenu.y}
                            onClose={handleCloseContextMenu}
                            onReset={handleResetDesktop}
                            onToggleStealth={() => setStealthMode(!stealthMode)}
                            stealthMode={stealthMode}
                            onScan={() => addNotification("SYSTEM INTEGRITY: 100%", "info")}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* TASKBAR */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-black border-t border-gray-800 flex items-center justify-between px-2 z-50 select-none" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4">
                    <button onClick={() => setStartMenuOpen(!startMenuOpen)} className={`h-12 px-6 flex items-center justify-center transition-colors font-black text-lg tracking-wider ${startMenuOpen ? 'bg-red-600 text-black' : 'bg-yellow-400 hover:bg-yellow-300 text-black'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }}>START</button>
                    <div className="flex items-center gap-2 bg-gray-900 px-4 py-1 border-l-4 border-cyan-400">
                        <Search size={14} className="text-cyan-400" />
                        <input type="text" placeholder="SEARCH_NET..." className="bg-transparent border-none outline-none text-xs w-48 text-yellow-400 placeholder:text-gray-700 font-mono uppercase" />
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {windows.map(win => {
                        const appName = apps[win.id]?.name || win.id;
                        return (
                            <button key={win.id} onClick={() => win.minimized ? toggleMinimize(win.id) : bringToFront(win.id)} className={`h-8 px-4 flex items-center gap-2 border-b-2 transition-all ${activeWindowId === win.id && !win.minimized ? 'bg-white/10 border-yellow-400' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                                <span className={`text-xs font-bold uppercase ${activeWindowId === win.id ? 'text-yellow-400' : 'text-gray-500'}`}>
                                    {appName}
                                </span>
                            </button>
                        )
                    })}
                </div>

                <div className="flex items-center gap-6 pr-6 text-xs font-mono font-bold">
                    <div className="flex items-center gap-2 text-red-500"><Wifi size={14} /><span className="hidden md:inline">CONNECTED</span></div>
                    <button onClick={() => setShowPersianDate(!showPersianDate)} className="flex items-center gap-2 text-cyan-400 hover:text-yellow-400 transition-colors">
                        {showPersianDate ? <span className="text-yellow-400">{getPersianDate()}</span> : <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}