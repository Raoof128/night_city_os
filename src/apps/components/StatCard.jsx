import { COLORS } from '../../utils/theme';

const StatCard = ({ label, value, subtext, icon: Icon, color = COLORS.BLUE }) => (
    <div className="bg-[var(--color-surface)]/50 border border-gray-800 p-4 relative overflow-hidden group hover:border-[var(--color-yellow)] transition-colors">
        <div className="flex justify-between items-start mb-2">
            <div className="text-xs font-bold text-gray-500 tracking-wider">{label}</div>
            <Icon size={16} style={{ color }} />
        </div>
        <div className="text-2xl font-black text-white tracking-tight mb-1">
            {value}
        </div>
        <div className="text-xs font-mono" style={{ color }}>{subtext}</div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
    </div>
);

export default StatCard;
