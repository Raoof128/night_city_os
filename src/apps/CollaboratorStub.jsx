import { Users, Wifi, Globe } from 'lucide-react';

const CollaboratorStub = () => {
    return (
        <div className="h-full bg-black text-[var(--color-blue)] font-mono p-8">
            <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
                <Globe size={32} className="animate-pulse" />
                <div>
                    <h2 className="text-xl font-black tracking-widest">NET_RELAY_SYNC</h2>
                    <p className="text-[10px] text-gray-500">P2P_COLLABORATION_LAYER // V.1.0</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-4 rounded">
                    <h3 className="text-xs font-bold text-[var(--color-yellow)] mb-4 flex items-center gap-2">
                        <Users size={14} /> ACTIVE_CHANNELS
                    </h3>
                    <div className="space-y-2">
                        <div className="text-[10px] p-2 bg-black/40 rounded flex justify-between items-center border border-green-500/30">
                            <span>Main_Core_Hub</span>
                            <span className="text-green-500">CONNECTED</span>
                        </div>
                        <div className="text-[10px] p-2 bg-black/40 rounded flex justify-between items-center opacity-50 border border-white/5">
                            <span>Sector_7_Relay</span>
                            <span className="text-gray-600">OFFLINE</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded">
                    <h3 className="text-xs font-bold text-[var(--color-yellow)] mb-4 flex items-center gap-2">
                        <Wifi size={14} /> PEER_DISCOVERY
                    </h3>
                    <div className="text-center py-4">
                        <div className="text-[10px] text-gray-600 mb-4 italic">Scanning local subnet...</div>
                        <div className="flex justify-center gap-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1 h-1 bg-[var(--color-blue)] animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 border border-blue-500/20 bg-blue-500/5 text-[10px] leading-relaxed">
                <span className="text-blue-400 font-bold uppercase mr-2">[Notice]</span> 
                This terminal is currently operating in MOCK_MODE. 
                Full P2P synchronization requires a WebRTC signaling server manifest.
            </div>
        </div>
    );
};

export default CollaboratorStub;
