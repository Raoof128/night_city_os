import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert } from 'lucide-react';

const ImpulseIce = () => {
    const [iceActive, setIceActive] = useState(true);
    const [isCoolingDown, setIsCoolingDown] = useState(false);
    const [timer, setTimer] = useState(0);

    const startCooldown = () => {
        setIsCoolingDown(true);
        // Using 10 seconds for demo purposes instead of 24h
        setTimer(10);
    };

    useEffect(() => {
        let interval;
        if (isCoolingDown && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0) {
            setIsCoolingDown(false);
        }
        return () => clearInterval(interval);
    }, [isCoolingDown, timer]);

    return (
        <div className={`border p-4 transition-colors h-full flex flex-col justify-between ${iceActive ? 'border-[var(--color-blue)] bg-[var(--color-blue)]/5' : 'border-gray-800 bg-black/40'}`}>
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={16} className={iceActive ? 'text-[var(--color-blue)]' : 'text-gray-600'} />
                        <h3 className={`text-sm font-bold tracking-widest ${iceActive ? 'text-[var(--color-blue)]' : 'text-gray-500'}`}>
                            IMPULSE_ICE
                        </h3>
                    </div>
                    <button
                        onClick={() => setIceActive(!iceActive)}
                        className={`text-[10px] font-bold px-2 py-1 border transition-all ${iceActive ? 'border-[var(--color-blue)] text-[var(--color-blue)] hover:bg-[var(--color-blue)] hover:text-black' : 'border-gray-600 text-gray-600 hover:border-gray-400 hover:text-gray-400'}`}
                    >
                        {iceActive ? 'ARMED' : 'DISARMED'}
                    </button>
                </div>

                <div className="text-xs text-gray-400 mb-4 font-mono space-y-1">
                    <div>THRESHOLD: <span className="text-white">500.00 €$</span></div>
                    <div className={iceActive ? 'text-[var(--color-blue)]' : 'text-gray-600'}>
                        STATUS: {iceActive ? 'INTERCEPTING HIGH-RISK TRANSACTIONS' : 'SYSTEM VULNERABLE'}
                    </div>
                </div>
            </div>

            {iceActive && (
                <div className="bg-black border border-[var(--color-blue)]/30 p-3 relative overflow-hidden">
                    <div className="flex justify-between items-center z-10 relative">
                        <div>
                            <span className="text-[10px] text-gray-500 block">BLOCKED_PURCHASE</span>
                            <span className="text-xs font-bold text-[var(--color-blue)]">850.00 €$</span>
                        </div>

                        {isCoolingDown ? (
                             <div className="text-xs font-mono text-[var(--color-red)] animate-pulse font-bold">
                                {timer}s
                             </div>
                        ) : (
                            <button
                                onClick={startCooldown}
                                className="bg-[var(--color-blue)] text-black text-[10px] font-bold px-2 py-1 hover:bg-white flex items-center gap-1"
                            >
                                <Lock size={10} /> UNLOCK
                            </button>
                        )}
                    </div>
                    {isCoolingDown && (
                         <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-[var(--color-red)]"
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: 10, ease: "linear" }}
                         />
                    )}
                </div>
            )}
        </div>
    );
};

export default ImpulseIce;
