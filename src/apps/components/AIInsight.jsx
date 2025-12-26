import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles } from 'lucide-react';

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

export default AIInsight;
