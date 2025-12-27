import { useRef, useState } from 'react';
import { useOS } from '../hooks/useOS';
import DraggableItem from '../../components/DraggableItem';
import DesktopCalendarWidget from '../../components/DesktopCalendarWidget';
import ContextMenu from '../../components/ContextMenu';
import WallpaperEngine from './WallpaperEngine';
import { COLORS } from '../../utils/theme';
// Import Icons
import {
    HardDrive, Activity, Grid, Terminal, Share2,
    FileEdit, Bell, Settings, Cpu, Code2, ShieldCheck, Monitor
} from 'lucide-react';

const ICON_MAP = {
    tracker: Activity,
    files: HardDrive,
    terminal: Terminal,
    network: Share2,
    textpad: FileEdit,
    calc: Grid,
    music: Bell,
    settings: Settings,
    construct: Cpu,
    icebreaker: Code2,
    sysmon: Monitor,
    vault: ShieldCheck
};

const withAlpha = (hex, alpha) => {
    const raw = hex.replace('#', '');
    const bigint = parseInt(raw, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const DesktopBackdrop = ({ theme }) => {
    const wallpaperStyle = theme.wallpaper === 'void'
        ? { backgroundImage: `radial-gradient(circle at 20% 20%, ${COLORS.VOID} 0, ${COLORS.VOID} 50%)`, backgroundSize: '80px 80px', backgroundColor: COLORS.VOID }
        : { backgroundImage: "url('/os_background.jpg')", backgroundSize: theme.bgFit || 'cover' }

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-center transition-all duration-500" style={wallpaperStyle} />
            <div className="absolute inset-0" style={{ backgroundColor: withAlpha(COLORS.VOID, 0.4) }} />

            {/* Visual Effects */}
            <div className="absolute inset-0 z-[100] opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, ${withAlpha(COLORS.RED, 0.12)}, ${withAlpha(COLORS.BLUE, 0.06)}, ${withAlpha(COLORS.BLUE, 0.12)})`,
                backgroundSize: '100% 2px, 3px 100%'
            }} />
            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${COLORS.GRID} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.GRID} 1px, transparent 1px)`, backgroundSize: '50px 50px', opacity: 0.15 }} />

            <div className="absolute top-0 right-0 w-1/2 h-full" style={{ background: `linear-gradient(90deg, ${withAlpha(COLORS.RED, 0.2)} 0%, transparent 70%)` }} />
            <div className="absolute bottom-0 left-0 w-full h-1/3" style={{ background: `linear-gradient(0deg, ${withAlpha(COLORS.BLUE, 0.1)} 0%, transparent 80%)` }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-white/5 select-none pointer-events-none whitespace-nowrap z-0 glitch mix-blend-overlay" data-text="NIGHT CITY">NIGHT CITY</div>
        </div>
    );
};

const Desktop = () => {
    const { state, actions } = useOS();
    const { desktopIcons, theme } = state;
    const desktopRef = useRef(null);
    const [contextMenu, setContextMenu] = useState(null);

    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleCloseContextMenu = () => setContextMenu(null);

    return (
        <div
            ref={desktopRef}
            className={`absolute inset-0 w-full h-full overflow-hidden transition-all duration-500 ${state.flags.multiMonitor ? 'scale-[0.8] origin-center ring-4 ring-white/10' : ''}`}
            onContextMenu={handleContextMenu}
            onClick={handleCloseContextMenu}
        >
            <DesktopBackdrop theme={theme} />
            <WallpaperEngine />

            {state.flags.multiMonitor && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-[var(--color-yellow)] px-4 py-1 text-[10px] font-bold z-[1000] rounded-full">
                    SIMULATED_MULTI_DISPLAY_ENV // PRIMARY
                </div>
            )}

            {/* Icons */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={handleCloseContextMenu}
                    onReset={actions.resetState}
                />
            )}

            {/* Icons */}
            <div className="relative z-10 w-full h-full p-6 pb-20">
                {desktopIcons.map((item) => {
                    const IconComp = ICON_MAP[item.id] || Activity;
                    return (
                        <DraggableItem
                            key={item.id}
                            initialX={item.x + 'px'}
                            initialY={item.y + 'px'}
                            className="w-24"
                            constraintsRef={desktopRef}
                        >
                            <button
                                onDoubleClick={() => actions.openWindow(item.id, item.id, {}, item.label)}
                                className="group flex flex-col items-center gap-2 focus:outline-none w-full"
                            >
                                <div className="w-16 h-16 bg-black/40 backdrop-blur-sm border border-gray-600 rounded-xl flex items-center justify-center group-hover:bg-[var(--color-yellow)] group-hover:border-[var(--color-yellow)] transition-all duration-200 shadow-lg group-hover:shadow-[0_0_20px_rgba(255,224,0,0.4)] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 skew-x-12 translate-x-full group-hover:animate-shine pointer-events-none" />
                                    <IconComp size={30} className="text-[var(--color-blue)] group-hover:text-black transition-colors" />
                                </div>
                                <span className="text-xs font-bold tracking-widest bg-black/80 px-2 py-0.5 rounded text-gray-300 group-hover:text-[var(--color-yellow)] shadow-sm">
                                    {(item.label || item.id).toUpperCase()}
                                </span>
                            </button>
                        </DraggableItem>
                    );
                })}

                <DesktopCalendarWidget constraintsRef={desktopRef} />
            </div>
        </div>
    );
};

export default Desktop;
