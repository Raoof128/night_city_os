import { motion } from 'framer-motion';
import {
  TrendingUp,
  Gauge,
  Flame,
  PiggyBank,
  BarChart,
  AreaChart,
  Map,
  GanttChartSquare,
  AlertTriangle,
  GitCommit,
} from 'lucide-react';

// --- Reusable Components ---
const AnalyticsCard = ({ icon: Icon, title, value, subtext, color, children }) => (
  <div className="bg-gray-900/50 p-4 border border-gray-800 rounded-lg h-full flex flex-col">
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-xs font-bold text-gray-500 tracking-wider uppercase">{title}</h4>
      <Icon size={16} className={color} />
    </div>
    {value && <div className="text-2xl font-black text-white tracking-tight mb-1">{value}</div>}
    {subtext && <div className="text-xs font-mono text-gray-400">{subtext}</div>}
    {children && <div className="flex-1 mt-2">{children}</div>}
  </div>
);

// --- Financial Health Components ---

const HealthScoreGauge = ({ score }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  let colorClass = 'text-[var(--color-green)]';
  if (score < 40) colorClass = 'text-[var(--color-red)]';
  else if (score < 70) colorClass = 'text-[var(--color-yellow)]';

  return (
    <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-gray-800"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <motion.circle
          className={colorClass}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
      </svg>
      <div className={`absolute text-3xl font-black ${colorClass}`}>{score}</div>
    </div>
  );
};

const NetWorthWaterfall = () => {
  const data = [
    { label: 'CASH', value: 75000, type: 'asset' },
    { label: 'INVEST', value: 120000, type: 'asset' },
    { label: 'ASSETS', value: 45000, type: 'asset' },
    { label: 'LOANS', value: -30000, type: 'liability' },
    { label: 'CREDIT', value: -15000, type: 'liability' },
  ];
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center justify-between text-xs font-mono">
          <span className="text-gray-400">{item.label}</span>
          <span
            className={
              item.type === 'asset' ? 'text-[var(--color-blue)]' : 'text-[var(--color-red)]'
            }
          >
            {item.value.toLocaleString()} €$
          </span>
        </div>
      ))}
      <div className="border-t border-dashed border-gray-700 pt-2 flex items-center justify-between text-sm font-bold">
        <span className="text-white">NET WORTH</span>
        <span className="text-[var(--color-yellow)]">{total.toLocaleString()} €$</span>
      </div>
    </div>
  );
};

