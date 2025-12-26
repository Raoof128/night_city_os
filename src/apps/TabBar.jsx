import Tabs from './Tabs';
import {
  PieChart,
  Wallet,
  TrendingUp,
  Target,
  BrainCircuit,
  Receipt,
  Settings,
  Bot,
  LineChart,
  Coins,
  Shield,
  Briefcase,
} from 'lucide-react';
const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: PieChart },
    { id: 'transactions', label: 'TRANSACTIONS', icon: Receipt },
    { id: 'assets', label: 'ASSETS', icon: Wallet },
    { id: 'investments', label: 'INVESTMENTS', icon: Coins },
    { id: 'spending', label: 'SPENDING', icon: TrendingUp },
    { id: 'forecasting', label: 'FORECASTING', icon: LineChart },
    { id: 'simulation', label: 'SIMULATION', icon: Target },
    { id: 'insights', label: 'AI_INSIGHTS', icon: BrainCircuit },
    { id: 'rules', label: 'RULES', icon: Settings },
    { id: 'agents', label: 'AGENTS', icon: Bot },
    { id: 'security', label: 'SECURITY', icon: Shield },
    { id: 'pro-tools', label: 'PRO_TOOLS', icon: Briefcase },
  ];

  return (
    <div className="flex bg-black border border-gray-800">
      {tabs.map((tab) => (
        <Tabs
          key={tab.id}
          active={activeTab === tab.id}
          label={tab.label}
          icon={tab.icon}
          onClick={() => setActiveTab(tab.id)}
        />
      ))}
    </div>
  );
};

export default TabBar;
