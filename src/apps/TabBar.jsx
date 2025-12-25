import Tabs from './Tabs';
import {
    PieChart,
    Wallet,
    TrendingUp,
    Target,
    BrainCircuit,
    Receipt,
    Settings,
    Bot
} from 'lucide-react';
const TabBar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'overview', label: 'OVERVIEW', icon: PieChart },
        { id: 'transactions', label: 'TRANSACTIONS', icon: Receipt },
        { id: 'assets', label: 'ASSETS', icon: Wallet },
        { id: 'analytics', label: 'ANALYTICS', icon: TrendingUp },
        { id: 'simulation', label: 'SIMULATION', icon: Target },
        { id: 'insights', label: 'AI_INSIGHTS', icon: BrainCircuit },
        { id: 'rules', label: 'RULES', icon: Settings },
        { id: 'agents', label: 'AGENTS', icon: Bot },
    ];

    return (
        <div className="flex bg-black border border-gray-800">
            {tabs.map(tab => (
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
