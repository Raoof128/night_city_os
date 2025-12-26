/**
 * Lightweight logger used across Night City OS.
 * Provides consistent prefixes and guards against undefined console environments.
 */
const logger = {
    info: (message, ...args) => {
        if (typeof console !== 'undefined') {
            console.info(`[NC/INFO] ${message}`, ...args);
        }
    },
    warn: (message, ...args) => {
        if (typeof console !== 'undefined') {
            console.warn(`[NC/WARN] ${message}`, ...args);
        }
    },
    error: (message, ...args) => {
        if (typeof console !== 'undefined') {
            console.error(`[NC/ERROR] ${message}`, ...args);
        }
    }
};

export default logger;
