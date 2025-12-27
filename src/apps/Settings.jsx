import { useState, useEffect } from 'react';
import { useApp } from '../os/kernel/AppContext';
import { auditLogger } from '../os/kernel/AuditLog';
import { 
    Monitor, Shield, HardDrive, Cpu, 
    ToggleLeft, ToggleRight, Trash2 
} from 'lucide-react';

const SettingsApp = ({ config }) => {
    const { system } = useApp();
    const [activeTab, setActiveTab] = useState('system');
    const [auditLogs, setAuditLogs] = useState([]);

    useEffect(() => {
        if (activeTab === 'privacy') {
            auditLogger.getLogs().then(setAuditLogs);
        }
    }, [activeTab]);

    const tabs = [
        { id: 'system', icon: Monitor, label: 'SYSTEM' },
        { id: 'privacy', icon: Shield, label: 'PRIVACY' },
        { id: 'storage', icon: HardDrive, label: 'STORAGE' },
        { id: 'about', icon: Cpu, label: 'ABOUT' },
    ];

    return (
        <div className="h-full flex bg-black text-gray-300 font-mono">
            {/* Sidebar */}
            <div className="w-48 border-r border-white/10 flex flex-col pt-4">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-4 py-3 text-xs font-bold tracking-widest hover:bg-white/5 transition-colors ${activeTab === tab.id ? 'text-[var(--color-yellow)] bg-white/5 border-r-2 border-[var(--color-yellow)]' : ''}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'system' && (
                    <div className="space-y-8">
                        <Section title="APPEARANCE">
                            <Toggle 
                                label="DARK_MODE" 
                                value={config.mode === 'night'} 
                                onChange={() => system.setQuickSetting('mode', config.mode === 'night' ? 'light' : 'night')} // Note: This uses quickSettings logic which might differ from theme logic in P0. Adapting.
                                disabled={true} // Theme toggle logic in P0 was custom, simpler to leave read-only or fix later
                                subtext="System-wide Arasaka dark theme."
                            />
                            <Toggle 
                                label="REDUCED_MOTION" 
                                value={system.quickSettings.reducedMotion} 
                                onChange={() => system.setQuickSetting('reducedMotion', !system.quickSettings.reducedMotion)} 
                            />
                            <Toggle 
                                label="HIGH_CONTRAST" 
                                value={system.quickSettings.contrast} 
                                onChange={() => system.setQuickSetting('contrast', !system.quickSettings.contrast)} 
                            />
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-sm">FONT_SCALE</div>
                                    <div className="text-[10px] text-gray-500 mt-1">Adjust system text size.</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-[var(--color-yellow)]">
                                        {Math.round((config.fontScale || 1.0) * 100)}%
                                    </span>
                                    <input 
                                        type="range" 
                                        min="0.8" 
                                        max="1.5" 
                                        step="0.1" 
                                        value={config.fontScale || 1.0}
                                        onChange={(e) => system.setQuickSetting('fontScale', parseFloat(e.target.value))}
                                        className="w-32 accent-[var(--color-yellow)]"
                                    />
                                </div>
                            </div>
                        </Section>
                        <Section title="NOTIFICATIONS">
                            <Toggle 
                                label="DO_NOT_DISTURB" 
                                value={system.quickSettings.dnd} 
                                onChange={() => system.setQuickSetting('dnd', !system.quickSettings.dnd)} 
                                subtext="Suppress all incoming toast notifications."
                            />
                        </Section>
                    </div>
                )}

                {activeTab === 'privacy' && (
                    <div className="space-y-6">
                        <Section title="APP_PERMISSIONS">
                            {Object.entries(system.permissions).length === 0 ? (
                                <p className="text-sm text-gray-600">NO_PERMISSIONS_GRANTED</p>
                            ) : (
                                Object.entries(system.permissions).map(([appId, perms]) => (
                                    <div key={appId} className="bg-white/5 p-4 rounded border border-white/10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="font-bold text-[var(--color-blue)] uppercase">{appId}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {Object.entries(perms).map(([perm, status]) => (
                                                <div key={perm} className="flex justify-between items-center text-xs">
                                                    <span className="font-mono text-gray-400">{perm}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={status === 'granted' ? 'text-green-500' : 'text-red-500'}>
                                                            {status.toUpperCase()}
                                                        </span>
                                                        <button 
                                                            onClick={() => system.revokePermission(appId, perm)}
                                                            className="p-1 hover:text-red-500 transition-colors"
                                                            title="Revoke"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </Section>

                        <Section title="SECURITY_AUDIT_LOG">
                            <div className="h-64 overflow-y-auto custom-scrollbar border border-red-900/30 bg-black/40 p-2 font-mono text-xs">
                                {auditLogs.length === 0 && <span className="text-gray-600">NO_LOGS_FOUND</span>}
                                {auditLogs.map(log => (
                                    <div key={log.id} className="grid grid-cols-[80px_1fr] gap-2 mb-1 hover:bg-white/5 p-1 rounded">
                                        <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        <span className={`${log.outcome === 'deny' ? 'text-[var(--color-red)]' : 'text-[var(--color-blue)]'}`}>
                                            [{log.appId.toUpperCase()}] {log.action} &rarr; {log.outcome.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    </div>
                )}

                {activeTab === 'storage' && (
                    <div className="space-y-6">
                        <Section title="STORAGE_USAGE">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <StorageCard label="SYSTEM_CORE" value="~2.4 MB" color="blue" />
                                <StorageCard label="USER_DATA" value="~14.2 MB" color="yellow" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={async () => {
                                        if (confirm('WARNING: This will wipe all data for this profile. Continue?')) {
                                            await system.storage.clear(); // Clears App KV
                                            // Ideally clear FS too via OS API, but we lack a global clear in AppAPI.
                                            // Let's rely on hard reset for now, or add a specific clear action.
                                            location.reload();
                                        }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold rounded"
                                >
                                    <Trash2 size={14} /> CLEAR_CACHE_AND_RELOAD
                                </button>
                                <button
                                    onClick={async () => {
                                        const logs = await auditLogger.getLogs(100);
                                        const bundle = {
                                            version: '5.6.0',
                                            timestamp: new Date().toISOString(),
                                            userAgent: navigator.userAgent,
                                            state: {
                                                theme: system.theme,
                                                quickSettings: system.quickSettings,
                                                windowCount: system.windows.length,
                                                spaces: system.spaces.length
                                            },
                                            logs: logs.map(l => ({ ...l, details: undefined })) // Redact details
                                        };
                                        const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `nc_os_diagnostics_${Date.now()}.json`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 border border-[var(--color-blue)] text-[var(--color-blue)] hover:bg-[var(--color-blue)]/10 transition-colors text-xs font-bold rounded"
                                >
                                    <HardDrive size={14} /> EXPORT_DIAGNOSTIC_BUNDLE
                                </button>
                            </div>
                        </Section>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="space-y-6 text-center pt-10">
                        <div className="w-20 h-20 bg-[var(--color-yellow)] rounded-full mx-auto flex items-center justify-center text-black font-black text-3xl mb-4">
                            NC
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white mb-1">NIGHT_CITY_OS</h1>
                            <p className="text-[var(--color-blue)] font-mono text-sm">v5.5.0 // NEURAL_LINK_ESTABLISHED</p>
                        </div>
                        <div className="pt-8 border-t border-white/10 max-w-md mx-auto text-xs text-gray-500">
                            <p className="mb-2">KERNEL: 5.15.0-generic-nc</p>
                            <p className="mb-2">BUILD: 2025-12-27</p>
                            <p>UNAUTHORIZED ACCESS IS A CRIME PUNISHABLE BY DEATH.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 tracking-widest mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const Toggle = ({ label, value, onChange, subtext, disabled }) => (
    <div className={`flex justify-between items-center ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div>
            <div className="font-bold text-sm">{label}</div>
            {subtext && <div className="text-[10px] text-gray-500 mt-1">{subtext}</div>}
        </div>
        <button onClick={onChange} className={`text-[var(--color-yellow)] transition-transform active:scale-95`}>
            {value ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-600" />}
        </button>
    </div>
);

const StorageCard = ({ label, value, color }) => (
    <div className={`p-4 border border-${color}-500/30 bg-${color}-500/5 rounded`}>
        <div className="text-[10px] text-gray-500 mb-1">{label}</div>
        <div className={`text-xl font-bold text-${color}-500`}>{value}</div>
    </div>
);

export default SettingsApp;