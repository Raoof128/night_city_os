import { Component } from 'react';
import { AlertTriangle, Power, RefreshCw } from 'lucide-react';
import { EventBus, EVENTS } from '../kernel/eventBus';

export class GlobalErrorFallback extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("OS CRASHED:", error, errorInfo);
        try {
            EventBus.emit(EVENTS.SYS_ERROR, { error: error.message, stack: errorInfo.componentStack });
        } catch (e) {
            // Failsafe
        }
    }

    handleRestart = () => {
        window.location.reload();
    };

    handleHardReset = () => {
        localStorage.clear();
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-screen h-screen bg-black text-[var(--color-red)] flex flex-col items-center justify-center p-8 font-mono z-[9999] relative overflow-hidden selection:bg-[var(--color-yellow)] selection:text-black">
                    <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255, 0, 60, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 60, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                    <div className="max-w-2xl border-4 border-[var(--color-red)] p-8 bg-black/90 backdrop-blur relative shadow-[0_0_50px_rgba(255,0,60,0.4)]">
                        <div className="absolute top-0 left-0 bg-[var(--color-red)] text-black font-black px-4 py-1">SYSTEM_FAILURE</div>

                        <div className="flex items-center gap-4 mb-6 mt-8">
                            <AlertTriangle size={48} />
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter">FATAL ERROR</h1>
                                <p className="text-sm opacity-80">KERNEL PANIC // UNRECOVERABLE STATE</p>
                            </div>
                        </div>

                        <div className="bg-[var(--color-red)]/10 p-4 border border-[var(--color-red)]/30 font-mono text-sm mb-8 overflow-auto max-h-48 whitespace-pre-wrap">
                            {this.state.error?.toString()}
                            <br />
                            {this.state.errorInfo?.componentStack}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={this.handleRestart}
                                className="flex-1 bg-[var(--color-red)] text-black font-bold py-3 hover:bg-white transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} /> RESTART_OS
                            </button>

                            <button
                                onClick={this.handleHardReset}
                                className="border border-[var(--color-red)] text-[var(--color-red)] font-bold py-3 px-6 hover:bg-[var(--color-red)] hover:text-black transition-colors flex items-center justify-center gap-2"
                            >
                                <Power size={18} /> HARD_RESET
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
