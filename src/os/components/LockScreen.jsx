import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ChevronRight } from 'lucide-react';
import { useOS } from '../hooks/useOS';

const LockScreen = () => {
    const { state, actions } = useOS();
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [unlocked, setUnlocked] = useState(false);

    const handleUnlock = (e) => {
        e.preventDefault();
        // Mock Auth: Accept '1234' or empty for now (Demo mode)
        if (password === '1234' || password === '') {
            setUnlocked(true);
            setTimeout(() => {
                actions.dispatch({ type: 'UNLOCK_SESSION' }); // We need to add this action
            }, 500);
        } else {
            setError(true);
            setTimeout(() => setError(false), 500);
        }
    };

    if (unlocked || !state.locked) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center font-mono">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/os_background.jpg')] bg-cover opacity-30 blur-sm pointer-events-none" />
            
            <div className="relative z-10 w-80 text-center">
                <div className="w-24 h-24 bg-[var(--color-yellow)] rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_var(--color-yellow)]">
                    <User size={48} className="text-black" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-1 tracking-widest">NETRUNNER</h2>
                <p className="text-xs text-[var(--color-blue)] mb-8">SESSION_LOCKED</p>

                <form onSubmit={handleUnlock} className="relative">
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="PIN: 1234"
                        autoFocus
                        className={`w-full bg-black/50 border ${error ? 'border-red-500 text-red-500' : 'border-white/20 text-white'} rounded-full py-3 px-6 text-center outline-none focus:border-[var(--color-yellow)] transition-all tracking-[0.5em]`}
                    />
                    <button 
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--color-yellow)] text-black rounded-full hover:scale-110 transition-transform"
                    >
                        <ChevronRight size={16} />
                    </button>
                </form>
                
                {error && <div className="text-red-500 text-xs mt-4 animate-pulse">ACCESS_DENIED</div>}
            </div>

            <div className="absolute bottom-8 left-0 w-full text-center text-[10px] text-gray-600">
                SECURE_CONNECTION // ARASAKA_CORP_V5
            </div>
        </div>
    );
};

export default LockScreen;
