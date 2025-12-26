import { motion } from 'framer-motion';

const DonutChart = ({ data }) => {
    // Simple SVG Donut Chart
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let currentAngle = 0;

    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                {data.map((slice, i) => {
                    const percentage = slice.value / total;
                    const angle = percentage * 360;
                    const radius = 40;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDasharray = `${(percentage * circumference)} ${circumference}`;

                    const el = (
                        <motion.circle
                            key={i}
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke={slice.color}
                            strokeWidth="10"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={0}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            style={{ transformOrigin: 'center', transform: `rotate(${currentAngle}deg)` }}
                        />
                    );
                    currentAngle += angle;
                    return el;
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-500 font-bold">TOTAL</span>
                <span className="text-xl font-black text-white">{total.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default DonutChart;
