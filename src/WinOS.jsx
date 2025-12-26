import React, { useState, useEffect, useRef, useMemo, useCallback, useReducer, memo } from 'react';
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
    ShieldAlert,
    Trash2,
    Pencil,
    Cpu,
    Code2,
    ShieldCheck,
    Monitor
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
import MobileAppGrid from './components/MobileAppGrid';
import CommandPalette from './components/CommandPalette';
import FinancialTracker from './apps/FinancialTracker';
import CalculatorApp from './apps/Calculator';
import SettingsApp from './apps/Settings';
import TerminalApp from './apps/Terminal';
import NetworkMapApp from './apps/NetworkMap';
import TextPadApp from './apps/TextPad';
import IcebreakerApp from './apps/Icebreaker';
import ConstructApp from './apps/Construct';
import SysMon from './apps/SysMon';
import VaultApp from './apps/Vault';
import MusicPlayerApp from './apps/MusicPlayer';
import { generateDailyQuests } from './utils/gamificationEngine';
import { MOCK_USERS, migrateDataToSpace, checkPermission, ACTIONS } from './utils/spaces';
import { usePersistentState } from './hooks/usePersistentState';
import { formatPersianDate } from './utils/helpers';
import { validateTransactionPayload } from './utils/validation';
import logger from './utils/logger';
import { useSound } from './hooks/useSound';
import { ensureRoot, addNode, deleteNode, renameNode, updateFileContent, createFile, createFolder, findNode } from './utils/vfs';

