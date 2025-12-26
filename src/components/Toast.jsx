import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Bell } from 'lucide-react';
import { COLORS } from '../utils/theme';

const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="absolute top-20 right-4 z-[999] backdrop-blur-md bg-black/80 border-l-4 p-4 shadow-lg w-72 rounded-r-lg"
            style={{ borderColor: type === 'error' ? COLORS.RED : COLORS.YELLOW }}
        >
            <div className="flex items-center gap-3">
                {type === 'error' ? <ShieldAlert size={20} color={COLORS.RED} /> : <Bell size={20} color={COLORS.YELLOW} />}
                <div>
                    <div className="text-xs font-black tracking-widest text-gray-500">SYSTEM_ALERT</div>
                    <div className="text-sm font-bold text-white">{message}</div>
                </div>
            </div>
        </motion.div>
    );
};

export default Toast;