// --- Predictive Intelligence Components ---
const CashFlowChart = () => {
  const data = [30, 40, 45, 50, 49, 60, 70, 91, 125]; // Normalized height percentages
  return (
    <div className="w-full h-full flex items-end justify-between gap-1 px-2">
      {data.map((height, i) => (
        <motion.div
          key={i}
          className="w-full bg-[var(--color-blue)] opacity-50 rounded-t"
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
};

const ExpenseTrendChart = () => {
  return (
    <div className="text-center text-white p-4">
      <div className="flex items-center justify-center gap-2">
        <AlertTriangle size={16} className="text-[var(--color-red)]" />
        <span className="font-bold">ALERT</span>
      </div>
      <p className="text-sm text-gray-400 mt-2 font-mono">
        &quot;Night Market&quot; spending up{' '}
        <span className="text-[var(--color-red)] font-bold">23%</span> in Q4.
        <br />
        Possible lifestyle creep detected.
      </p>
    </div>
  );
};

// --- Visualization Arsenal Components ---
const SankeyPlaceholder = () => (
  <div className="h-full flex flex-col justify-center items-center text-gray-500">
    <GitCommit size={32} className="transform -rotate-90" />
    <span className="text-xs font-mono mt-2">Sankey Diagram Placeholder</span>
  </div>
);

const HeatmapPlaceholder = () => (
  <div className="h-full grid grid-cols-7 grid-rows-4 gap-1">
    {Array.from({ length: 28 }).map((_, i) => (
      <div
        key={i}
        className="rounded-sm"
        style={{
          backgroundColor: `rgba(255, 0, 0, ${Math.random() * 0.6})`,
          opacity: 0.5 + Math.random() * 0.5,
        }}
      />
    ))}
  </div>
);

export default function Forecasting() {
  return (
    <motion.div
      key="forecasting"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-black text-[var(--color-yellow)] tracking-tighter">
        ADVANCED_ANALYTICS & FORECASTING
      </h2>

      {/* Financial Health Tracking */}
      <div>
        <h3 className="text-sm font-bold text-white border-b border-[var(--color-blue)]/30 pb-2 mb-4 tracking-widest">
          FINANCIAL_HEALTH_TRACKING
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard
            icon={TrendingUp}
            title="Net Worth Waterfall"
            color="text-[var(--color-yellow)]"
          >
            <NetWorthWaterfall />
          </AnalyticsCard>
          <AnalyticsCard
            icon={Gauge}
            title="Financial Health Score"
            color="text-[var(--color-blue)]"
          >
            <HealthScoreGauge score={78} />
          </AnalyticsCard>
          <AnalyticsCard
            icon={Flame}
            title="Burn Rate & Runway"
            value="9,800 €$/mo"
            subtext="12.7 months runway"
            color="text-[var(--color-red)]"
          />
          <AnalyticsCard
            icon={PiggyBank}
            title="Savings Rate"
            value="22%"
            subtext="vs 15% target"
            color="text-[var(--color-green)]"
          />
        </div>
      </div>

      {/* Predictive Intelligence */}
      <div>
        <h3 className="text-sm font-bold text-white border-b border-[var(--color-blue)]/30 pb-2 mb-4 tracking-widest">
          PREDICTIVE_INTELLIGENCE
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnalyticsCard
            icon={BarChart}
            title="Cash Flow Forecasting (6 mo)"
            color="text-[var(--color-blue)]"
            subtext="Projection based on historical patterns"
          >
            <CashFlowChart />
          </AnalyticsCard>
          <AnalyticsCard
            icon={GanttChartSquare}
            title="Monte Carlo Simulations"
            color="text-[var(--color-yellow)]"
            subtext="Test market shock scenarios"
          >
            <div className="text-center text-gray-500 text-sm pt-4">WHAT_IF_CONTROLS</div>
          </AnalyticsCard>
          <AnalyticsCard
            icon={AreaChart}
            title="Income Volatility"
            color="text-[var(--color-green)]"
            subtext="Lean month prediction for freelancers"
          >
            <div className="text-center text-gray-500 text-sm pt-4">VOLATILITY_WAVEFORM</div>
          </AnalyticsCard>
          <AnalyticsCard
            icon={TrendingUp}
            title="Expense Trend Detection"
            color="text-[var(--color-red)]"
          >
            <ExpenseTrendChart />
          </AnalyticsCard>
        </div>
      </div>

      {/* Visualization Arsenal */}
      <div>
        <h3 className="text-sm font-bold text-white border-b border-[var(--color-blue)]/30 pb-2 mb-4 tracking-widest">
          VISUALIZATION_ARSENAL
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnalyticsCard
            icon={GitCommit}
            title="Cash Flow Sankey"
            color="text-[var(--color-yellow)]"
          >
            <SankeyPlaceholder />
          </AnalyticsCard>
          <AnalyticsCard
            icon={AreaChart}
            title="Net Worth Area Chart"
            color="text-[var(--color-green)]"
          >
            <div className="text-center text-gray-500 text-sm pt-4">AREA_CHART</div>
          </AnalyticsCard>
          <AnalyticsCard icon={Map} title="Spending Heatmap" color="text-[var(--color-red)]">
            <HeatmapPlaceholder />
          </AnalyticsCard>
          <AnalyticsCard icon={BarChart} title="Budget vs Actual" color="text-[var(--color-blue)]">
            <div className="text-center text-gray-500 text-sm pt-4">VARIANCE_CHART</div>
          </AnalyticsCard>
        </div>
      </div>
    </motion.div>
  );
}
