import React from 'react';

const SettingsApp = ({ config, onUpdateConfig }) => {
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
                </div>
            </section>

            <section>
                <h3 className="text-[var(--color-yellow)] text-xl font-bold mb-4 border-b border-gray-800 pb-2">SYSTEM_AUDIO</h3>
                <div className="flex items-center gap-4">
                    <span>MASTER_VOLUME</span>
                    <input
                        type="range"
                        min="0" max="100"
                        className="flex-1 accent-[var(--color-yellow)] h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
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
        </div>
    );
};

export default SettingsApp;
