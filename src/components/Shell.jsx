import { useEffect } from 'react';
import { useOS } from '../os/hooks/useOS';
import BootScreen from './BootScreen';
import ShutdownScreen from './ShutdownScreen';
import WindowFrame from './WindowFrame';
import Desktop from '../os/components/Desktop';
import Taskbar from '../os/components/Taskbar';

// Apps import
import FinancialTracker from '../apps/FinancialTracker';
import TerminalApp from '../apps/Terminal';
import CalculatorApp from '../apps/Calculator';
import SettingsApp from '../apps/Settings';
import IcebreakerApp from '../apps/Icebreaker';
import ConstructApp from '../apps/Construct';
import SysMon from '../apps/SysMon';
import MusicPlayerApp from '../apps/MusicPlayer';
import NetworkMapApp from '../apps/NetworkMap';
import TextPadApp from '../apps/TextPad';
import VaultApp from '../apps/Vault';

const APP_REGISTRY = {
    'tracker': { component: FinancialTracker },
    'terminal': { component: TerminalApp },
    'calc': { component: CalculatorApp },
    'settings': { component: SettingsApp },
    'icebreaker': { component: IcebreakerApp },
    'construct': { component: ConstructApp },
    'sysmon': { component: SysMon },
    'music': { component: MusicPlayerApp },
    'network': { component: NetworkMapApp },
    'textpad': { component: TextPadApp },
    'vault': { component: VaultApp },
    // System fallbacks
    'default': { component: () => <div className="p-4 text-white">APP_NOT_FOUND</div> }
};

const Shell = () => {
    const { state, actions } = useOS();
    const { bootState, windows, activeWindowId } = state;

    useEffect(() => {
        // Auto-boot if off
        if (bootState === 'off') {
            actions.boot();
        }
    }, [bootState, actions]);

    if (bootState === 'booting') {
        return <BootScreen onComplete={actions.login} />;
    }

    if (bootState === 'shutdown') {
        return <ShutdownScreen onReboot={actions.reboot} />;
    }

    if (bootState === 'desktop') {
        return (
            <div className="relative w-screen h-screen overflow-hidden bg-black" onContextMenu={(e) => e.preventDefault()}>
                <Desktop />

                {/* Window Layer */}
                {windows.map(win => {
                    const App = (APP_REGISTRY[win.type] || APP_REGISTRY['default']).component;
                    return (
                        <WindowFrame
                            key={win.id}
                            item={win}
                            isActive={activeWindowId === win.id}
                            zIndex={win.zIndex}
                            onFocus={() => actions.focusWindow(win.id)}
                            onClose={() => actions.closeWindow(win.id)}
                            onMinimize={() => actions.minimizeWindow(win.id)}
                            onMaximize={() => actions.maximizeWindow(win.id)}
                            onMove={actions.moveWindow}
                            onResize={actions.resizeWindow}
                        >
                            <App data={win.data} config={state.theme} onUpdateConfig={() => { }} auditLog={[]} />
                        </WindowFrame>
                    );
                })}

                <Taskbar />
            </div>
        );
    }

    return <div className="bg-black text-white p-10">SYSTEM_HALTED</div>;
};

export default Shell;
