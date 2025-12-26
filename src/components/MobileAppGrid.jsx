
import { motion } from 'framer-motion';

const MobileAppGrid = ({ apps, onOpenApp }) => {
    return (
        <div className="grid grid-cols-2 gap-4 p-4 pb-24 overflow-y-auto h-full content-start">
            {Object.entries(apps).map(([id, app], index) => {
                // Render all apps that have a name
                const Icon = app.icon;
                return (
                    <motion.button
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onOpenApp(id)}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center justify-center aspect-square bg-gray-900/80 border border-gray-800 rounded-xl backdrop-blur-sm active:bg-[var(--color-yellow)] active:text-black group transition-all shadow-lg hover:border-[var(--color-blue)]"
                    >
                        <div className="mb-3 p-4 bg-black/50 rounded-full border border-gray-700 group-active:border-black group-active:bg-transparent">
                            <Icon size={32} className="text-[var(--color-blue)] group-active:text-black" />
                        </div>
                        <span className="text-xs font-black tracking-widest text-gray-400 group-active:text-black uppercase">{app.name}</span>
                    </motion.button>
                );
            })}
        </div>
    );
};

export default MobileAppGrid;
