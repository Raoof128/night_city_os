import { motion } from 'framer-motion';
import { useOS } from '../hooks/useOS';
import { X, BellOff, Trash2, Clock } from 'lucide-react';

const NotificationCenter = ({ isOpen, onClose }) => {
    const { state, actions } = useOS();
    const { notifications } = state;

    // Group by appId
    const grouped = notifications.reduce((acc, n) => {
        const app = n.appId || 'System';
        if (!acc[app]) acc[app] = [];
        acc[app].push(n);
        return acc;
    }, {});

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                    onClick={onClose}
                />
            )}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: isOpen ? 0 : '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-[9999] flex flex-col"
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="font-bold text-sm tracking-widest text-[var(--color-yellow)]">NOTIFICATIONS</h3>
                    <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                            <button 
                                onClick={() => actions.clearNotifications()}
                                className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                                title="Clear All"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-600 gap-3">
                            <BellOff size={32} />
                            <span className="text-xs uppercase tracking-widest">No Notifications</span>
                        </div>
                    ) : (
                        Object.entries(grouped).map(([app, items]) => (
                            <div key={app} className="space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase">{app}</span>
                                    <button 
                                        onClick={() => actions.clearNotifications(app)}
                                        className="text-[10px] text-gray-600 hover:text-white transition-colors"
                                    >
                                        CLEAR
                                    </button>
                                </div>
                                {items.map(n => (
                                    <div key={n.id} className="bg-white/5 border border-white/5 rounded p-3 hover:bg-white/10 transition-colors relative group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm text-gray-200">{n.title}</span>
                                            <button 
                                                onClick={() => actions.removeNotification(n.id)}
                                                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-all"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-snug">{n.message}</p>
                                        <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-600">
                                            <Clock size={10} />
                                            <span>{new Date(n.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default NotificationCenter;
