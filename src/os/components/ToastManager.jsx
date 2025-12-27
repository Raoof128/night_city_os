import { useState, useEffect } from 'react';
import { useOS } from '../hooks/useOS';
import { X, Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        info: <Info size={16} className="text-blue-400" />,
        warning: <AlertTriangle size={16} className="text-yellow-400" />,
        error: <AlertTriangle size={16} className="text-red-500" />,
        success: <CheckCircle size={16} className="text-green-400" />,
        default: <Bell size={16} className="text-gray-400" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="w-80 bg-black/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl p-4 flex gap-3 relative overflow-hidden group mb-2"
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${notification.type === 'error' ? 'bg-red-500' : 'bg-[var(--color-yellow)]'}`} />
            
            <div className="mt-1">
                {icons[notification.type] || icons.default}
            </div>
            
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-200 leading-none mb-1">{notification.title}</h4>
                <p className="text-xs text-gray-400 leading-snug break-words">{notification.message}</p>
                <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest">{notification.appId || 'SYSTEM'}</p>
            </div>

            <button 
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
                <X size={14} />
            </button>
        </motion.div>
    );
};

const ToastManager = () => {
    const { state } = useOS();
    const { notifications, quickSettings } = state;
    const [activeToasts, setActiveToasts] = useState([]);
    const [lastProcessedId, setLastProcessedId] = useState(null);

    useEffect(() => {
        if (notifications.length === 0) return;

        const latest = notifications[0];
        // If it's a new notification and we haven't shown it yet
        if (latest.id !== lastProcessedId) {
            setLastProcessedId(latest.id);
            
            // Don't show toasts if DND is on
            if (quickSettings.dnd) return;

            setActiveToasts(prev => [...prev, latest]);
        }
    }, [notifications, lastProcessedId, quickSettings.dnd]);

    const removeToast = (id) => {
        setActiveToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div 
            className="fixed top-4 right-4 z-[10000] flex flex-col items-end pointer-events-none"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="pointer-events-auto">
                <AnimatePresence>
                    {activeToasts.map(n => (
                        <Toast key={n.id} notification={n} onClose={() => removeToast(n.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ToastManager;
