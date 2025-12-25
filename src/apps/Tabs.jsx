const Tabs = ({ active, label, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono transition-all border-b-2 ${active
                ? 'border-[var(--color-yellow)] text-[var(--color-yellow)] bg-[var(--color-yellow)]/10'
                : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon size={14} />
        {label}
    </button>
);

export default Tabs;