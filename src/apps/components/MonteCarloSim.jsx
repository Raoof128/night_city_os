import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

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

export default MonteCarloSim;
