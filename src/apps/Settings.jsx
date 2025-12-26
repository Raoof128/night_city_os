

const SettingsApp = ({ config, onUpdateConfig, auditLog }) => {
    return (
        <div className="p-8 space-y-8 font-mono text-[var(--color-blue)]">
            <section>
                <h3 className="text-[var(--color-yellow)] text-xl font-bold mb-4 border-b border-gray-800 pb-2">DISPLAY_CONFIG</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span>BACKGROUND_FIT</span>
                        <div className="flex gap-2">
                            {['cover', 'contain', 'fill'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => onUpdateConfig('bgFit', mode)}
                                    className={`px-3 py-1 border ${config.bgFit === mode ? 'bg-[var(--color-yellow)] text-black border-[var(--color-yellow)]' : 'border-gray-700 hover:border-white'}`}
                                >
                                    {mode.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>WALLPAPER</span>
                        <div className="flex gap-2">
                            {['night', 'void'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => onUpdateConfig('wallpaper', mode)}
                                    className={`px-3 py-1 border ${config.wallpaper === mode ? 'bg-[var(--color-yellow)] text-black border-[var(--color-yellow)]' : 'border-gray-700 hover:border-white'}`}
                                >
                                    {mode.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>DRAG_SENSITIVITY</span>
                        <input
                            type="range"
                            min="0.05"
                            max="0.8"
                            step="0.05"
                            value={config.dragSensitivity || 0.2}
                            onChange={(e) => onUpdateConfig('dragSensitivity', parseFloat(e.target.value))}
                            className="flex-1 ml-4 accent-[var(--color-yellow)] h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-[var(--color-yellow)] text-xl font-bold mb-4 border-b border-gray-800 pb-2">SYSTEM_AUDIO</h3>
                <div className="flex items-center gap-4">
                    <span>MASTER_VOLUME</span>
                    <input
                        type="range"
                        min="0" max="100"
                        value={(config.volume || 0) * 100}
                        onChange={(e) => onUpdateConfig('volume', parseInt(e.target.value, 10) / 100)}
                        className="flex-1 accent-[var(--color-yellow)] h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <button
                        onClick={() => onUpdateConfig('muted', !config.muted)}
                        className={`px-3 py-1 border ${config.muted ? 'border-red-500 text-red-400' : 'border-[var(--color-blue)] text-[var(--color-blue)]'} hover:bg-white/5`}
                    >
                        {config.muted ? 'UNMUTE' : 'MUTE'}
                    </button>
                </div>
            </section>

            <section>
                <h3 className="text-[var(--color-yellow)] text-xl font-bold mb-4 border-b border-gray-800 pb-2">USER_PROFILE</h3>
                <div className="flex items-center gap-4 border border-gray-800 p-4">
                    <div className="w-16 h-16 bg-[var(--color-red)] flex items-center justify-center font-black text-2xl text-black">R</div>
                    <div>
                        <div className="text-white font-bold">IDENTITY: RAOUF</div>
                        <div className="text-xs text-gray-500">CLASS: NETRUNNER</div>
                        <div className="text-xs text-[var(--color-blue)]">STATUS: ONLINE</div>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                    <h3 className="text-[var(--color-red)] text-xl font-bold">SECURITY_AUDIT_LOG</h3>
                    <span className="text-[10px] bg-red-900/40 text-red-200 px-2 py-1 rounded">RESTRICTED_ACCESS</span>
                </div>
                <div className="h-64 overflow-y-auto custom-scrollbar border border-red-900/30 bg-black/40 p-2 font-mono text-xs">
                    {(auditLog || []).map(log => (
                        <div key={log.id} className="grid grid-cols-[80px_1fr] gap-2 mb-1 hover:bg-white/5 p-1 rounded">
                            <span className="text-gray-500">{log.time}</span>
                            <span className={`${log.type === 'warning' ? 'text-[var(--color-red)]' : 'text-[var(--color-blue)]'}`}>
                                {log.type === 'warning' && '[ALERT] '}
                                {log.event}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SettingsApp;
