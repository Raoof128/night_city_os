import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../utils/theme';

const BootScreen = ({ onComplete }) => {
    const [lines, setLines] = useState([]);

    useEffect(() => {
        const bootText = [
            "BIOS_REL_2077 // ARASAKA_KERNEL_V14",
            "OVERRIDING_SECURITY... [SUCCESS]",
            `INJECTING_COLOR_MATRIX... var(--color-yellow)`,
            "ESTABLISHING_NEURAL_LINK... DONE",
            "WAKE_UP_SAMURAI...",
            "USER: RAOUF"
        ];

        let delay = 0;
        bootText.forEach((line, i) => {
            delay += Math.random() * 600 + 200;
            setTimeout(() => {
                setLines(prev => [...prev, line]);
                if (i === bootText.length - 1) {
                    setTimeout(onComplete, 1200);
                }
            }, delay);
        });
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black font-mono p-10 z-[100] flex flex-col justify-end selection:bg-[var(--color-red)] selection:text-black">
            {/* Glitch Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 animate-pulse bg-red-900/20 mix-blend-overlay"></div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.1, repeat: 4, repeatType: "mirror" }}
                >
                    <div
                        className="text-6xl font-black tracking-tighter mb-2 glitch"
                        data-text="NIGHT_CITY_OS"
                        style={{ color: COLORS.YELLOW, textShadow: `4px 4px 0px ${COLORS.RED}` }}
                    >
                        NIGHT_CITY_OS
                    </div>
                </motion.div>
                <div className="h-2 w-64 bg-[var(--color-red)] mx-auto mt-4 overflow-hidden relative">
                    <motion.div
                        className="h-full bg-[var(--color-yellow)]"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "circIn" }}
                    />
                </div>
            </div>
            <div className="space-y-1 text-sm md:text-base font-bold">
                {lines.map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <span style={{ color: COLORS.RED }} className="mr-2">[{new Date().toLocaleTimeString()}]</span>
                        <span style={{ color: COLORS.BLUE }}>{line}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default BootScreen;