const isBrowser = typeof window !== 'undefined';
const withAlpha = (hex, alpha) => {
    const raw = hex.replace('#', '');
    const bigint = parseInt(raw, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
const DEFAULT_SYS_CONFIG = { bgFit: 'cover', wallpaper: 'night', volume: 0.4, muted: false, dragSensitivity: 0.2 };
const DEFAULT_GAMIFICATION = {
    xp: 0,
    badges: ['first_login'],
    quests: [],
    lastLogin: null
};

const windowReducer = (state, action) => {
    switch (action.type) {
        case 'OPEN': {
            const existing = state.find(w => w.id === action.id);
            if (existing) {
                return state.map(w => w.id === action.id ? { ...w, minimized: false, data: action.data ?? w.data } : w);
            }
            const nextZ = Math.max(0, ...state.map(w => w.zIndex || 0)) + 1;
            return [...state, { id: action.id, minimized: false, maximized: false, data: action.data || null, pos: action.pos || { x: '180px', y: '120px' }, zIndex: nextZ }];
        }
        case 'CLOSE':
            return state.filter(w => w.id !== action.id);
        case 'MINIMIZE':
            return state.map(w => w.id === action.id ? { ...w, minimized: !w.minimized } : w);
        case 'MAXIMIZE':
            return state.map(w => w.id === action.id ? { ...w, maximized: !w.maximized } : w);
        case 'FOCUS': {
            const target = state.find(w => w.id === action.id);
            if (!target) return state;
            const others = state.filter(w => w.id !== action.id).map(w => ({ ...w, zIndex: (w.zIndex || 0) }));
            const maxZ = Math.max(0, ...state.map(w => w.zIndex || 0)) + 1;
            return [...others, { ...target, zIndex: maxZ }];
        }
        case 'POSITION':
            return state.map(w => w.id === action.id ? { ...w, pos: { x: `${action.point.x}px`, y: `${action.point.y}px` } } : w);
        case 'CLOSE_ALL':
            return [];
        default:
            return state;
    }
};

export default function WinOS() {
    const [isMobile, setIsMobile] = useState(isBrowser ? window.innerWidth < 768 : false);
    useEffect(() => {
        if (!isBrowser) return;
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const desktopRef = useRef(null);
    const [booted, setBooted] = useState(false);
    const [shutDown, setShutDown] = useState(false);

    const [persistedWindows, setPersistedWindows] = usePersistentState('os_windows', []);
    const [windows, dispatch] = useReducer(windowReducer, persistedWindows);
    useEffect(() => {
        setPersistedWindows(windows);
    }, [windows, setPersistedWindows]);

    const [filesVfs, setFilesVfs] = usePersistentState('os_vfs', ensureRoot());
    const [activeTextFileId, setActiveTextFileId] = useState(null);
    const activeTextFile = activeTextFileId ? findNode(filesVfs, activeTextFileId) : null;

    const [sysConfig, setSysConfig] = usePersistentState('os_config', DEFAULT_SYS_CONFIG);
    const [gamification, setGamification] = usePersistentState('os_gamification', DEFAULT_GAMIFICATION);

    const [notifications, setNotifications] = useState([]);
    const addNotification = useCallback((msg, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, msg, type }]);
    }, []);

    useEffect(() => {
        const today = new Date().toLocaleDateString();
        if (gamification.lastLogin !== today) {
            setGamification(prev => ({
                ...prev,
                quests: generateDailyQuests(),
                lastLogin: today
            }));
            addNotification("DAILY QUESTS UPDATED", "success");
        }
    }, [addNotification, gamification.lastLogin, setGamification]);

    const [activeWindowId, setActiveWindowId] = useState(null);
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showPersianDate, setShowPersianDate] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const [desktopKey, setDesktopKey] = useState(0);
    const [stealthMode, setStealthMode] = useState(false);

    const [currentUser, setCurrentUser] = usePersistentState('os_current_user', MOCK_USERS[0]);
    const [spaces, setSpaces] = usePersistentState('os_spaces', []);
    const [currentSpaceId, setCurrentSpaceId] = usePersistentState('os_current_space_id', null);

    useEffect(() => {
        if (spaces.length > 0) return;
        const defaultSpace = migrateDataToSpace({
            balance: 1240500.00,
            spent: 4230,
            recent: [{ time: "10:42 AM", desc: "TRANSFER_TO_RAOUF", amount: 500, category: "Income" }],
            assets: [
                { id: 1, name: "Arasaka Tower Apt", value: 850000, type: 'Real Estate' },
                { id: 2, name: "Quadra Turbo-R", value: 125000, type: 'Vehicle' },
                { id: 3, name: "Vintage Samurai Jacket", value: 5000, type: 'Collectible' }
            ],
            subscriptions: []
        }, currentUser.id);
        setSpaces([defaultSpace]);
        setCurrentSpaceId(defaultSpace.id);
    }, [currentUser.id, setCurrentSpaceId, setSpaces, spaces.length]);

    const currentSpace = spaces.find(s => s.id === currentSpaceId) || spaces[0];

    const handleUpdateSpace = useCallback((updatedSpace) => {
        setSpaces(prev => prev.map(s => s.id === updatedSpace.id ? updatedSpace : s));
    }, [setSpaces]);

    const handleAddSpace = useCallback((newSpace) => {
        setSpaces(prev => [...prev, newSpace]);
        setCurrentSpaceId(newSpace.id);
    }, [setCurrentSpaceId, setSpaces]);

    const [privacyMode, setPrivacyMode] = useState(false);

    const [auditLog, setAuditLog] = useState([
        { id: 1, event: "SYSTEM_BOOT", time: new Date().toLocaleTimeString(), type: 'info' }
    ]);

    const logEvent = useCallback((event, type = 'info') => {
        setAuditLog(prev => [{ id: Date.now(), event, time: new Date().toLocaleTimeString(), type }, ...prev].slice(0, 50));
    }, []);

    const [userRules, setUserRules] = useState({});

    const categorizeTransaction = (desc, amount) => {
        const lowerDesc = desc.toLowerCase();
        for (const rule of Object.values(userRules)) {
            if (lowerDesc.includes(rule.keyword)) {
                return { category: rule.category, isTaxDeductible: rule.isTaxDeductible };
            }
        }
        const recurringKeywords = ['netflix', 'spotify', 'subscription', 'monthly', 'plan'];
        if (recurringKeywords.some(kw => lowerDesc.includes(kw))) {
            return { category: 'Subscription', isRecurring: true };
        }
        if (lowerDesc.includes('dinner') || lowerDesc.includes('restaurant')) return { category: 'Food/Drink' };
        if (lowerDesc.includes('groceries') || lowerDesc.includes('market')) return { category: 'Groceries' };
        if (lowerDesc.includes('coffee') || lowerDesc.includes('starbucks')) return { category: 'Coffee' };
        if (lowerDesc.includes('uber') || lowerDesc.includes('taxi') || lowerDesc.includes('transport')) return { category: 'Transport' };
        if (lowerDesc.includes('game') || lowerDesc.includes('steam') || lowerDesc.includes('entertainment')) return { category: 'Entertainment' };
        if (amount > 500) addNotification(`High value transaction: ${amount}`, 'warning');
        return { category: 'Other' };
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const { play } = useSound(sysConfig.volume, sysConfig.muted);

    useEffect(() => {
        if (!isBrowser) return undefined;
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                setPrivacyMode(prev => !prev);
                const newState = !privacyMode;
                logEvent(newState ? "PRIVACY_MODE_ENABLED" : "PRIVACY_MODE_DISABLED", "warning");
                addNotification(newState ? "PRIVACY_MODE_ENABLED" : "PRIVACY_MODE_DISABLED", "info");
            }
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [addNotification, logEvent, privacyMode]);

    useEffect(() => {
        if (privacyMode) {
            document.body.classList.add('privacy-active');
        } else {
            document.body.classList.remove('privacy-active');
        }
    }, [privacyMode]);

    useEffect(() => {
        if (!currentSpace?.data?.recent?.length) return;
        const [lastTransaction] = currentSpace.data.recent;
        if (!lastTransaction) return;
        const parsedDate = new Date(lastTransaction.time);
        const hour = Number.isNaN(parsedDate.getTime()) ? new Date().getHours() : parsedDate.getHours();
        if (lastTransaction.amount > 500 || hour < 6 || hour > 23) {
            addNotification(`Anomaly detected: ${lastTransaction.desc} for ${lastTransaction.amount}`, 'error');
            logEvent('ANOMALY_FLAGGED', 'warning');
        }
    }, [addNotification, currentSpace, handleUpdateSpace, logEvent]);

    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleCloseContextMenu = () => setContextMenu(null);

    const handleResetDesktop = () => {
        setDesktopKey(prev => prev + 1);
        handleCloseContextMenu();
        addNotification("GRID LAYOUT RESET", "info");
        logEvent('DESKTOP_RESET', 'info');
    };

    const handleShutdown = () => {
        setStartMenuOpen(false);
        setShutDown(true);
        dispatch({ type: 'CLOSE_ALL' });
        logEvent('SYSTEM_SHUTDOWN', 'warning');
    };

    const handleReboot = () => {
        setShutDown(false);
        setBooted(false);
        logEvent('SYSTEM_REBOOT', 'info');
    };

    const learnRule = useCallback((keyword, category) => {
        setUserRules(prev => ({ ...prev, [keyword.toLowerCase()]: category }));
        addNotification(`NEURAL NET UPDATED: ${keyword} -> ${category}`, "success");
    }, [addNotification]);

    const desktopIcons = useMemo(() => ([
        { id: 'tracker', defaultY: '40px' },
        { id: 'files', defaultY: '140px' },
        { id: 'terminal', defaultY: '240px' },
        { id: 'network', defaultY: '340px' },
        { id: 'textpad', defaultY: '440px' },
        { id: 'calc', defaultY: '40px', x: '120px' },
        { id: 'music', defaultY: '140px', x: '120px' },
        { id: 'settings', defaultY: '240px', x: '120px' },
        { id: 'construct', defaultY: '340px', x: '120px' },
        { id: 'icebreaker', defaultY: '440px', x: '120px' },
        { id: 'sysmon', defaultY: '540px', x: '120px' },
        { id: 'vault', defaultY: '540px' },
    ]), []);

    const commands = [
        ...desktopIcons.map(item => ({
            name: `OPEN ${item.id.toUpperCase()}`,
            icon: Eye,
            action: () => openWindow(item.id),
            shortcut: 'APP'
        })),
        { name: 'TOGGLE STEALTH MODE', icon: Eye, action: () => setStealthMode(p => !p), shortcut: 'MOD+S' },
        { name: 'TOGGLE PRIVACY MODE', icon: Lock, action: () => setPrivacyMode(p => !p), shortcut: 'MOD+SHIFT+P' },
        { name: 'JACK OUT (SHUTDOWN)', icon: ShieldAlert, action: handleShutdown, shortcut: 'SYS_HALT' },
        { name: 'RESET DESKTOP', icon: Grid, action: handleResetDesktop, shortcut: 'RESET' },
        { name: 'ADD TRANSACTION', icon: Activity, action: () => openWindow('tracker'), shortcut: 'FIN' },
        { name: 'SCAN RECEIPT', icon: Search, action: () => { openWindow('tracker'); addNotification("DROP RECEIPT ON WIDGET", "info"); }, shortcut: 'SCAN' }
    ];

    const bringToFront = (id) => {
        dispatch({ type: 'FOCUS', id });
        setActiveWindowId(id);
    };

    const openWindow = (appId, data = null) => {
        setStartMenuOpen(false);
        dispatch({ type: 'OPEN', id: appId, data });
        bringToFront(appId);
        play('hum');
    };

    const closeWindow = (id) => {
        dispatch({ type: 'CLOSE', id });
        play('error');
    };

    const toggleMinimize = (id) => {
        dispatch({ type: 'MINIMIZE', id });
        if (activeWindowId === id) setActiveWindowId(null);
    };

    const toggleMaximize = (id) => dispatch({ type: 'MAXIMIZE', id });

    const handleDragEnd = (id, point) => dispatch({ type: 'POSITION', id, point });

    const handleFileUpload = (file) => {
        const newFile = createFile({
            name: file.name || `shard_${Math.floor(Math.random() * 99)}.dat`,
            mime: file.type || 'application/octet-stream',
            content: ''
        });
        setFilesVfs(prev => addNode(prev, prev.id, newFile));
        openWindow('files');
        addNotification("DATA SHARD RECEIVED", "info");
        logEvent('FILE_SHARD_STORED', 'info');
    };

    const handleTransactionUpdate = (newData) => {
        if (!currentSpace) {
            logger.warn('Transaction update ignored: no active space selected.');
            addNotification("NO ACTIVE SPACE", "error");
            return;
        }
        if (!checkPermission(currentSpace, currentUser.id, ACTIONS.EDIT_DATA)) {
            addNotification("ACCESS DENIED: INSUFFICIENT PERMISSIONS", "error");
            logEvent('PERMISSION_DENIED_TRANSACTION', 'error');
            return;
        }
        let validatedPayload;
        try {
            validatedPayload = validateTransactionPayload(newData);
        } catch (error) {
            logger.error('Transaction validation failed', error);
            addNotification(error.message, 'error');
            return;
        }
        const { category, isRecurring, isTaxDeductible } = categorizeTransaction(validatedPayload.summary, validatedPayload.amount);
        const threshold = currentSpace.settings?.approvalThreshold || Infinity;
        const needsApproval = validatedPayload.amount > threshold;
        const status = needsApproval ? 'Pending Approval' : 'Posted';
        const newSpent = needsApproval ? (currentSpace.data.spent || 0) : (currentSpace.data.spent || 0) + validatedPayload.amount;
        const newBalance = needsApproval ? (currentSpace.data.balance || 0) : (currentSpace.data.balance || 0) - validatedPayload.amount;
        const updatedData = {
            ...currentSpace.data,
            spent: newSpent,
            balance: newBalance,
            subscriptions: isRecurring ? [...(currentSpace.data.subscriptions || []), { service: validatedPayload.summary, amount: validatedPayload.amount, cycle: 'Monthly' }] : (currentSpace.data.subscriptions || []),
            recent: [{
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                desc: validatedPayload.summary || "UNKNOWN",
                category: category,
                amount: validatedPayload.amount,
                isTaxDeductible: isTaxDeductible,
                status: status
            }, ...(currentSpace.data.recent || [])]
        };
        handleUpdateSpace({
            ...currentSpace,
            data: updatedData
        });
        openWindow('tracker');
        if (needsApproval) addNotification("TRANSACTION PENDING APPROVAL", "warning");
        else addNotification(isRecurring ? "SUBSCRIPTION DETECTED" : "SECURE DATA PARSED", "info");
        logEvent(needsApproval ? 'TRANSACTION_PENDING_APPROVAL' : 'TRANSACTION_POSTED', 'info');
    };

    const handleCreateTextFile = useCallback((name, content) => {
        const newNode = createFile({ name, mime: 'text/plain', content });
        setFilesVfs(prev => addNode(prev, prev.id, newNode));
        setActiveTextFileId(newNode.id);
        addNotification(`FILE_SAVED: ${name}`, 'success');
        play('beep');
    }, [addNotification, play, setFilesVfs]);

    const handleUpdateTextFile = useCallback((id, content) => {
        setFilesVfs(prev => updateFileContent(prev, id, content));
        addNotification("FILE_UPDATED", 'info');
    }, [addNotification, setFilesVfs]);

    const handleDeleteFile = (id) => {
        setFilesVfs(prev => deleteNode(prev, id));
        if (activeTextFileId === id) setActiveTextFileId(null);
        addNotification("FILE_DELETED", 'warning');
    };

    const handleRenameFile = (id) => {
        const newName = prompt('Enter new name');
        if (!newName) return;
        setFilesVfs(prev => renameNode(prev, id, newName));
    };

    const apps = useMemo(() => ({
        tracker: { name: 'FINANCE', icon: Activity, component: FinancialTracker, props: { data: currentSpace ? currentSpace.data : {}, currentSpace, spaces, currentUser, onSwitchSpace: setCurrentSpaceId, onAddSpace: handleAddSpace, onUpdateSpace: handleUpdateSpace, onSwitchUser: setCurrentUser, onLearnRule: learnRule, gamification, onUpdateGamification: setGamification } },
        files: { name: 'SHARDS', icon: HardDrive, component: null },
        terminal: { name: 'CMD', icon: Terminal, component: TerminalApp, props: { financeData: currentSpace ? currentSpace.data : {} } },
        network: { name: 'NET_TRACE', icon: Share2, component: NetworkMapApp },
        textpad: { name: 'TEXT_PAD', icon: FileEdit, component: TextPadApp, props: { activeFile: activeTextFile, onSaveFile: handleUpdateTextFile, onCreateFile: handleCreateTextFile } },
        icebreaker: { name: 'ICEBREAKER', icon: Code2, component: IcebreakerApp },
        construct: { name: 'CONSTRUCT', icon: Cpu, component: ConstructApp },
        sysmon: { name: 'SYS_MON', icon: Monitor, component: SysMon },
        vault: { name: 'VAULT', icon: ShieldCheck, component: VaultApp },
        calc: { name: 'CALCULATOR', icon: Grid, component: CalculatorApp },
        music: { name: 'MEDIA_AMP', icon: Bell, component: MusicPlayerApp },
        settings: { name: 'SYS_CONFIG', icon: Settings, component: SettingsApp, props: { config: sysConfig, auditLog, onUpdateConfig: (k, v) => setSysConfig(prev => ({ ...prev, [k]: v })) } },
        img_view: { name: 'IMAGE_VIEWER', icon: Eye, component: null }
    }), [activeTextFile, auditLog, currentSpace, currentUser, gamification, handleAddSpace, handleCreateTextFile, handleUpdateSpace, handleUpdateTextFile, learnRule, setCurrentSpaceId, setCurrentUser, setGamification, setSysConfig, spaces, sysConfig]);

    const wallpaperStyle = useMemo(() => (
        sysConfig.wallpaper === 'void'
            ? { backgroundImage: `radial-gradient(circle at 20% 20%, ${COLORS.VOID} 0, ${COLORS.VOID} 50%)`, backgroundSize: '80px 80px', backgroundColor: COLORS.VOID }
            : { backgroundImage: "url('/os_background.jpg')", backgroundSize: sysConfig.bgFit }
    ), [sysConfig.bgFit, sysConfig.wallpaper]);

    const DesktopBackdrop = memo(({ wallpaper, stealth }) => (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div
                className="absolute inset-0 bg-center transition-all duration-500"
                style={wallpaper}
            />
            <div className="absolute inset-0" style={{ backgroundColor: withAlpha(COLORS.VOID, 0.4) }} />
            {!stealth && (
                <>
                    <div className="absolute inset-0 z-[100] opacity-10" style={{
                        backgroundImage: `linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, ${withAlpha(COLORS.RED, 0.12)}, ${withAlpha(COLORS.BLUE, 0.06)}, ${withAlpha(COLORS.BLUE, 0.12)})`,
                        backgroundSize: '100% 2px, 3px 100%'
                    }} />
                    <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${COLORS.GRID} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.GRID} 1px, transparent 1px)`, backgroundSize: '50px 50px', opacity: 0.15 }} />
                </>
            )}
            <div className="absolute top-0 right-0 w-1/2 h-full" style={{ background: `linear-gradient(90deg, ${withAlpha(COLORS.RED, 0.2)} 0%, transparent 70%)` }} />
            <div className="absolute bottom-0 left-0 w-full h-1/3" style={{ background: `linear-gradient(0deg, ${withAlpha(COLORS.BLUE, 0.1)} 0%, transparent 80%)` }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-white/5 select-none pointer-events-none whitespace-nowrap z-0 glitch mix-blend-overlay" data-text="NIGHT CITY">NIGHT CITY</div>
        </div>
    ));
    DesktopBackdrop.displayName = 'DesktopBackdrop';

    if (!booted) return <BootScreen onComplete={() => { setBooted(true); play('boot'); }} />;
    if (shutDown) return <ShutdownScreen onReboot={handleReboot} />;

    return (
        <div className="relative w-screen h-screen overflow-hidden font-sans bg-black selection:bg-[var(--color-yellow)] selection:text-black"
            onClick={() => { setStartMenuOpen(false); handleCloseContextMenu(); }}
            onContextMenu={handleContextMenu}>

            <AnimatePresence>
                {notifications.map(n => (
                    <Toast key={n.id} message={n.msg} type={n.type} onClose={() => setNotifications(prev => prev.filter(item => item.id !== n.id))} />
                ))}
            </AnimatePresence>

            <AnimatePresence>
                {commandPaletteOpen && <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} commands={commands} />}
            </AnimatePresence>

            <DesktopBackdrop wallpaper={wallpaperStyle} stealth={stealthMode} />

            <div ref={desktopRef} className="relative z-10 w-full h-full p-6 pb-20" key={desktopKey} onClick={(e) => e.stopPropagation()}>
                {isMobile ? (
                    <MobileAppGrid apps={{}} onOpenApp={openWindow} />
                ) : (
                    desktopIcons.map((item) => (
                        <DraggableItem key={item.id} initialX={item.x || "20px"} initialY={item.defaultY} className="w-24" constraintsRef={desktopRef} dragElastic={sysConfig.dragSensitivity}>
                            <button onMouseEnter={() => play('hover')} onDoubleClick={() => openWindow(item.id)} className="group flex flex-col items-center gap-2 focus:outline-none w-full">
                                <div className="w-16 h-16 bg-black/40 backdrop-blur-sm border border-gray-600 rounded-xl flex items-center justify-center group-hover:bg-[var(--color-yellow)] group-hover:border-[var(--color-yellow)] transition-all duration-200 shadow-lg group-hover:shadow-[0_0_20px_rgba(255,224,0,0.4)] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 skew-x-12 translate-x-full group-hover:animate-shine pointer-events-none" />
                                    {React.createElement({
                                        tracker: Activity,
                                        files: HardDrive,
                                        terminal: Terminal,
                                        network: Share2,
                                        textpad: FileEdit,
                                        calc: Grid,
                                        music: Bell,
                                        settings: Settings,
                                        construct: Cpu,
                                        icebreaker: Code2,
                                        sysmon: Monitor,
                                        vault: ShieldCheck
                                    }[item.id] || Eye, { size: 30, className: "text-[var(--color-blue)] group-hover:text-black transition-colors" })}
                                </div>
                                <span className="text-xs font-bold tracking-widest bg-black/80 px-2 py-0.5 rounded text-gray-300 group-hover:text-[var(--color-yellow)] shadow-sm">{(item.id || '').toUpperCase()}</span>
                            </button>
                        </DraggableItem>
                    ))
                )}

                {!isMobile && (
                    <>
                        <DesktopCalendarWidget constraintsRef={desktopRef} />
                        <DesktopUploadWidget onTransactionUpdate={handleTransactionUpdate} onFileUpload={handleFileUpload} constraintsRef={desktopRef} />
                    </>
                )}

                <AnimatePresence>
                    {windows.map((win, index) => {
                        const app = apps[win.id] || {};
                        const Component = app.component;
                        const title = app.name || win.id;
                        const Icon = app.icon || Eye;
                        const zIndex = win.zIndex || (100 + index);
                        const isActive = activeWindowId === win.id;
                        return (
                            <WindowFrame
                                key={win.id}
                                title={title}
                                icon={Icon}
                                isActive={isActive}
                                isMinimized={win.minimized}
                                isMaximized={win.maximized}
                                onFocus={() => bringToFront(win.id)}
                                onClose={() => closeWindow(win.id)}
                                onMinimize={() => toggleMinimize(win.id)}
                                onToggleMaximize={() => toggleMaximize(win.id)}
                                pos={win.pos}
                                zIndex={zIndex}
                                constraintsRef={desktopRef}
                                isMobile={isMobile}
                                dragElastic={sysConfig.dragSensitivity}
                                onDragEnd={(point) => handleDragEnd(win.id, point)}
                            >
                                {Component ? <Component {...(app.props || {})} /> :
                                    win.id === 'files' ? (
                                        <div className="p-4 bg-black h-full">
                                            <h3 className="text-xs font-bold mb-4 text-[var(--color-red)]">/VAR/ROOT/USER/SHARDS</h3>
                                            <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
                                                <button onClick={() => setFilesVfs(prev => addNode(prev, prev.id, createFolder({ name: `folder_${Math.floor(Math.random() * 99)}` })))} className="px-3 py-1 bg-[var(--color-yellow)] text-black text-xs font-bold rounded-sm hover:bg-white transition-colors">NEW_FOLDER</button>
                                                <button onClick={() => setFilesVfs(prev => addNode(prev, prev.id, createFile({ name: `note_${Math.floor(Math.random() * 99)}.txt`, mime: 'text/plain', content: '' })))} className="px-3 py-1 bg-[var(--color-blue)]/20 border border-[var(--color-blue)] text-[var(--color-blue)] text-xs font-bold rounded-sm hover:bg-[var(--color-blue)] hover:text-black transition-colors">NEW_FILE</button>
                                            </div>
                                            {(!filesVfs.children || filesVfs.children.length === 0) ? <div className="text-center mt-20 text-gray-600 font-mono">NO_DATA_FOUND</div> :
                                                <div className="grid grid-cols-4 gap-4">
                                                    {filesVfs.children.map((f) => (
                                                        <div
                                                            key={f.id}
                                                            onDoubleClick={() => {
                                                                if (f.type === 'file') {
                                                                    if (f.mime === 'text/plain') {
                                                                        setActiveTextFileId(f.id);
                                                                        openWindow('textpad');
                                                                    } else {
                                                                        openWindow('img_view', f);
                                                                    }
                                                                }
                                                            }}
                                                            className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 cursor-pointer border border-transparent hover:border-[var(--color-yellow)] rounded transition-all group"
                                                        >
                                                            <FileText size={32} className="text-[var(--color-blue)] group-hover:text-[var(--color-yellow)]" />
                                                            <span className="text-xs text-center truncate w-full text-gray-400">{f.name}</span>
                                                            <div className="flex gap-1">
                                                                <button onClick={(e) => { e.stopPropagation(); handleRenameFile(f.id); }} className="text-[10px] text-[var(--color-blue)] hover:text-white"><Pencil size={12} /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteFile(f.id); }} className="text-[10px] text-[var(--color-red)] hover:text-white"><Trash2 size={12} /></button>
                                                            </div>
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
                                                        TYPE: {win.data.mime || 'UNKNOWN_BIN'} <br />
                                                        SIZE: {Math.floor(Math.random() * 5000)} KB
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

            <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/90 backdrop-blur-md border-t border-gray-800 flex items-center justify-between px-2 z-50 select-none" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4">
                    {!isMobile && (
                        <>
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
                        </>
                    )}
                </div>

                <div className={`flex items-center gap-1 ${isMobile ? 'overflow-x-auto max-w-[200px]' : ''}`}>
                    {windows.map(win => {
                        const appName = (win.id || '').toUpperCase();
                        return (
                            <button key={win.id} onClick={() => win.minimized ? toggleMinimize(win.id) : bringToFront(win.id)} className={`h-8 px-4 relative group flex items-center gap-2 border-b-2 transition-all rounded-t-lg ${activeWindowId === win.id && !win.minimized ? 'bg-white/10 border-[var(--color-yellow)]' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                                <span className={`text-xs font-bold uppercase ${activeWindowId === win.id ? 'text-[var(--color-yellow)]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                    {appName}
                                </span>
                                {activeWindowId === win.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-yellow)] shadow-[0_0_10px_var(--color-yellow)]" />}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-6 pr-6 text-xs font-mono font-bold">
                    <div className="flex items-center gap-2 text-[var(--color-red)]"><Wifi size={14} /><span className="hidden md:inline">CONNECTED</span></div>
                    <button onClick={() => setShowPersianDate(!showPersianDate)} className="flex items-center gap-2 text-[var(--color-blue)] hover:text-[var(--color-yellow)] transition-colors bg-white/5 px-3 py-1 rounded">
                        {showPersianDate ? <span className="text-[var(--color-yellow)]">{formatPersianDate()}</span> : <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}
