import { motion } from 'framer-motion';
import {
  Landmark,
  Coins,
  Home,
  Diamond,
  ChevronUp,
  ChevronDown,
  PieChart,
  Calendar,
  Sliders,
  Activity,
  Shield,
  Wallet,
  Link,
  Image,
  Fuel,
} from 'lucide-react';

// --- Reusable Components ---
const Section = ({ title, children, gridCols = 'lg:grid-cols-4' }) => (
  <div>
    <h3 className="text-sm font-bold text-white border-b border-[var(--color-blue)]/30 pb-2 mb-4 tracking-widest">
      {title}
    </h3>
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-4`}>{children}</div>
  </div>
);

const AssetCard = ({ icon: Icon, title, value, change, changeType }) => (
  <div className="bg-gray-900/50 p-4 border border-gray-800 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-[var(--color-yellow)]" />
        <h4 className="text-xs font-bold text-gray-500 tracking-wider uppercase">{title}</h4>
      </div>
      <div
        className={`flex items-center text-xs font-mono ${changeType === 'gain' ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'}`}
      >
        {changeType === 'gain' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {change}
      </div>
    </div>
    <div className="text-2xl font-black text-white tracking-tight">{value}</div>
  </div>
);

const AnalyticsInfoCard = ({ icon: Icon, title, value, subtext }) => (
  <div className="bg-gray-900/50 p-4 border border-gray-800 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={16} className="text-[var(--color-blue)]" />
      <h4 className="text-xs font-bold text-gray-500 tracking-wider uppercase">{title}</h4>
    </div>
    <div className="text-xl font-black text-white tracking-tight">{value}</div>
    {subtext && <div className="text-xs font-mono text-gray-400 mt-1">{subtext}</div>}
  </div>
);

export default function Investments() {
  return (
    <motion.div
      key="investments"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-black text-[var(--color-yellow)] tracking-tighter">
        THE_NETRUNNER_SPEC // INVESTMENTS & CRYPTO
      </h2>

      {/* Multi-Asset Portfolio Tracking */}
      <Section title="MULTI-ASSET_PORTFOLIO_TRACKING">
        <AssetCard
          icon={Landmark}
          title="Stocks & ETFs"
          value="125,430.50 €$"
          change="+1.25%"
          changeType="gain"
        />
        <AssetCard
          icon={Coins}
          title="Cryptocurrency"
          value="58,770.89 €$"
          change="-3.40%"
          changeType="loss"
        />
        <AssetCard
          icon={Home}
          title="Real Estate"
          value="450,000.00 €$"
          change="+0.80%"
          changeType="gain"
        />
        <AssetCard
          icon={Diamond}
          title="Alternative Assets"
          value="78,200.00 €$"
          change="+5.10%"
          changeType="gain"
        />
      </Section>

      {/* Portfolio Analytics */}
      <Section title="PORTFOLIO_ANALYTICS" gridCols="lg:grid-cols-5">
        <AnalyticsInfoCard
          icon={PieChart}
          title="Cost Basis"
          value="580,140.22 €$"
          subtext="Unrealized: +132,261.17 €$"
        />
        <AnalyticsInfoCard
          icon={Sliders}
          title="Asset Allocation"
          value="60/30/10"
          subtext="Stocks/Crypto/Other"
        />
        <AnalyticsInfoCard
          icon={Calendar}
          title="Dividend Calendar"
          value="+1,200 €$ (Q4)"
          subtext="Next Payout: VZ (Dec 1)"
        />
        <AnalyticsInfoCard
          icon={Activity}
          title="Performance"
          value="TSLA: +23.4%"
          subtext="Top Mover"
        />
        <AnalyticsInfoCard
          icon={Shield}
          title="Sharpe Ratio"
          value="1.87"
          subtext="Risk-Adjusted Return"
        />
      </Section>

      {/* Crypto-Specific Features */}
      <Section title="CRYPTO-SPECIFIC_FEATURES">
        <AnalyticsInfoCard
          icon={Wallet}
          title="Wallet Watch"
          value="3 Wallets"
          subtext="ETH / SOL / BTC"
        />
        <AnalyticsInfoCard
          icon={Link}
          title="DeFi Positions"
          value="12,450 €$"
          subtext="AAVE / UNISWAP"
        />
        <AnalyticsInfoCard
          icon={Image}
          title="NFT Portfolio"
          value="8.5 ETH"
          subtext="Floor Price: 6.2 ETH"
        />
        <AnalyticsInfoCard
          icon={Fuel}
          title="Gas Fee Optimizer"
          value="18 Gwei"
          subtext="Optimal time: 15 mins"
        />
      </Section>
    </motion.div>
  );
}
