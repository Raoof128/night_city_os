import { EventEmitter } from 'events';
import logger from '../../utils/logger';

class SystemBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
    }

    /**
     * Publish a system event
     * @param {string} channel - e.g. 'sys:boot', 'win:focus'
     * @param {any} payload 
     */
    emit(channel, payload) {
        // Log critical events
        if (channel.startsWith('err:') || channel.startsWith('sys:')) {
            logger.info(`[BUS] ${channel}`, payload);
        }
        super.emit(channel, payload);
    }

    /**
     * Subscribe to a channel
     * @param {string} channel 
     * @param {Function} handler 
     */
    on(channel, handler) {
        super.on(channel, handler);
        return () => super.off(channel, handler);
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
