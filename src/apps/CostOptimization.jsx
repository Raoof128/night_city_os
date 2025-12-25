import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Search, RefreshCw, Star, Bot } from 'lucide-react';

const OptimizationBot = ({ icon, title, description, actionText, onAction, busy, lastRunResult }) => {
    const Icon = icon;
    return (
        <div className={`bg-gray-900/50 p-4 border border-gray-800 rounded-lg transition-all duration-300 hover:border-[var(--color-blue)] ${busy ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-800 border-2 border-gray-700">
                    <Icon size={24} className="text-[var(--color-blue)]" />
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-white tracking-wider">{title}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">{description}</p>
                    {lastRunResult && (
                        <div className="mt-2 text-xs font-mono p-2 bg-black/50 border-l-2 border-[var(--color-blue)]">
                            <span className="font-bold text-[var(--color-blue)]">LAST_RUN:</span> <span className="text-gray-300">{lastRunResult}</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={onAction}
                    disabled={busy}
                    className="px-4 py-2 text-xs font-bold rounded-md transition-colors bg-[var(--color-blue)] text-white hover:bg-blue-400 disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    {actionText}
                </button>
            </div>
        </div>
    );
};


export default function CostOptimization({ data, onUpdateData, addNotification }) {

    const handleAction = (actionName, message) => {
        addNotification(message, 'info');
    };

    return (
        <div className="p-4 bg-transparent text-white h-full mt-8">
            <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-blue)]/50 pb-3">
                <Bot size={24} className="text-[var(--color-blue)]" />
                <h2 className="text-xl font-black tracking-tighter text-white">COST_OPTIMIZATION_BOTS</h2>
            </div>
            <div className="space-y-4">
                <OptimizationBot
                    icon={Layers}
                    title="Redundancy Detector"
                    description="Scans subscriptions for overlapping services (e.g., multiple music streaming apps)."
                    actionText="SCAN"
                    onAction={() => handleAction('Redundancy', 'SCANNING... Found redundant subscription: Spotify.')}
                    lastRunResult="Found overlap: Spotify & YouTube Music."
                />
                <OptimizationBot
                    icon={Search}
                    title="Better Rate Finder"
                    description="Checks if utilities (ISP, power) or insurance have better rates available in your area."
                    actionText="SEARCH"
                    onAction={() => handleAction('Rates', 'SEARCHING... Found cheaper ISP plan for -15 €$.')}
                    lastRunResult="Found cheaper ISP plan: -15 €$/month."
                />
                <OptimizationBot
                    icon={RefreshCw}
                    title="Refund Hunter"
                    description="Looks for price drops on recent purchases and automatically files for a refund."
                    actionText="HUNT"
                    onAction={() => handleAction('Refunds', 'HUNTING... No price drops detected this week.')}
                    lastRunResult="No price drops detected this week."
                />
                <OptimizationBot
                    icon={Star}
                    title="Cashback Maximizer"
                    description="Advises which credit card to use for a purchase to maximize rewards or cashback."
                    actionText="ADVISE"
                    onAction={() => handleAction('Cashback', 'ADVISING... Use Card B for 4% gas rewards.')}
                    lastRunResult="Advised Card B for 4% gas rewards."
                />
            </div>
        </div>
    );
}
