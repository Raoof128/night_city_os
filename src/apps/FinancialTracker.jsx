
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FinancialAgents from './FinancialAgents';
import Forecasting from './Forecasting';
import Investments from './Investments';
import Security from './Security';
import TabBar from './TabBar';
import {
    TrendingUp,
    Wallet,
    CreditCard,
    Activity,
    ArrowDownLeft,
    Sparkles,
    BrainCircuit,
    Target,
    Zap,
    Share2
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

// --- MONTE CARLO SIMULATION ---
const MonteCarloSim = ({ currentBalance, monthlyBurn }) => {
    const [scenarios, setScenarios] = useState([
        { id: 1, name: "BASE_CASE", impact: 0, type: 'monthly', active: true },
        { id: 2, name: "CRYPTO_CRASH", impact: -currentBalance * 0.4, type: 'onetime', active: false },
        { id: 3, name: "ARASAKA_CONTRACT", impact: 5000, type: 'monthly', active: false },
        { id: 4, name: "CYBERWARE_UPGRADE", impact: -15000, type: 'onetime', active: false }
    ]);

    const months = 12;
    const chartData = useMemo(() => {
        let basePoints = [];
        let simPoints = [];
        let baseBal = currentBalance;
        let simBal = currentBalance;

        for (let i = 0; i <= months; i++) {
            // Base: Just burn
            if (i > 0) baseBal -= monthlyBurn;
            basePoints.push({ x: i, y: baseBal });

            // Sim: Apply scenarios
            if (i > 0) {
                simBal -= monthlyBurn; // Base burn
                scenarios.filter(s => s.active && s.type === 'monthly').forEach(s => simBal += s.impact);
            }
            // One-time events at month 3 (simulation)
            if (i === 3) {
                scenarios.filter(s => s.active && s.type === 'onetime').forEach(s => simBal += s.impact);
            }
            simPoints.push({ x: i, y: simBal });
        }
        return { basePoints, simPoints };
    }, [currentBalance, monthlyBurn, scenarios]);

    const toggleScenario = (id) => {
        setScenarios(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    };

    const maxY = Math.max(...chartData.simPoints.map(p => p.y), ...chartData.basePoints.map(p => p.y), currentBalance);
    const minY = Math.min(...chartData.simPoints.map(p => p.y), ...chartData.basePoints.map(p => p.y), 0);
    const range = maxY - minY || 1;

    const normalize = (val) => 100 - ((val - minY) / range * 100);

    return (
        <div className="flex gap-6 h-full">
            <div className="w-1/3 space-y-4">
                <h3 className="text-[var(--color-yellow)] font-bold text-sm tracking-widest border-b border-gray-800 pb-2">SCENARIO_BUILDER</h3>
                <div className="space-y-2">
                    {scenarios.map(s => (
                        <div key={s.id} onClick={() => toggleScenario(s.id)} className={`p-3 border cursor-pointer transition-all flex justify-between items-center ${s.active ? 'border-[var(--color-yellow)] bg-[var(--color-yellow)]/10' : 'border-gray-700 bg-black/40 hover:border-gray-500'}`}>
                            <div>
                                <div className={`text-xs font-bold ${s.active ? 'text-white' : 'text-gray-500'}`}>{s.name}</div>
                                <div className="text-[10px] font-mono text-gray-500">{s.type === 'monthly' ? '/MO' : 'ONCE'}</div>
                            </div>
                            <div className={`font-mono text-xs ${s.impact > 0 ? 'text-[var(--color-blue)]' : 'text-[var(--color-red)]'}`}>
                                {s.impact > 0 ? '+' : ''}{s.impact.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-white/5 text-xs text-gray-400 font-mono">
                    PROJECTION: {chartData.simPoints[months].y > 0 ? <span className="text-[var(--color-blue)]">SOLVENT</span> : <span className="text-[var(--color-red)]">BANKRUPT</span>}
                    <br />
                    DELTA: {(chartData.simPoints[months].y - chartData.basePoints[months].y).toLocaleString()} €$
                </div>
            </div>

            <div className="flex-1 bg-black/40 border border-gray-800 relative p-4 flex flex-col">
                <h3 className="text-gray-500 font-bold text-xs absolute top-2 left-2">NET_WORTH_PROJECTION (12 MO)</h3>
                <div className="flex-1 relative mt-6">
                    {/* SVG Chart */}
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        {/* Grid Lines */}
                        {[0, 25, 50, 75, 100].map(y => (
                            <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#333" strokeDasharray="4 4" strokeWidth="1" />
                        ))}

                        {/* Base Line (Gray) */}
                        <polyline
                            points={chartData.basePoints.map((p, i) => `${(i / months) * 100},${normalize(p.y)}`).join(' ')}
                            fill="none"
                            stroke="#555"
                            strokeWidth="2"
                            strokeDasharray="5 5"
                        />

                        {/* Sim Line (Color) */}
                        <motion.polyline
                            points={chartData.simPoints.map((p, i) => `${(i / months) * 100},${normalize(p.y)}`).join(' ')}
                            fill="none"
                            stroke="var(--color-yellow)"
                            strokeWidth="3"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />

                        {/* Area under curve */}
                        <motion.path
                            d={`M 0,${normalize(chartData.simPoints[0].y)} ` + chartData.simPoints.map((p, i) => `L ${(i / months) * 100},${normalize(p.y)}`).join(' ') + ` L 100,100 L 0,100 Z`}
                            fill="var(--color-yellow)"
                            fillOpacity="0.1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            transition={{ delay: 0.5 }}
                        />
                    </svg>

                    {/* Event Marker at Month 3 */}
                    <div className="absolute top-0 bottom-0 border-l border-[var(--color-blue)] border-dashed opacity-50 flex items-end pb-1" style={{ left: `${(3 / months) * 100}%` }}>
                        <span className="text-[10px] text-[var(--color-blue)] transform -translate-x-1/2 bg-black px-1">EVENT_HORIZON</span>
                    </div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-2">
                    <span>NOW</span>
                    <span>+6 MO</span>
                    <span>+12 MO</span>
                </div>
            </div>
        </div>
    );
};

export default function FinancialTracker({ data, onLearnRule, onUpdateData, addNotification }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [learnMode, setLearnMode] = useState(null); // { keyword: '', category: '' }
    const [transactions] = useState(data.recent);
    const [currency, setCurrency] = useState('€$');
    const [showAddAssetForm, setShowAddAssetForm] = useState(false);
    const [filter, setFilter] = useState({ description: '', category: '' });
    const [forexRates] = useState({
        '€$': 1,
        'USD': 1.12,
        'EUR': 1.0,
        'GBP': 0.85,
        'JPY': 140.5,
        'AUD': 1.6,
    });

    // Currency Conversion Helper
    const convert = (amount) => {
        const rate = forexRates[currency] || 1;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency === '€$' ? 'USD' : currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount * rate);
    };

    // Aggregate Categories for Chart
    const categoryData = useMemo(() => {
        // Default categories
        const defaultCats = {
            'Cyberware': { value: 4500, color: 'var(--color-red)' },
            'Food/Drink': { value: 1200, color: 'var(--color-yellow)' },
            'Transport': { value: 800, color: 'var(--color-blue)' },
            'Data': { value: 2000, color: '#ffffff' },
            'Other': { value: 0, color: '#888888' }
        };

        // Aggregate from recent transactions
        const aggregated = { ...defaultCats };

        if (data.recent && Array.isArray(data.recent)) {
            data.recent.forEach(tx => {
                const cat = tx.category || 'Other';
                // Simple mapping or direct use if key matches
                const key = Object.keys(defaultCats).find(k => k.toLowerCase() === cat.toLowerCase()) || 'Other';

                if (aggregated[key]) {
                    aggregated[key].value += tx.amount;
                } else {
                    aggregated['Other'].value += tx.amount;
                }
            });
        }

        // Convert back to array
        return Object.entries(aggregated)
            .map(([label, info]) => ({ label, ...info }))
            .filter(item => item.value > 0);

    }, [data.recent]);

    return (
        <div className="h-full flex flex-col bg-transparent text-white font-sans selection:bg-[var(--color-yellow)] selection:text-black">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2 text-[var(--color-yellow)]">
                    <Activity size={20} />
                    <h2 className="text-lg font-black tracking-widest">FINANCE_OS <span className="text-xs text-gray-600 align-top">v2.5</span></h2>
                </div>

                {/* Currency & Sync Controls */}
                <div className="flex items-center gap-4">
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)]"
                    >
                        {Object.keys(forexRates).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button
                        onClick={() => alert('Syncing with 10,000+ institutions... (mocked)')}
                        className="flex items-center gap-2 px-3 py-1 bg-[var(--color-blue)]/10 text-[var(--color-blue)] border border-[var(--color-blue)]/50 hover:bg-[var(--color-blue)] hover:text-black transition-all text-xs font-bold rounded"
                    >
                        <Zap size={12} /> SYNC_BANKS
                    </button>
                </div>

                <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
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
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard
                                    label="TOTAL BALANCE"
                                    value={<span className="privacy-blur">{convert(data.balance)}</span>}
                                    subtext="+12% from last cycle"
                                    icon={Wallet}
                                    color="var(--color-yellow)"
                                />
                                <StatCard
                                    label="MONTHLY SPEND"
                                    value={<span className="privacy-blur">{convert(data.spent)}</span>}
                                    subtext="85% of budget Used"
                                    icon={CreditCard}
                                    color="var(--color-red)"
                                />
                                <StatCard
                                    label="SAVINGS GOAL"
                                    value={<span className="privacy-blur">{convert(45000)}</span>}
                                    subtext="Target: Arasaka Cyberdeck"
                                    icon={Target}
                                    color="var(--color-blue)"
                                />
                                <StatCard
                                    label="RUNWAY (BURN)"
                                    value={<span className="privacy-blur">{(data.balance / (data.spent || 1)).toFixed(1)} MO</span>}
                                    subtext="Survival at current rate"
                                    icon={Activity}
                                    color="#ffffff"
                                />
                            </div>

                            {/* Recent Txns */}
                            <div className="border border-gray-800 bg-[var(--color-surface)]/30">
                                <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-[var(--color-blue)] flex items-center gap-2">
                                        <ArrowDownLeft size={14} /> RECENT_TRANSACTIONS
                                    </h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => {
                                            const csvContent = "data:text/csv;charset=utf-8," + "Date,Desc,Category,Amount\n" + data.recent.map(e => `${e.time},${e.desc},${e.category},${e.amount}`).join("\n");
                                            const encodedUri = encodeURI(csvContent);
                                            const link = document.createElement("a");
                                            link.setAttribute("href", encodedUri);
                                            link.setAttribute("download", "nc_finance_export.csv");
                                            document.body.appendChild(link);
                                            link.click();
                                        }} className="text-gray-500 text-xs font-bold hover:text-[var(--color-yellow)] flex items-center gap-1">
                                            <Share2 size={10} /> EXPORT_CSV
                                        </button>
                    <button className="text-[var(--color-yellow)] text-xs font-bold hover:underline" onClick={() => setActiveTab('transactions')}>VIEW_ALL</button>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-800">
                                    {data.recent.slice(0, 5).map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700 group-hover:border-[var(--color-yellow)]">
                                                    <Zap size={14} className="text-gray-400 group-hover:text-[var(--color-yellow)]" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-200 group-hover:text-white flex items-center gap-2">
                                                        {tx.enriched && tx.logo && <img src={tx.logo} alt="" className="w-4 h-4" />}
                                                        {tx.desc}
                                                        {tx.isTaxDeductible && <span className="text-[9px] bg-[var(--color-blue)] text-black px-1 rounded font-black">TAX</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-600 font-mono">{tx.time} <span className="text-gray-500 mx-1">{'//'}</span> {new Date().toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-xs font-bold ${tx.status === 'Pending' ? 'text-gray-500' : 'text-white'}`}>{tx.status || 'Posted'}</span>
                                                <button onClick={() => alert('Splitting transaction... (mocked)')} className="text-xs font-bold text-[var(--color-blue)] hover:underline">Split</button>
                                                <span className="font-mono font-bold text-[var(--color-red)] privacy-blur">-{convert(tx.amount)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'transactions' && (
                        <motion.div
                            key="transactions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white">All Transactions</h3>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Filter by description..." className="bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)]" value={filter.description} onChange={(e) => setFilter({ ...filter, description: e.target.value })} />
                                    <select className="bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)]" value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
                                        <option value="">All Categories</option>
                                        <option value="Food/Drink">Food/Drink</option>
                                        <option value="Transport">Transport</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Subscription">Subscription</option>
                                    </select>
                                </div>
                            </div>
                            <div className="border border-gray-800 bg-[var(--color-surface)]/30">
                                <div className="divide-y divide-gray-800">
                                    {transactions.filter(tx => (filter.description === '' || tx.desc.toLowerCase().includes(filter.description.toLowerCase())) && (filter.category === '' || tx.category === filter.category)).map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700 group-hover:border-[var(--color-yellow)]">
                                                    <Zap size={14} className="text-gray-400 group-hover:text-[var(--color-yellow)]" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-200 group-hover:text-white flex items-center gap-2">
                                                        {tx.enriched && tx.logo && <img src={tx.logo} alt="" className="w-4 h-4" />}
                                                        {tx.desc}
                                                        {tx.isTaxDeductible && <span className="text-[9px] bg-[var(--color-blue)] text-black px-1 rounded font-black">TAX</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-600 font-mono">{tx.time} <span className="text-gray-500 mx-1">{'//'}</span> {new Date().toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-xs font-bold ${tx.status === 'Pending' ? 'text-gray-500' : 'text-white'}`}>{tx.status || 'Posted'}</span>
                                                <button onClick={() => alert('Splitting transaction... (mocked)')} className="text-xs font-bold text-[var(--color-blue)] hover:underline">Split</button>
                                                <span className="font-mono font-bold text-[var(--color-red)] privacy-blur">-{convert(tx.amount)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'spending' && (
                        <motion.div
                            key="spending"
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

                    {activeTab === 'forecasting' && (
                        <motion.div
                            key="forecasting"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Forecasting />
                        </motion.div>
                    )}

                    {activeTab === 'simulation' && (
                        <motion.div
                            key="simulation"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="h-full"
                        >
                            <MonteCarloSim currentBalance={data.balance} monthlyBurn={data.spent} />
                        </motion.div>
                    )}

                    {activeTab === 'investments' && (
                        <motion.div
                            key="investments"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Investments />
                        </motion.div>
                    )}

                    {activeTab === 'assets' && (
                        <motion.div
                            key="assets"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {/* Asset List */}
                            <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4">
                                <h3 className="text-[var(--color-yellow)] font-bold text-sm tracking-widest mb-4 border-b border-gray-800 pb-2">PHYSICAL_ASSETS</h3>
                                <div className="space-y-2">
                                    {(data.assets || []).map((asset) => (
                                        <div key={asset.id} className="flex justify-between items-center p-3 bg-black/40 border border-gray-700 hover:border-[var(--color-blue)] transition-colors group">
                                            <div>
                                                <div className="text-sm font-bold text-white group-hover:text-[var(--color-blue)]">{asset.name}</div>
                                                <div className="text-[10px] text-gray-500 font-mono">{asset.type.toUpperCase()}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-mono font-bold text-white privacy-blur">{convert(asset.value)}</div>
                                                <div className="text-[10px] text-[var(--color-green)] font-mono">+2.4%</div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full py-2 border border-dashed border-gray-600 text-gray-400 text-xs font-bold hover:border-[var(--color-yellow)] hover:text-[var(--color-yellow)] transition-colors" onClick={() => setShowAddAssetForm(true)}>+ REGISTER_NEW_ASSET</button>
                                </div>
                                {showAddAssetForm && (
                                    <div className="mt-4 p-4 border border-gray-700">
                                        <h4 className="text-sm font-bold text-white mb-2">Add New Asset</h4>
                                        <div className="flex flex-col gap-2">
                                            <input type="text" placeholder="Asset Name (e.g., Sneakers)" className="bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)]" />
                                            <input type="text" placeholder="Asset Type (e.g., Collectible)" className="bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)]" />
                                            <input type="number" placeholder="Value" className="bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)]" />
                                            <button className="bg-[var(--color-blue)]/20 text-[var(--color-blue)] border border-[var(--color-blue)] px-2 py-1 text-xs font-bold hover:bg-[var(--color-blue)] hover:text-black transition-colors" onClick={() => alert('Adding new asset... (mocked)')}>Add Asset</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Subscription Manager & Smart Rules */}
                            <div className="space-y-4">
                                <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4">
                                    <h3 className="text-[var(--color-red)] font-bold text-sm tracking-widest mb-4 border-b border-gray-800 pb-2">RECURRING_DRAINS</h3>
                                    {(!data.subscriptions || data.subscriptions.length === 0) ? (
                                        <div className="text-center text-gray-500 text-xs py-8">NO_SUBSCRIPTIONS_DETECTED</div>
                                    ) : (
                                        <div className="space-y-2">
                                            {data.subscriptions.map((sub, i) => (
                                                <div key={i} className="flex justify-between items-center p-2 bg-black/20 border-l-2 border-[var(--color-red)]">
                                                    <div className="flex items-center gap-2">
                                                        <Zap size={12} className="text-[var(--color-red)]" />
                                                        <span className="text-xs font-bold text-gray-300">{sub.service}</span>
                                                    </div>
                                                    <div className="font-mono text-xs text-white privacy-blur">{convert(sub.amount)} / {sub.cycle}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Smart Rule Feedback */}
                                <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4">
                                    <h3 className="text-[var(--color-blue)] font-bold text-sm tracking-widest mb-2 border-b border-gray-800 pb-2">NEURAL_TRAINING</h3>
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="KEYWORD (e.g. 'steam')"
                                            className="bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)] flex-1"
                                            onChange={(e) => setLearnMode(prev => ({ ...prev, keyword: e.target.value }))}
                                        />
                                        <select
                                            className="bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)] w-24"
                                            onChange={(e) => setLearnMode(prev => ({ ...prev, category: e.target.value }))}
                                        >
                                            <option>CAT...</option>
                                            <option value="Entertainment">FUN</option>
                                            <option value="Food/Drink">FOOD</option>
                                            <option value="Transport">MOVE</option>
                                            <option value="Subscription">SUB</option>
                                        </select>
                                        <button
                                            onClick={() => {
                                                if (learnMode?.keyword && learnMode?.category) {
                                                    onLearnRule && onLearnRule(learnMode.keyword, learnMode.category);
                                                    setLearnMode(null);
                                                }
                                            }}
                                            className="bg-[var(--color-blue)]/20 text-[var(--color-blue)] border border-[var(--color-blue)] px-2 hover:bg-[var(--color-blue)] hover:text-black transition-colors"
                                        >
                                            LEARN
                                        </button>
                                    </div>
                                    <div className="mt-2 text-[10px] text-gray-500">
                                        Teach the OS to auto-tag transactions. Rules are applied locally.
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

                    {activeTab === 'rules' && (
                        <motion.div
                            key="rules"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h3 className="text-lg font-bold text-white">Custom Rules Engine</h3>
                            {/* Add your UI for creating and managing rules here */}
                        </motion.div>
                    )}

                    {activeTab === 'agents' && (
                        <motion.div
                            key="agents"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                             className="h-full"
                        >
                           <FinancialAgents data={data} onUpdateData={onUpdateData} addNotification={addNotification} />
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Security />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
}
