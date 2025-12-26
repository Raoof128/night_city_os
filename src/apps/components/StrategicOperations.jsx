import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Radio, ArrowUpRight, Link2, Users, Sparkles, Crosshair, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Area, AreaChart } from 'recharts';
import { checkPermission, ACTIONS } from '../../utils/spaces';
import { calculateRoundups, cascadeContribution, projectFireTimeline, projectLegacyFund, rankDebts } from '../../utils/strategicOps';

const neonBlue = '#00F0FF';

const toCurrency = (value) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

const defaultState = {
    vaults: [],
    debts: [],
    burnRateTargets: [],
    microSiphonEnabled: true,
    priorityChain: [],
    accountabilityRunner: null,
    fireParams: { currentBalance: 10000, monthlyContribution: 500, burnRate: 2000, expectedReturn: 0.05 },
    legacyParams: { currentTuition: 15000, years: 8, annualInflation: 0.04, expectedReturn: 0.05 }
};

const formDefaults = {
    vault: { title: '', target: 5000, current: 0 },
    debt: { title: '', balance: 1200, apr: 0.18, minPayment: 50 },
    burn: { category: 'Consumables', reduction: 30, baseline: 1200 }
};

export default function StrategicOperations({ space, currentUser, onUpdateSpace }) {
    const canEdit = checkPermission(space, currentUser.id, ACTIONS.EDIT_DATA);
    const strategicState = useMemo(() => space.data?.strategicOps || defaultState, [space.data?.strategicOps]);
    const [formState, setFormState] = useState(formDefaults);
    const [debtMode, setDebtMode] = useState('avalanche');

    const safeUpdate = (patch) => {
        onUpdateSpace({
            ...space,
            data: {
                ...space.data,
                strategicOps: { ...strategicState, ...patch }
            }
        });
    };

    const rankedDebts = useMemo(
        () => rankDebts(strategicState.debts, debtMode).map((debt, idx) => ({ ...debt, rank: idx + 1 })),
        [strategicState.debts, debtMode]
    );

    const roundups = useMemo(() => {
        const siphoned = calculateRoundups(space.data?.recent || []);
        return siphoned;
    }, [space.data?.recent]);

    const fireProjection = useMemo(() => projectFireTimeline(strategicState.fireParams), [strategicState.fireParams]);
    const legacyProjection = useMemo(() => projectLegacyFund(strategicState.legacyParams), [strategicState.legacyParams]);

    const fireChartData = useMemo(() => {
        const months = Math.min(fireProjection.months || 0, 120);
        const points = [];
        for (let i = 0; i <= months; i += Math.max(1, Math.floor(months / 12))) {
            const projected = projectFireTimeline({
                ...strategicState.fireParams,
                currentBalance: strategicState.fireParams.currentBalance,
                monthlyContribution: strategicState.fireParams.monthlyContribution,
                burnRate: strategicState.fireParams.burnRate,
                expectedReturn: strategicState.fireParams.expectedReturn
            });
            points.push({ month: i, balance: projected.crossoverBalance, burn: strategicState.fireParams.burnRate * 12 });
        }
        return points.length > 0 ? points : [{ month: 0, balance: strategicState.fireParams.currentBalance, burn: strategicState.fireParams.burnRate * 12 }];
    }, [fireProjection.months, strategicState.fireParams]);

    const handleAddVault = () => {
        if (!canEdit || !formState.vault.title) return;
        safeUpdate({ vaults: [...strategicState.vaults, { ...formState.vault, id: `vault_${Date.now()}` }] });
        setFormState((prev) => ({ ...prev, vault: formDefaults.vault }));
    };

    const handleAddDebt = () => {
        if (!canEdit || !formState.debt.title) return;
        safeUpdate({ debts: [...strategicState.debts, { ...formState.debt, id: `debt_${Date.now()}` }] });
        setFormState((prev) => ({ ...prev, debt: formDefaults.debt }));
    };

    const handleAddBurnLimiter = () => {
        if (!canEdit || !formState.burn.category) return;
        safeUpdate({ burnRateTargets: [...strategicState.burnRateTargets, { ...formState.burn, id: `burn_${Date.now()}` }] });
        setFormState((prev) => ({ ...prev, burn: formDefaults.burn }));
    };

    const handleCascade = () => {
        const { updatedGoals } = cascadeContribution(
            strategicState.priorityChain.map((id) => strategicState.vaults.find((v) => v.id === id)).filter(Boolean),
            250
        );
        const updatedVaults = strategicState.vaults.map((vault) => {
            const override = updatedGoals.find((g) => g?.id === vault.id);
            return override ? { ...vault, current: override.current } : vault;
        });
        safeUpdate({ vaults: updatedVaults });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Crosshair className="text-[var(--color-yellow)]" size={20} />
                    <div>
                        <h3 className="text-lg font-black text-white tracking-widest">STRATEGIC_OPERATIONS</h3>
                        <p className="text-xs text-gray-500 font-mono">Plan, fund, and execute exit strategies.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-gray-400">
                        <input
                            type="checkbox"
                            checked={strategicState.microSiphonEnabled}
                            onChange={(e) => safeUpdate({ microSiphonEnabled: e.target.checked })}
                        />
                        MICRO_SIPHON (ROUND-UPS)
                    </label>
                    <span className="text-[10px] text-[var(--color-blue)] font-mono">Siphoned: {roundups.toFixed(2)} €$</span>
                </div>
            </div>

            {/* Vaults & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Shield size={14} className="text-[var(--color-yellow)]" /> SECURE_VAULTS
                        </h4>
                        {canEdit && (
                            <button className="text-[10px] px-2 py-1 border border-[var(--color-blue)] text-[var(--color-blue)] hover:bg-[var(--color-blue)] hover:text-black" onClick={handleAddVault}>
                                ADD_VAULT
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {strategicState.vaults.map((vault) => {
                            const progress = Math.min(100, (vault.current / (vault.target || 1)) * 100);
                            return (
                                <div key={vault.id} className="border border-gray-700 p-3 bg-black/40">
                                    <div className="flex justify-between text-sm text-white font-bold">
                                        <span>{vault.title}</span>
                                        <span className="text-[var(--color-blue)]">{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-mono">{toCurrency(vault.current)} / {toCurrency(vault.target)}</div>
                                    <div className="h-2 bg-gray-900 mt-2">
                                        <div className="h-full bg-gradient-to-r from-[var(--color-yellow)] to-[var(--color-blue)]" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                        {strategicState.vaults.length === 0 && <div className="text-xs text-gray-500">No vaults defined. Create one to start routing siphons.</div>}
                    </div>
                    {canEdit && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <input className="bg-black border border-gray-700 text-xs text-white p-2" placeholder="Title" value={formState.vault.title} onChange={(e) => setFormState((prev) => ({ ...prev, vault: { ...prev.vault, title: e.target.value } }))} />
                            <input className="bg-black border border-gray-700 text-xs text-white p-2" placeholder="Target" type="number" value={formState.vault.target} onChange={(e) => setFormState((prev) => ({ ...prev, vault: { ...prev.vault, target: Number(e.target.value) } }))} />
                            <input className="bg-black border border-gray-700 text-xs text-white p-2" placeholder="Current" type="number" value={formState.vault.current} onChange={(e) => setFormState((prev) => ({ ...prev, vault: { ...prev.vault, current: Number(e.target.value) } }))} />
                        </div>
                    )}
                </div>

                <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Radio size={14} className="text-[var(--color-red)]" /> PRIORITY_STACK
                        </h4>
                        <button className="text-[10px] text-[var(--color-blue)] border border-[var(--color-blue)] px-2 py-1 hover:bg-[var(--color-blue)] hover:text-black" onClick={handleCascade}>
                            CASCADE_250
                        </button>
                    </div>
                    <div className="space-y-2">
                        {strategicState.vaults.map((vault) => (
                            <label key={vault.id} className="flex items-center gap-2 text-xs text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={strategicState.priorityChain.includes(vault.id)}
                                    onChange={(e) => {
                                        const chain = e.target.checked
                                            ? [...strategicState.priorityChain, vault.id]
                                            : strategicState.priorityChain.filter((id) => id !== vault.id);
                                        safeUpdate({ priorityChain: chain });
                                    }}
                                />
                                {vault.title}
                                <Link2 size={12} className="text-gray-600" />
                            </label>
                        ))}
                        {strategicState.priorityChain.length === 0 && <div className="text-xs text-gray-500">Link vaults to auto-redirect surplus once filled.</div>}
                    </div>
                </div>
            </div>

            {/* Debt & Burn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <ArrowUpRight size={14} className="text-[var(--color-yellow)]" /> LIABILITY_LIQUIDATION
                        </h4>
                        <div className="flex gap-2">
                            <button className={`text-[10px] px-2 py-1 border ${debtMode === 'avalanche' ? 'border-[var(--color-blue)] text-[var(--color-blue)]' : 'border-gray-700 text-gray-500'}`} onClick={() => setDebtMode('avalanche')}>AVALANCHE</button>
                            <button className={`text-[10px] px-2 py-1 border ${debtMode === 'snowball' ? 'border-[var(--color-blue)] text-[var(--color-blue)]' : 'border-gray-700 text-gray-500'}`} onClick={() => setDebtMode('snowball')}>SNOWBALL</button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {rankedDebts.map((debt) => (
                            <div key={debt.id} className="p-3 border border-gray-700 bg-black/40 flex justify-between items-center">
                                <div>
                                    <div className="text-sm text-white font-bold">{debt.title}</div>
                                    <div className="text-[10px] text-gray-500 font-mono">APR {Math.round(debt.apr * 100)}% • Min {toCurrency(debt.minPayment)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-[var(--color-yellow)] font-black">#{debt.rank}</div>
                                    <div className="text-sm font-mono text-[var(--color-red)]">{toCurrency(debt.balance)}</div>
                                </div>
                            </div>
                        ))}
                        {rankedDebts.length === 0 && <div className="text-xs text-gray-500">No liabilities logged.</div>}
                    </div>
                    {canEdit && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                            <input className="bg-black border border-gray-700 text-xs text-white p-2" placeholder="Name" value={formState.debt.title} onChange={(e) => setFormState((prev) => ({ ...prev, debt: { ...prev.debt, title: e.target.value } }))} />
                            <input className="bg-black border border-gray-700 text-xs text-white p-2" placeholder="Balance" type="number" value={formState.debt.balance} onChange={(e) => setFormState((prev) => ({ ...prev, debt: { ...prev.debt, balance: Number(e.target.value) } }))} />
                            <input className="bg-black border border-gray-700 text-xs text-white p-2" placeholder="APR" type="number" step="0.01" value={formState.debt.apr} onChange={(e) => setFormState((prev) => ({ ...prev, debt: { ...prev.debt, apr: Number(e.target.value) } }))} />
                            <input className="bg-black border border-gray-700 text-xs text-white p-2" placeholder="Min Pay" type="number" value={formState.debt.minPayment} onChange={(e) => setFormState((prev) => ({ ...prev, debt: { ...prev.debt, minPayment: Number(e.target.value) } }))} />
                        </div>
                    )}
                    {canEdit && <button className="mt-2 text-[10px] text-[var(--color-blue)] border border-[var(--color-blue)] px-2 py-1 hover:bg-[var(--color-blue)] hover:text-black" onClick={handleAddDebt}>ADD_LIABILITY</button>}
                </div>

                <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <BarChart2 size={14} className="text-[var(--color-blue)]" /> BURN_RATE_LIMITER
                        </h4>
                        {canEdit && <button className="text-[10px] text-[var(--color-blue)] border border-[var(--color-blue)] px-2 py-1 hover:bg-[var(--color-blue)] hover:text-black" onClick={handleAddBurnLimiter}>ADD_TARGET</button>}
                    </div>
                    <div className="space-y-2">
                        {strategicState.burnRateTargets.map((burn) => (
                            <div key={burn.id} className="p-3 border border-gray-700 bg-black/40">
                                <div className="flex justify-between text-sm text-white font-bold">
                                    <span>{burn.category}</span>
                                    <span className="text-[var(--color-yellow)]">-{burn.reduction}%</span>
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono">Baseline: {toCurrency(burn.baseline)} • Mission: reduce {burn.category} by {burn.reduction}%</div>
                                <div className="h-2 bg-gray-900 mt-2">
                                    <div className="h-full bg-[var(--color-red)]" style={{ width: `${burn.reduction}%` }} />
                                </div>
                            </div>
                        ))}
                        {strategicState.burnRateTargets.length === 0 && <div className="text-xs text-gray-500">No burn missions defined.</div>}
                    </div>
                    {canEdit && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <input className="bg-black border border-gray-700 text-xs text-white p-2" placeholder="Category" value={formState.burn.category} onChange={(e) => setFormState((prev) => ({ ...prev, burn: { ...prev.burn, category: e.target.value } }))} />
                            <input className="bg-black border border-gray-700 text-xs text-white p-2" placeholder="% Reduction" type="number" value={formState.burn.reduction} onChange={(e) => setFormState((prev) => ({ ...prev, burn: { ...prev.burn, reduction: Number(e.target.value) } }))} />
                            <input className="bg-black border border-gray-700 text-xs text-white p-2" placeholder="Baseline Spend" type="number" value={formState.burn.baseline} onChange={(e) => setFormState((prev) => ({ ...prev, burn: { ...prev.burn, baseline: Number(e.target.value) } }))} />
                        </div>
                    )}
                </div>
            </div>

            {/* Exit Strategy Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles size={14} className="text-[var(--color-yellow)]" /> LIFE_PATH_SIM (FIRE)
                        </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-white mb-3">
                        {['currentBalance', 'monthlyContribution', 'burnRate'].map((key) => (
                            <label key={key} className="flex flex-col gap-1">
                                <span className="text-gray-500">{key.toUpperCase()}</span>
                                <input
                                    type="number"
                                    className="bg-black border border-gray-700 p-2 text-white"
                                    value={strategicState.fireParams[key]}
                                    onChange={(e) => safeUpdate({ fireParams: { ...strategicState.fireParams, [key]: Number(e.target.value) } })}
                                />
                            </label>
                        ))}
                        <label className="flex flex-col gap-1">
                            <span className="text-gray-500">EXPECTED_RETURN (ANNUAL)</span>
                            <input
                                type="number"
                                step="0.01"
                                className="bg-black border border-gray-700 p-2 text-white"
                                value={strategicState.fireParams.expectedReturn}
                                onChange={(e) => safeUpdate({ fireParams: { ...strategicState.fireParams, expectedReturn: Number(e.target.value) } })}
                            />
                        </label>
                    </div>
                    <div className="text-xs text-gray-400 font-mono mb-2">
                        Time to FI: {Math.floor((fireProjection.months || 0) / 12)}y {Math.round((fireProjection.months || 0) % 12)}m
                    </div>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={fireChartData}>
                                <defs>
                                    <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={neonBlue} stopOpacity={0.6} />
                                        <stop offset="95%" stopColor={neonBlue} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="balance" stroke={neonBlue} fillOpacity={1} fill="url(#balanceFill)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)]/30 border border-gray-800 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Users size={14} className="text-[var(--color-blue)]" /> CREW_SYNC
                        </h4>
                        <div className="text-[10px] text-gray-500">Share % only (no raw numbers).</div>
                    </div>
                    <div className="bg-black/30 border border-gray-800 p-3 text-xs text-gray-300">
                        Accountability Runner: {strategicState.accountabilityRunner || 'Not assigned'}
                    </div>
                    <div className="flex gap-2 text-xs">
                        <input
                            className="bg-black border border-gray-700 p-2 text-white flex-1"
                            placeholder="Assign Runner (Partner/Friend)"
                            value={strategicState.accountabilityRunner || ''}
                            onChange={(e) => safeUpdate({ accountabilityRunner: e.target.value })}
                        />
                        <button className="px-3 py-1 bg-[var(--color-blue)]/20 text-[var(--color-blue)] border border-[var(--color-blue)] hover:bg-[var(--color-blue)] hover:text-black">UPDATE</button>
                    </div>

                    <div className="border-t border-gray-800 pt-3">
                        <h5 className="text-xs text-white font-bold mb-2 flex items-center gap-2"><Radio size={12} /> LEGACY_FUND</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs text-white">
                            {['currentTuition', 'years', 'annualInflation', 'expectedReturn'].map((key) => (
                                <label key={key} className="flex flex-col gap-1">
                                    <span className="text-gray-500">{key.toUpperCase()}</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="bg-black border border-gray-700 p-2 text-white"
                                        value={strategicState.legacyParams[key]}
                                        onChange={(e) => safeUpdate({ legacyParams: { ...strategicState.legacyParams, [key]: Number(e.target.value) } })}
                                    />
                                </label>
                            ))}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-2">
                            Future Cost: {toCurrency(legacyProjection.futureCost)} • Monthly Needed: {toCurrency(legacyProjection.monthlyContribution)}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
