import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, TrendingUp, Scissors, FileText, Bot, AlertTriangle } from 'lucide-react';
import CostOptimization from './CostOptimization';
import { COLORS } from '../utils/theme';

const AgentCard = ({ icon, title, description, status, action, onAction, busy, requiresAttention }) => {
    const Icon = icon;
    const isRunning = status === 'RUNNING';

    return (
        <div className={`bg-black/80 p-4 border border-gray-800 rounded-lg relative overflow-hidden transition-all duration-300 ${isRunning ? 'border-[var(--color-yellow)] shadow-[0_0_15px_rgba(255,224,0,0.2)]' : 'hover:border-[var(--color-blue)]'} ${busy ? 'opacity-50' : ''}`}>
            {requiresAttention && (
                <div className="absolute top-2 right-2 text-[var(--color-red)] animate-pulse">
                    <AlertTriangle size={16} />
                </div>
            )}
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-900 border-2 ${isRunning ? 'border-[var(--color-yellow)]' : 'border-gray-700'}`}>
                    <Icon size={24} className={isRunning ? "text-[var(--color-yellow)] animate-pulse" : "text-[var(--color-blue)]"} />
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-white tracking-wider">{title}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">{description}</p>
                </div>
                <button
                    onClick={onAction}
                    disabled={busy}
                    className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${isRunning ? 'bg-[var(--color-red)] text-black' : 'bg-[var(--color-blue)] text-white hover:bg-blue-400'} disabled:bg-gray-700 disabled:cursor-not-allowed`}
                >
                    {action}
                </button>
            </div>
            {isRunning && (
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-yellow)]/20 overflow-hidden">
                    <motion.div
                        className="h-full bg-[var(--color-yellow)]"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            )}
        </div>
    );
};


export default function FinancialAgents({ data, onUpdateData, addNotification }) {
    const [agentStatus, setAgentStatus] = useState({
        bills: 'IDLE',
        negotiate: 'IDLE',
        debt: 'IDLE',
        portfolio: 'IDLE',
        subs: 'IDLE',
    });
    const [isProcessing, setIsProcessing] = useState(false);

    // --- AGENT LOGIC (MOCKED) ---

    const runAgent = (agentName) => {
        setIsProcessing(true);
        setAgentStatus(prev => ({ ...prev, [agentName]: 'RUNNING' }));

        setTimeout(() => {
            // Mock logic for each agent
            if (agentName === 'bills') {
                const billToPay = data.upcomingBills[0];
                if (billToPay) {
                    const upcomingBills = data.upcomingBills.slice(1);
                    onUpdateData({ ...data, upcomingBills, balance: data.balance - billToPay.amount });
                    addNotification(`PAID: ${billToPay.name} for ${billToPay.amount}`, 'success');
                }
            }
             if (agentName === 'negotiate') {
                const billToNegotiate = data.upcomingBills[0];
                 if(billToNegotiate) {
                    const negotiatedBills = data.upcomingBills.map((b, i) => i === 0 ? {...b, amount: b.amount * 0.9} : b);
                    onUpdateData({ ...data, upcomingBills: negotiatedBills });
                    addNotification(`Negotiated ${billToNegotiate.name} down by 10%`, 'success');
                 }
            }
            if (agentName === 'debt') {
                 const debtToPay = data.debts[0];
                 if (debtToPay) {
                    const paidDebt = data.debts.map((d, i) => i === 0 ? {...d, amount: d.amount * 0.95} : d);
                    onUpdateData({ ...data, debts: paidDebt, balance: data.balance - (debtToPay.amount * 0.05) });
                    addNotification(`Paid down ${debtToPay.name} by 5%`, 'success');
                 }
            }
            if (agentName === 'portfolio') {
                onUpdateData({ ...data, portfolio: {...data.portfolio, currentAllocation: data.portfolio.targetAllocation } });
                addNotification('Portfolio rebalanced to target allocation', 'success');
            }
             if (agentName === 'subs') {
                const subToCancel = data.subscriptions[data.subscriptions.length - 1];
                if (subToCancel) {
                    const remainingSubs = data.subscriptions.slice(0, data.subscriptions.length -1);
                    onUpdateData({ ...data, subscriptions: remainingSubs });
                    addNotification(`Cancelled subscription: ${subToCancel.service}`, 'success');
                }
            }

            setAgentStatus(prev => ({ ...prev, [agentName]: 'IDLE' }));
            setIsProcessing(false);
        }, 2500); // Simulate network/processing delay
    };


    const isPortfolioMisaligned = () => {
        const { targetAllocation, currentAllocation } = data.portfolio;
        return Math.abs(targetAllocation.stocks - currentAllocation.stocks) > 0.01;
    }


    return (
        <div className="p-4 bg-black/50 text-white h-full overflow-y-auto">
             <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-red)]/50 pb-3">
                <Bot size={24} className="text-[var(--color-red)]" />
                <h2 className="text-xl font-black tracking-tighter text-white">AGENTIC_AI_LAYER</h2>
            </div>

            <div className="space-y-4">
                 <AgentCard
                    icon={Zap}
                    title="Autonomous Bill Pay"
                    description="Automatically pays upcoming bills from your main balance before the due date."
                    status={agentStatus.bills}
                    action={agentStatus.bills === 'RUNNING' ? 'EXECUTING' : 'PAY_NEXT'}
                    onAction={() => runAgent('bills')}
                    busy={isProcessing || data.upcomingBills.length === 0}
                />
                 <AgentCard
                    icon={ShieldCheck}
                    title="Bill Negotiation Bot"
                    description="Scans for bills (ISP, Phone) and attempts to negotiate a lower rate. (Success not guaranteed)"
                    status={agentStatus.negotiate}
                    action={agentStatus.negotiate === 'RUNNING' ? 'NEGOTIATING' : 'LOWER_BILLS'}
                    onAction={() => runAgent('negotiate')}
                    busy={isProcessing || data.upcomingBills.length === 0}
                />
                 <AgentCard
                    icon={TrendingUp}
                    title="Debt Payoff Strategy"
                    description="Uses the 'Avalanche' method to allocate extra funds towards high-interest debts."
                    status={agentStatus.debt}
                    action={agentStatus.debt === 'RUNNING' ? 'ALLOCATING' : 'PAY_DOWN'}
                    onAction={() => runAgent('debt')}
                    busy={isProcessing || data.debts.length === 0}
                />
                 <AgentCard
                    icon={FileText}
                    title="Portfolio Rebalancing"
                    description="Monitors asset allocation and automatically rebalances to match your target."
                    status={agentStatus.portfolio}
                    action={agentStatus.portfolio === 'RUNNING' ? 'REBALANCING' : 'ALIGN_NOW'}
                    onAction={() => runAgent('portfolio')}
                    busy={isProcessing || !isPortfolioMisaligned()}
                    requiresAttention={isPortfolioMisaligned()}
                />
                 <AgentCard
                    icon={Scissors}
                    title="Subscription Cancellation"
                    description="Identifies and cancels unused or redundant monthly subscriptions."
                    status={agentStatus.subs}
                    action={agentStatus.subs === 'RUNNING' ? 'CANCELLING' : 'CUT_SUBS'}
                    onAction={() => runAgent('subs')}
                    busy={isProcessing || data.subscriptions.length === 0}
                />
            </div>

            <CostOptimization data={data} onUpdateData={onUpdateData} addNotification={addNotification} />
        </div>
    );
}
