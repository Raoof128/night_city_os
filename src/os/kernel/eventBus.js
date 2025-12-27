import logger from '../../utils/logger';

class SystemBus {
    constructor() {
        this.events = {};
        this.maxListeners = 50;
        this.history = [];
        this.MAX_HISTORY = 20;
    }

    setMaxListeners(n) {
        this.maxListeners = n;
    }

    emit(channel, payload) {
        // Log critical events
        if (channel.startsWith('err:') || channel.startsWith('sys:')) {
            logger.info(`[BUS] ${channel}`, payload);
        }
        
        // Add to history
        this.history.unshift({ channel, payload, timestamp: Date.now() });
        if (this.history.length > this.MAX_HISTORY) {
            this.history.pop();
        }
        
        if (!this.events[channel]) return;

        this.events[channel].forEach(handler => {
            try {
                handler(payload);
            } catch (e) {
                console.error(`Error in event handler for ${channel}:`, e);
            }
        });
    }

    getHistory() {
        return this.history;
    }

    on(channel, handler) {
        if (!this.events[channel]) {
            this.events[channel] = [];
        }
        this.events[channel].push(handler);
        return () => this.off(channel, handler);
    }

    off(channel, handler) {
        if (!this.events[channel]) return;
        this.events[channel] = this.events[channel].filter(h => h !== handler);
    }
}

export const EventBus = new SystemBus();

export const EVENTS = {
    // System
    SYS_BOOT: 'sys:boot',
    SYS_SHUTDOWN: 'sys:shutdown',
    SYS_RESTART: 'sys:restart',
    SYS_ERROR: 'sys:error',

    // Windows
    WIN_OPEN: 'win:open',
    WIN_CLOSE: 'win:close',
    WIN_FOCUS: 'win:focus',
    WIN_MINIMIZE: 'win:minimize',
    WIN_MAXIMIZE: 'win:maximize',

    // Filesystem
    FS_CHANGE: 'fs:change'
};

