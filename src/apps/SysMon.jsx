import { useEffect, useRef } from 'react';
import { ActivitySquare, X } from 'lucide-react';
import { useApp } from '../os/kernel/AppContext';

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
    const { system, closeWindow } = useApp();
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
        <div className="h-full bg-black/90 text-white p-4 font-mono flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-[var(--color-yellow)]">
                <ActivitySquare size={16} /> <span className="text-xs tracking-[0.2em] font-bold">SYSTEM_MONITOR_V5</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Memory Flux</div>
                    <canvas ref={memRef} width={300} height={80} className="w-full bg-black border border-[var(--color-yellow)]" />
                </div>
                <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Net Traffic</div>
                    <canvas ref={netRef} width={300} height={80} className="w-full bg-black border border-[var(--color-red)]" />
                </div>
            </div>

            <div className="flex-1 overflow-hidden border border-white/10 rounded">
                <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-[var(--color-blue)]">
                        <tr>
                            <th className="p-2">PID</th>
                            <th className="p-2">NAME</th>
                            <th className="p-2">STATUS</th>
                            <th className="p-2 text-right">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {system.windows.map(win => (
                            <tr key={win.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-2 font-mono text-gray-500">{win.id.slice(0, 8)}</td>
                                <td className="p-2 font-bold">{win.title}</td>
                                <td className="p-2">
                                    <span className={`px-1.5 py-0.5 rounded ${win.minimized ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                        {win.minimized ? 'SUSPENDED' : 'RUNNING'}
                                    </span>
                                </td>
                                <td className="p-2 text-right">
                                    <button 
                                        onClick={() => closeWindow(win.id)}
                                        className="text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors"
                                        title="Kill Process"
                                    >
                                        <X size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}