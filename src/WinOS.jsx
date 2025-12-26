import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
    HardDrive,
    Activity,
    Wifi,
    Search,
    Grid,
    FileText,
    Terminal,
    Share2,
    Lock,
    Eye,
    FileEdit,
    Bell,
    Settings,
    ShieldAlert
} from 'lucide-react';

import { COLORS } from './utils/theme';
import WindowFrame from './components/WindowFrame';
import BootScreen from './components/BootScreen';
import ShutdownScreen from './components/ShutdownScreen';
import Toast from './components/Toast';
import ContextMenu from './components/ContextMenu';
import DraggableItem from './components/DraggableItem';
import DesktopCalendarWidget from './components/DesktopCalendarWidget';
import DesktopUploadWidget from './components/DesktopUploadWidget';
import StartMenu from './components/StartMenu';
import FinancialTracker from './apps/FinancialTracker';
import CalculatorApp from './apps/Calculator';
import SettingsApp from './apps/Settings';
import TerminalApp from './apps/Terminal';
import NetworkMapApp from './apps/NetworkMap';
import TextPadApp from './apps/TextPad';
import MusicPlayerApp from './apps/MusicPlayer';

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

    // V2 Financial Data
    const [financeData, setFinanceData] = useState({
        balance: 1240500.00,
        currency: 'EDDIES', // Primary Currency
        spent: 4230,
        recent: [{ time: "10:42 AM", desc: "TRANSFER_TO_RAOUF", amount: 500, category: "Income" }],
        assets: [ // New Asset Tracking
            { id: 1, name: "Arasaka Tower Apt", value: 850000, type: 'Real Estate' },
            { id: 2, name: "Quadra Turbo-R", value: 125000, type: 'Vehicle' },
            { id: 3, name: "Vintage Samurai Jacket", value: 5000, type: 'Collectible' }
        ],
        subscriptions: [] // Detected subs
    });

    const [privacyMode, setPrivacyMode] = useState(false);

    const [auditLog, setAuditLog] = useState([
        { id: 1, event: "SYSTEM_BOOT", time: new Date().toLocaleTimeString(), type: 'info' }
    ]);

    const logEvent = (event, type = 'info') => {
        setAuditLog(prev => [{ id: Date.now(), event, time: new Date().toLocaleTimeString(), type }, ...prev].slice(0, 50));
    };

    const [userRules, setUserRules] = useState({}); // For smart recategorization

    // AI Categorization & Rules Engine v2
    const categorizeTransaction = (desc, amount) => {
        const lowerDesc = desc.toLowerCase();

        // 1. Check User-Defined Rules (Custom Rules Engine)
        for (const rule of Object.values(userRules)) {
            if (lowerDesc.includes(rule.keyword)) {
                return { category: rule.category, isTaxDeductible: rule.isTaxDeductible };
            }
        }

        // 2. Smart Recategorization (Learned from corrections)
        // This is implicitly handled by the userRules state for now.

        // 3. Recurring Detection
        const recurringKeywords = ['netflix', 'spotify', 'subscription', 'monthly', 'plan'];
        if (recurringKeywords.some(kw => lowerDesc.includes(kw))) {
            return { category: 'Subscription', isRecurring: true };
        }

        // 4. ML-like Heuristics (based on context)
        if (lowerDesc.includes('dinner') || lowerDesc.includes('restaurant')) return { category: 'Food/Drink' };
        if (lowerDesc.includes('groceries') || lowerDesc.includes('market')) return { category: 'Groceries' };
        if (lowerDesc.includes('coffee') || lowerDesc.includes('starbucks')) return { category: 'Coffee' };
        if (lowerDesc.includes('uber') || lowerDesc.includes('taxi') || lowerDesc.includes('transport')) return { category: 'Transport' };
        if (lowerDesc.includes('game') || lowerDesc.includes('steam') || lowerDesc.includes('entertainment')) return { category: 'Entertainment' };

        // 5. Anomaly Detection
        if (amount > 500) {
            addNotification(`High value transaction: ${amount}`, 'warning');
        }
        // Duplicate charge detection could be implemented here by checking against recent transactions

        return { category: 'Other' };
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Privacy Mode Hotkey Listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                setPrivacyMode(prev => !prev);
                const newState = !privacyMode;
                logEvent(newState ? "PRIVACY_MODE_ENABLED" : "PRIVACY_MODE_DISABLED", "warning");
                addNotification(newState ? "PRIVACY_MODE_ENABLED" : "PRIVACY_MODE_DISABLED", "info");
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [privacyMode]);

    // Apply privacy class to body
    useEffect(() => {
        if (privacyMode) {
            document.body.classList.add('privacy-active');
        } else {
            document.body.classList.remove('privacy-active');
        }
    }, [privacyMode]);

    useEffect(() => {
        const lastTransaction = financeData.recent[0];
        if (lastTransaction) {
            // Anomaly Detection
            const hour = new Date(lastTransaction.time).getHours();
            if (lastTransaction.amount > 500 || hour < 6 || hour > 23) {
                addNotification(`Anomaly detected: ${lastTransaction.desc} for ${lastTransaction.amount}`, 'error');
            }

            // Merchant Enrichment (mock)
            setTimeout(() => {
                setFinanceData(prev => ({
                    ...prev,
                    recent: prev.recent.map(t => t.desc === lastTransaction.desc ? { ...t, enriched: true, logo: 'https://example.com/logo.png' } : t)
                }));
            }, 1000);
        }
    }, [financeData.recent]);

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

    // Helper to learn new rule
    const learnRule = (keyword, category) => {
        setUserRules(prev => ({ ...prev, [keyword.toLowerCase()]: category }));
        addNotification(`NEURAL NET UPDATED: ${keyword} -> ${category}`, "success");
    };

    // --- APP REGISTRY ---
    const apps = {
        tracker: { name: 'FINANCE', icon: Activity, component: FinancialTracker, props: { data: financeData, onLearnRule: learnRule } },
        files: { name: 'SHARDS', icon: HardDrive, component: null }, // Handled inline thanks to its simplicity
        terminal: { name: 'CMD', icon: Terminal, component: TerminalApp, props: { financeData } },
        network: { name: 'NET_TRACE', icon: Share2, component: NetworkMapApp },
        textpad: { name: 'TEXT_PAD', icon: FileEdit, component: TextPadApp },
        calc: { name: 'CALCULATOR', icon: Grid, component: CalculatorApp },
        music: { name: 'MEDIA_AMP', icon: Bell, component: MusicPlayerApp },
        settings: { name: 'SYS_CONFIG', icon: Settings, component: SettingsApp, props: { config: sysConfig, auditLog, onUpdateConfig: (k, v) => setSysConfig(prev => ({ ...prev, [k]: v })) } },
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
        const { category, isRecurring, isTaxDeductible } = categorizeTransaction(newData.summary || "", newData.amount);

        setFinanceData(prev => {
            const newSubs = isRecurring ? [...prev.subscriptions, { service: newData.summary, amount: newData.amount, cycle: 'Monthly' }] : prev.subscriptions;

            return {
                ...prev,
                spent: prev.spent + newData.amount,
                balance: prev.balance - newData.amount,
                subscriptions: newSubs,
                recent: [{
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    desc: newData.summary || "UNKNOWN",
                    category: category,
                    amount: newData.amount,
                    isTaxDeductible: isTaxDeductible,
                }, ...prev.recent]
            };
        });
        openWindow('tracker');
        addNotification(isRecurring ? "SUBSCRIPTION DETECTED" : "SECURE DATA PARSED", "info");
    };

    if (isMobile) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center font-mono text-[var(--color-red)] z-[9999]">
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
        <div className="relative w-screen h-screen overflow-hidden font-sans bg-black selection:bg-[var(--color-yellow)] selection:text-black"
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
                        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${COLORS.GRID} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.GRID} 1px, transparent 1px)`, backgroundSize: '50px 50px', opacity: 0.15 }} />
                    </>
                )}
                {/* Vignettes */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-900/10 to-transparent" />

                {/* Watermark using mix-blend-mode for better integration */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-white/5 select-none pointer-events-none whitespace-nowrap z-0 glitch mix-blend-overlay" data-text="NIGHT CITY">NIGHT CITY</div>
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
                                <div className="w-16 h-16 bg-black/40 backdrop-blur-sm border border-gray-600 rounded-xl flex items-center justify-center group-hover:bg-[var(--color-yellow)] group-hover:border-[var(--color-yellow)] transition-all duration-200 shadow-lg group-hover:shadow-[0_0_20px_rgba(255,224,0,0.4)] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 skew-x-12 translate-x-full group-hover:animate-shine pointer-events-none" />
                                    <app.icon size={30} className="text-[var(--color-blue)] group-hover:text-black transition-colors" />
                                </div>
                                <span className="text-xs font-bold tracking-widest bg-black/80 px-2 py-0.5 rounded text-gray-300 group-hover:text-[var(--color-yellow)] shadow-sm">{app.name}</span>
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
                                            <h3 className="text-xs font-bold mb-6 text-[var(--color-red)]">/VAR/ROOT/USER/SHARDS</h3>
                                            <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
                                                <button onClick={() => document.getElementById('hidden-upload').click()} className="px-3 py-1 bg-[var(--color-yellow)] text-black text-xs font-bold rounded-sm hover:bg-white transition-colors">IMPORT_SHARD</button>
                                                <input id="hidden-upload" type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
                                            </div>
                                            {files.length === 0 ? <div className="text-center mt-20 text-gray-600 font-mono">NO_DATA_FOUND</div> :
                                                <div className="grid grid-cols-4 gap-4">
                                                    {files.map((f, i) => (
                                                        <div
                                                            key={i}
                                                            onDoubleClick={() => openWindow('img_view', f)}
                                                            className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 cursor-pointer border border-transparent hover:border-[var(--color-yellow)] rounded transition-all group"
                                                        >
                                                            <FileText size={32} className="text-[var(--color-blue)] group-hover:text-[var(--color-yellow)]" />
                                                            <span className="text-xs text-center truncate w-full text-gray-400">{f.name}</span>
                                                        </div>
                                                    ))}
                                                </div>}
                                        </div>
                                    ) : win.id === 'img_view' ? (
                                        <div className="flex items-center justify-center h-full bg-black min-h-[400px]">
                                            {win.data ? (
                                                <div className="text-center">
                                                    <div className="mb-4 text-[var(--color-blue)] font-mono">DECRYPTED_SEGMENT__</div>
                                                    <div className="p-4 border border-[var(--color-blue)] bg-[var(--color-blue)]/10 text-[var(--color-blue)] font-mono max-w-md break-all rounded">
                                                        {win.data.name} <br />
                                                        TYPE: {win.data.type || 'UNKNOWN_BIN'} <br />
                                                        SIZE: {Math.floor(Math.random() * 5000)} KB <br />
                                                        DATE: {win.data.date}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Lock size={48} className="mx-auto mb-4 text-[var(--color-red)]" />
                                                    <p className="text-[var(--color-red)] font-mono font-bold">ENCRYPTED CONTENT</p>
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
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/90 backdrop-blur-md border-t border-gray-800 flex items-center justify-between px-2 z-50 select-none" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4">
                    <button onClick={() => setStartMenuOpen(!startMenuOpen)} className={`h-12 px-6 flex items-center justify-center transition-all font-black text-lg tracking-wider ${startMenuOpen ? 'bg-[var(--color-red)] text-black' : 'bg-[var(--color-yellow)] hover:bg-white hover:text-black text-black'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }}>
                        START
                    </button>
                    <div className="flex items-center gap-2 bg-[var(--color-surface)]/50 border border-white/5 rounded-full px-4 py-1.5 focus-within:border-[var(--color-blue)] transition-colors">
                        <Search size={14} className="text-[var(--color-blue)]" />
                        <input
                            type="text"
                            placeholder="SEARCH_NET..."
                            className="bg-transparent border-none outline-none text-xs w-48 text-[var(--color-yellow)] placeholder:text-gray-700 font-mono uppercase"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const term = e.target.value.toLowerCase();
                                    // Search Apps
                                    const foundApp = Object.keys(apps).find(key =>
                                        apps[key].name.toLowerCase().includes(term) || key.includes(term)
                                    );
                                    if (foundApp) {
                                        openWindow(foundApp);
                                        e.target.value = '';
                                        logEvent(`SEARCH_EXEC: OPEN_APP ${apps[foundApp].name}`, 'info');
                                    } else {
                                        addNotification("NO RESULTS FOUND", "error");
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {windows.map(win => {
                        const appName = apps[win.id]?.name || win.id;
                        return (
                            <button key={win.id} onClick={() => win.minimized ? toggleMinimize(win.id) : bringToFront(win.id)} className={`h-8 px-4 relative group flex items-center gap-2 border-b-2 transition-all rounded-t-lg ${activeWindowId === win.id && !win.minimized ? 'bg-white/10 border-[var(--color-yellow)]' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                                <span className={`text-xs font-bold uppercase ${activeWindowId === win.id ? 'text-[var(--color-yellow)]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                    {appName}
                                </span>
                                {activeWindowId === win.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-yellow)] shadow-[0_0_10px_var(--color-yellow)]" />}
                            </button>
                        )
                    })}
                </div>

                <div className="flex items-center gap-6 pr-6 text-xs font-mono font-bold">
                    <div className="flex items-center gap-2 text-[var(--color-red)]"><Wifi size={14} /><span className="hidden md:inline">CONNECTED</span></div>
                    <button onClick={() => setShowPersianDate(!showPersianDate)} className="flex items-center gap-2 text-[var(--color-blue)] hover:text-[var(--color-yellow)] transition-colors bg-white/5 px-3 py-1 rounded">
                        {showPersianDate ? <span className="text-[var(--color-yellow)]">{getPersianDate()}</span> : <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}