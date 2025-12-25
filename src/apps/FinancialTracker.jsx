
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Wallet,
    CreditCard,
    PieChart,
    Activity,
    ArrowDownLeft,
    Sparkles,
    BrainCircuit,
    Target,
    Zap
} from 'lucide-react';

const COLORS = {
    YELLOW: 'var(--color-yellow)',
    BLUE: 'var(--color-blue)',
    RED: 'var(--color-red)',
    VOID: '#000000',
    SURFACE: 'var(--color-surface)',
    GRID: 'var(--color-grid)',
};

// --- COMPONENTS ---

const TabButton = ({ active, label, icon: Icon, onClick }) => (
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

const DonutChart = ({ data }) => {
    // Simple SVG Donut Chart
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let currentAngle = 0;

    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                {data.map((slice, i) => {
                    const percentage = slice.value / total;
                    const angle = percentage * 360;
                    const radius = 40;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDasharray = `${(percentage * circumference)} ${circumference}`;

                    const el = (
                        <motion.circle
                            key={i}
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke={slice.color}
                            strokeWidth="10"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={0}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            style={{ transformOrigin: 'center', transform: `rotate(${currentAngle}deg)` }}
                        />
                    );
                    currentAngle += angle;
                    return el;
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-500 font-bold">TOTAL</span>
                <span className="text-xl font-black text-white">{total.toLocaleString()}</span>
            </div>
        </div>
    );
};

const AIInsight = () => {
    const [thoughtSteps, setThoughtSteps] = useState([]);
    const [finalInsight, setFinalInsight] = useState(null);

    useEffect(() => {
        // Simulate "Thinking" process of Gemini 2.5
        const steps = [
            "Analyzing transaction patterns...",
            "Checking recurring subscriptions...",
            "Comparing against regional benchmarks...",
            "Calculating potential savings...",
            "Formulating budget advice..."
        ];

        let delay = 0;
        steps.forEach((step) => {
            setTimeout(() => {
                setThoughtSteps(prev => [...prev, step]);
            }, delay);
            delay += 800;
        });

        setTimeout(() => {
            setFinalInsight({
                title: "OPTIMIZATION_OPPORTUNITY",
                content: "Detected 15% increase in 'Night Market' spending. Reallocating 200 €$ from 'Entertainment' could maximize your cyberware savings goal by next month."
            });
        }, delay + 500);
    }, []);

    return (
        <div className="font-mono text-sm space-y-4">
            <div className="space-y-1">
                {thoughtSteps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-gray-500 text-xs"
                    >
                        <BrainCircuit size={10} className="text-[var(--color-blue)]" />
                        <span>{step}</span>
                        {i === thoughtSteps.length - 1 && !finalInsight && <span className="animate-pulse">_</span>}
                    </motion.div>
                ))}
            </div>

            {finalInsight && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-[var(--color-yellow)] bg-[var(--color-yellow)]/5 p-4 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-yellow)]" />
                    <div className="flex items-center gap-2 mb-2 text-[var(--color-yellow)] font-bold">
                        <Sparkles size={16} />
                        <span>{finalInsight.title}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{finalInsight.content}</p>
                    <div className="mt-3 flex gap-2">
                        <button className="px-3 py-1 bg-[var(--color-yellow)] text-black text-xs font-bold hover:bg-white transition-colors">APPLY_LIMITS</button>
                        <button className="px-3 py-1 border border-gray-600 text-gray-400 text-xs font-bold hover:text-white transition-colors">DISMISS</button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default function FinancialTracker({ data }) {
    const [activeTab, setActiveTab] = useState('overview');

    // Aggregate Categories for Chart
    const categoryData = useMemo(() => {
        // Use data.categories if available, else mock
        // Currently data.recent is the only source
        return [
            { label: 'Cyberware', value: 4500, color: 'var(--color-red)' },
            { label: 'Food/Drink', value: 1200 + (data.spent * 0.1), color: 'var(--color-yellow)' }, // Make it slightly dynamic to use `data`
            { label: 'Transport', value: 800, color: 'var(--color-blue)' },
            { label: 'Data', value: 2000, color: '#ffffff' },
        ];
    }, [data.spent]); // Depend on spent to satisfy strict dep check and make it actually change

    return (
        <div className="h-full flex flex-col bg-transparent text-white font-sans selection:bg-[var(--color-yellow)] selection:text-black">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2 text-[var(--color-yellow)]">
                    <Activity size={20} />
                    <h2 className="text-lg font-black tracking-widest">FINANCE_OS <span className="text-xs text-gray-600 align-top">v2.5</span></h2>
                </div>
                <div className="flex bg-black border border-gray-800">
                    <TabButton active={activeTab === 'overview'} label="OVERVIEW" icon={PieChart} onClick={() => setActiveTab('overview')} />
                    <TabButton active={activeTab === 'analytics'} label="ANALYTICS" icon={TrendingUp} onClick={() => setActiveTab('analytics')} />
                    <TabButton active={activeTab === 'insights'} label="AI_INSIGHTS" icon={BrainCircuit} onClick={() => setActiveTab('insights')} />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto custom-scrollbar p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Key Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <StatCard
                                    label="TOTAL BALANCE"
                                    value={`${data.balance.toLocaleString()} €$`}
                                    subtext="+12% from last cycle"
                                    icon={Wallet}
                                    color="var(--color-yellow)"
                                />
                                <StatCard
                                    label="MONTHLY SPEND"
                                    value={`${data.spent.toLocaleString()} €$`}
                                    subtext="85% of budget Used"
                                    icon={CreditCard}
                                    color="var(--color-red)"
                                />
                                <StatCard
                                    label="SAVINGS GOAL"
                                    value="45,000 €$"
                                    subtext="Target: Arasaka Cyberdeck"
                                    icon={Target}
                                    color="var(--color-blue)"
                                />
                            </div>

                            {/* Recent Txns */}
                            <div className="border border-gray-800 bg-[var(--color-surface)]/30">
                                <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-[var(--color-blue)] flex items-center gap-2">
                                        <ArrowDownLeft size={14} /> RECENT_TRANSACTIONS
                                    </h3>
                                    <button className="text-[var(--color-yellow)] text-xs font-bold hover:underline">VIEW_ALL</button>
                                </div>
                                <div className="divide-y divide-gray-800">
                                    {data.recent.map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700 group-hover:border-[var(--color-yellow)]">
                                                    <Zap size={14} className="text-gray-400 group-hover:text-[var(--color-yellow)]" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-200 group-hover:text-white">{tx.desc}</div>
                                                    <div className="text-xs text-gray-600 font-mono">{tx.time} <span className="text-gray-500 mx-1">//</span> {new Date().toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <span className="font-mono font-bold text-[var(--color-red)]">-{tx.amount.toLocaleString()} €$</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex gap-8 items-start"
                        >
                            <div className="flex-1 bg-[var(--color-surface)]/30 border border-gray-800 p-6 flex flex-col items-center">
                                <h3 className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-widest">Spending Distribution</h3>
                                <DonutChart data={categoryData} />
                                <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                                    {categoryData.map((cat, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                                <span className="text-xs font-bold text-gray-400">{cat.label}</span>
                                            </div>
                                            <span className="text-xs font-mono font-bold">{cat.value.toFixed(0)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-6 h-48 flex flex-col justify-center items-center text-center">
                                    <TrendingUp size={32} className="text-[var(--color-blue)] mb-2" />
                                    <div className="text-lg font-bold">NET WORTH TREND</div>
                                    <div className="text-xs text-gray-500">Currently projecting +4.5% growth</div>
                                    {/* Placeholder for complex line chart */}
                                    <div className="w-full h-1 bg-gray-700 mt-4 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[var(--color-blue)] w-3/4 opacity-50" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'insights' && (
                        <motion.div
                            key="insights"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-[var(--color-surface)]/30 border border-gray-800 p-6 min-h-[300px]"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="p-2 bg-[var(--color-blue)]/10 rounded-lg">
                                    <Sparkles size={20} className="text-[var(--color-blue)]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">GEMINI FINANCIAL ADVISOR</h3>
                                    <div className="text-xs text-gray-500">Powered by Neural Link v2.5</div>
                                </div>
                            </div>

                            <AIInsight />

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
