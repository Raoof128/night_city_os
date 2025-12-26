import { useEffect, useRef } from 'react';
import { ActivitySquare } from 'lucide-react';

const drawWave = (ctx, time, color) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const noise = Math.sin((x + time) * 0.05) * 20;
        const jitter = (Math.random() - 0.5) * 8;
        const y = height / 2 + noise + jitter;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
};

export default function SysMon() {
    const memRef = useRef(null);
    const netRef = useRef(null);

    useEffect(() => {
        let frame;
        const ctxMem = memRef.current?.getContext('2d');
        const ctxNet = netRef.current?.getContext('2d');
        let tick = 0;

        const loop = () => {
            tick += 4;
            if (ctxMem) drawWave(ctxMem, tick, '#FCEE0A');
            if (ctxNet) drawWave(ctxNet, tick * 1.3, '#FF003C');
            frame = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="h-full bg-black/70 text-white p-3 font-mono">
            <div className="flex items-center gap-2 mb-3 text-[var(--color-yellow)]">
                <ActivitySquare size={16} /> <span className="text-xs tracking-[0.2em]">SYS_MON</span>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Memory Flux</div>
                    <canvas ref={memRef} width={500} height={120} className="w-full bg-black border border-[var(--color-yellow)] shadow-[0_0_12px_rgba(252,238,10,0.2)]" />
                </div>
                <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Net Traffic</div>
                    <canvas ref={netRef} width={500} height={120} className="w-full bg-black border border-[var(--color-red)] shadow-[0_0_12px_rgba(255,0,60,0.2)]" />
                </div>
            </div>
        </div>
    );
}
