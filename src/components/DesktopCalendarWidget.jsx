import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { COLORS } from '../utils/theme';
import DraggableItem from './DraggableItem';

const getPersianDate = () => {
    try {
        return new Intl.DateTimeFormat('fa-IR', {
            calendar: 'persian',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date());
    } catch (e) {
        return new Date().toLocaleDateString();
    }
};

const DesktopCalendarWidget = ({ constraintsRef }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const gregDate = time.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const gregTime = time.toLocaleTimeString('en-US', { hour12: false });
    const persianDate = getPersianDate();

    return (
        <DraggableItem initialX="auto" initialY="240px" className="right-10 w-64" constraintsRef={constraintsRef}>
            <div className="bg-black/60 backdrop-blur-sm border border-red-900/50 p-4 relative overflow-hidden rounded-lg hover:border-red-500 transition-colors">
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--color-yellow)]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--color-yellow)]" />

                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-[var(--color-red)] tracking-widest">SYNC_CHRONO</span>
                    <span className="text-xs text-gray-500 animate-pulse">● LIVE</span>
                </div>

                <div className="flex items-end gap-2 mb-2">
                    <Clock size={24} className="text-black mb-1 bg-[var(--color-yellow)] rounded-full p-0.5" />
                    <span className="text-4xl font-black text-white tracking-tighter" style={{ textShadow: `2px 2px 0px ${COLORS.RED}` }}>{gregTime}</span>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-1">
                        <span className="text-xs text-[var(--color-blue)] font-bold">GREGORIAN</span>
                        <span className="text-sm font-mono text-gray-300">{gregDate}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-[var(--color-yellow)] font-bold">SOLAR HIJRI</span>
                        <span className="text-sm font-bold text-white font-sans">{persianDate}</span>
                    </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-red)]/20 animate-scanline" style={{ animationDuration: '3s' }} />
            </div>
        </DraggableItem>
    );
};

export default DesktopCalendarWidget;
