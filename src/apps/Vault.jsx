import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Lock, Unlock, KeyRound, Trash2, Plus } from 'lucide-react';
import { usePersistentState } from '../hooks/usePersistentState';
import { useSound } from '../hooks/useSound';

export default function VaultApp() {
    const [secrets, setSecrets] = usePersistentState('os_vault', []);
    const [locked, setLocked] = useState(true);
    const [progress, setProgress] = useState(0);
    const [form, setForm] = useState({ label: '', value: '' });
    const timerRef = useRef(null);
    const { play } = useSound(0.35, false);

    useEffect(() => {
        if (locked) setProgress(0);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [locked]);

    const startScan = () => {
        if (!locked) return;
        play('hum');
        let pct = 0;
        timerRef.current = setInterval(() => {
            pct += 5;
            setProgress(pct);
            if (pct >= 100) {
                clearInterval(timerRef.current);
                setLocked(false);
                play('beep');
            }
        }, 150);
    };

    const cancelScan = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (locked) setProgress(0);
    };

    const addSecret = () => {
        if (!form.label || !form.value) return;
        setSecrets(prev => [...prev, { id: Date.now(), ...form, encrypted: true }]);
        setForm({ label: '', value: '' });
        play('beep');
    };

    const removeSecret = (id) => {
        setSecrets(prev => prev.filter(s => s.id !== id));
        play('error');
    };

    const lockVault = () => {
        setLocked(true);
        setProgress(0);
    };

    return (
        <div className="h-full bg-black/70 text-white p-4 font-mono">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[var(--color-yellow)]">
                    <ShieldCheck size={16} /> <span className="tracking-[0.2em] text-xs">VAULT_ACCESS</span>
                </div>
                <button onClick={lockVault} className="text-[10px] px-2 py-1 border border-[var(--color-red)] text-[var(--color-red)] rounded hover:bg-[var(--color-red)]/20">
                    LOCK
                </button>
            </div>

            {locked ? (
                <div className="border border-[var(--color-blue)] p-4 rounded bg-black/60 text-center">
                    <div className="text-sm mb-2 flex items-center justify-center gap-2"><Lock size={16} /> Biometric Scan Required</div>
                    <p className="text-gray-500 text-xs mb-3">Hold to authenticate (3s)</p>
                    <button
                        onMouseDown={startScan}
                        onMouseUp={cancelScan}
                        onMouseLeave={cancelScan}
                        className="w-full py-3 bg-[var(--color-blue)]/20 border border-[var(--color-blue)] rounded hover:bg-[var(--color-blue)]/40 transition-colors flex items-center justify-center gap-2"
                    >
                        <KeyRound size={16} /> HOLD TO SCAN
                    </button>
                    <div className="mt-3 h-2 bg-gray-800 rounded">
                        <div className="h-full bg-[var(--color-yellow)] rounded" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[var(--color-blue)] text-xs"><Unlock size={14} /> SECURE STORAGE</div>
                    <div className="flex gap-2">
                        <input
                            value={form.label}
                            onChange={(e) => setForm({ ...form, label: e.target.value })}
                            placeholder="Label"
                            className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-sm"
                        />
                        <input
                            value={form.value}
                            onChange={(e) => setForm({ ...form, value: e.target.value })}
                            placeholder="Secret value"
                            className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-sm"
                        />
                        <button onClick={addSecret} className="px-3 py-2 bg-[var(--color-yellow)] text-black text-xs font-bold rounded hover:bg-white flex items-center gap-1">
                            <Plus size={14} /> SAVE
                        </button>
                    </div>
                    <div className="border border-gray-800 rounded p-2 max-h-52 overflow-y-auto custom-scrollbar">
                        {secrets.length === 0 && <div className="text-gray-600 text-sm">No secrets stored.</div>}
                        {secrets.map(secret => (
                            <div key={secret.id} className="flex items-center justify-between p-2 border-b border-gray-800 last:border-b-0">
                                <div>
                                    <div className="text-[var(--color-yellow)] text-xs">{secret.label}</div>
                                    <div className="text-gray-400 text-sm">{secret.value}</div>
                                    <div className="text-[10px] text-[var(--color-blue)]">ENCRYPTED: {secret.encrypted ? 'YES' : 'NO'}</div>
                                </div>
                                <button onClick={() => removeSecret(secret.id)} className="text-[var(--color-red)] hover:text-white">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
