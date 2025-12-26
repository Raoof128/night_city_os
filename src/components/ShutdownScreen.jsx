import { motion } from 'framer-motion';

const ShutdownScreen = ({ onReboot }) => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center font-mono"
    >
        <div className="text-[var(--color-red)] text-4xl font-black tracking-widest mb-4">SYSTEM HALTED</div>
        <div className="text-gray-500 text-sm mb-8">It is safe to turn off your neural link.</div>
        <button
            onClick={onReboot}
            className="px-6 py-2 border border-[var(--color-yellow)] text-[var(--color-yellow)] hover:bg-[var(--color-yellow)] hover:text-black transition-colors font-bold"
        >
            MANUAL_REBOOT
        </button>
    </motion.div>
);

export default ShutdownScreen;
