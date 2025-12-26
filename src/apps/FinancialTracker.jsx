
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TabBar from './TabBar';
import StatCard from './components/StatCard';
import DonutChart from './components/DonutChart';
import AIInsight from './components/AIInsight';
import MonteCarloSim from './components/MonteCarloSim';
import GamificationHub from './components/GamificationHub';
import GoalsTab from './components/GoalsTab';
import ShoppingListWidget from './components/ShoppingListWidget';
import ChallengesWidget from './components/ChallengesWidget';
import SpaceSwitcher from './components/SpaceSwitcher';
import SpaceSettingsModal from './components/SpaceSettingsModal';
import SplitTransactionModal from './components/SplitTransactionModal';
import { checkNudges } from '../utils/gamificationEngine';
import { checkPermission, ACTIONS } from '../utils/spaces';
import {
    TrendingUp,
    Wallet,
    CreditCard,
    Activity,
    ArrowDownLeft,
    Sparkles,
    Target,
    Zap,
    Share2,
    AlertTriangle,
    Settings,
    Check,
    XCircle
} from 'lucide-react';

export default function FinancialTracker({
    data,
    onLearnRule,
    gamification,
    onUpdateGamification,
    // Space Props
    currentSpace,
    spaces,
    currentUser,
    onSwitchSpace,
    onAddSpace,
    onUpdateSpace
}) {
    const [activeTab, setActiveTab] = useState('overview');
    const [learnMode, setLearnMode] = useState(null); // { keyword: '', category: '' }
    const activeNudges = useMemo(() => checkNudges(data), [data]);
    const [transactions] = useState(data.recent);
    const [currency, setCurrency] = useState('€$');
    const [showAddAssetForm, setShowAddAssetForm] = useState(false);
    const [showSpaceSettings, setShowSpaceSettings] = useState(false);
    const [splitTx, setSplitTx] = useState(null); // The transaction being split
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

    const handleApprove = (tx) => {
        const newSpent = (data.spent || 0) + tx.amount;
        const newBalance = (data.balance || 0) - tx.amount;
        const updatedRecent = data.recent.map(t => t === tx ? { ...t, status: 'Posted' } : t);

        onUpdateSpace({
            ...currentSpace,
            data: { ...currentSpace.data, spent: newSpent, balance: newBalance, recent: updatedRecent }
        });
    };

    const handleReject = (tx) => {
        const updatedRecent = data.recent.map(t => t === tx ? { ...t, status: 'Rejected' } : t);
        onUpdateSpace({
            ...currentSpace,
            data: { ...currentSpace.data, recent: updatedRecent }
        });
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
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[var(--color-yellow)]">
                        <Activity size={20} />
                        <h2 className="text-lg font-black tracking-widest hidden md:block">FINANCE_OS <span className="text-xs text-gray-600 align-top">v2.5</span></h2>
                    </div>
                    {/* Space Switcher */}
                    {spaces && (
                        <div className="flex items-center gap-2 pl-4 border-l border-gray-800">
                            <SpaceSwitcher
                                spaces={spaces}
                                currentSpace={currentSpace}
                                currentUser={currentUser}
                                onSwitchSpace={onSwitchSpace}
                                onAddSpace={onAddSpace}
                            />
                            <button
                                onClick={() => setShowSpaceSettings(true)}
                                className="text-gray-500 hover:text-[var(--color-yellow)] transition-colors"
                            >
                                <Settings size={14} />
                            </button>
                        </div>
                    )}
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

            {/* Space Settings Modal */}
            {showSpaceSettings && currentSpace && (
                <SpaceSettingsModal
                    space={currentSpace}
                    currentUser={currentUser}
                    onUpdateSpace={onUpdateSpace}
                    onClose={() => setShowSpaceSettings(false)}
                />
            )}

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
                            {/* Behavioral Nudges */}
                            {activeNudges.length > 0 && (
                                <div className="bg-[var(--color-blue)]/10 border border-[var(--color-blue)] p-3 flex flex-col gap-2 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-blue)]" />
                                    {activeNudges.map(nudge => (
                                        <div key={nudge.id} className="flex items-start gap-3">
                                            <AlertTriangle size={16} className="text-[var(--color-blue)] mt-1 flex-shrink-0" />
                                            <div>
                                                <div className="text-xs font-bold text-[var(--color-blue)]">{nudge.title}</div>
                                                <div className="text-xs text-gray-300">{nudge.message}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

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
                                                {tx.status === 'Pending Approval' && checkPermission(currentSpace, currentUser.id, ACTIONS.APPROVE_TRANSACTIONS) ? (
                                                    <div className="flex gap-2">
                                                            <button onClick={(e) => { e.stopPropagation(); handleApprove(tx); }} className="text-[10px] font-bold text-[var(--color-green)] border border-[var(--color-green)] px-1 hover:bg-[var(--color-green)] hover:text-black flex items-center gap-1"><Check size={10}/> APP</button>
                                                            <button onClick={(e) => { e.stopPropagation(); handleReject(tx); }} className="text-[10px] font-bold text-[var(--color-red)] border border-[var(--color-red)] px-1 hover:bg-[var(--color-red)] hover:text-black flex items-center gap-1"><XCircle size={10}/> REJ</button>
                                                    </div>
                                                ) : (
                                                    <span className={`text-xs font-bold ${tx.status === 'Pending Approval' ? 'text-[var(--color-yellow)] animate-pulse' : (tx.status === 'Rejected' ? 'text-[var(--color-red)]' : 'text-white')}`}>{tx.status || 'Posted'}</span>
                                                )}
                                                <button onClick={() => setSplitTx(tx)} className="text-xs font-bold text-[var(--color-blue)] hover:underline">Split</button>
                                                <span className="font-mono font-bold text-[var(--color-red)] privacy-blur">-{convert(tx.amount)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Split Transaction Modal */}
                            {splitTx && (
                                <SplitTransactionModal
                                    space={currentSpace}
                                    currentUser={currentUser}
                                    transaction={splitTx}
                                    onClose={() => setSplitTx(null)}
                                    onSplit={(txId, splits) => {
                                        const updatedRecent = data.recent.map(tx => {
                                            if (tx === splitTx) {
                                                 return { ...tx, splitData: splits };
                                            }
                                            return tx;
                                        });
                                        onUpdateSpace({
                                            ...currentSpace,
                                            data: { ...currentSpace.data, recent: updatedRecent }
                                        });
                                        setSplitTx(null);
                                    }}
                                />
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'goals' && (
                        <GoalsTab
                            space={currentSpace}
                            currentUser={currentUser}
                            onUpdateSpace={onUpdateSpace}
                        />
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
                                                {tx.status === 'Pending Approval' && checkPermission(currentSpace, currentUser.id, ACTIONS.APPROVE_TRANSACTIONS) ? (
                                                    <div className="flex gap-2">
                                                            <button onClick={(e) => { e.stopPropagation(); handleApprove(tx); }} className="text-[10px] font-bold text-[var(--color-green)] border border-[var(--color-green)] px-1 hover:bg-[var(--color-green)] hover:text-black flex items-center gap-1"><Check size={10}/> APP</button>
                                                            <button onClick={(e) => { e.stopPropagation(); handleReject(tx); }} className="text-[10px] font-bold text-[var(--color-red)] border border-[var(--color-red)] px-1 hover:bg-[var(--color-red)] hover:text-black flex items-center gap-1"><XCircle size={10}/> REJ</button>
                                                    </div>
                                                ) : (
                                                    <span className={`text-xs font-bold ${tx.status === 'Pending Approval' ? 'text-[var(--color-yellow)] animate-pulse' : (tx.status === 'Rejected' ? 'text-[var(--color-red)]' : 'text-white')}`}>{tx.status || 'Posted'}</span>
                                                )}
                                                <button onClick={() => setSplitTx(tx)} className="text-xs font-bold text-[var(--color-blue)] hover:underline">Split</button>
                                                <span className="font-mono font-bold text-[var(--color-red)] privacy-blur">-{convert(tx.amount)}</span>
                                            </div>
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
                                <ChallengesWidget space={currentSpace} currentUser={currentUser} onUpdateSpace={onUpdateSpace} />
                            </div>
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
                                <ShoppingListWidget space={currentSpace} currentUser={currentUser} onUpdateSpace={onUpdateSpace} />

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

                    {activeTab === 'career' && (
                        <motion.div
                            key="career"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <GamificationHub gamification={gamification} onUpdateGamification={onUpdateGamification} />
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
                </AnimatePresence>
            </div>
        </div >
    );
}
