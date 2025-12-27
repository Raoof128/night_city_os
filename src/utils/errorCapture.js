/**
 * Global Error Capture Utility
 * Capture console.error/warn + unhandledrejection + window.onerror
 */

const MAX_LOGS = 50;
let logs = [];

export const initErrorCapture = (onLog) => {
    const originalError = console.error;
    const originalWarn = console.warn;

    const addLog = (level, msg, data) => {
        const entry = {
            id: Date.now() + Math.random(),
            timestamp: Date.now(),
            level,
            message: msg,
            details: data ? JSON.stringify(data) : ''
        };
        logs.unshift(entry);
        if (logs.length > MAX_LOGS) logs.pop();
        if (onLog) onLog(entry);
    };

    console.error = (...args) => {
        addLog('error', args[0], args.slice(1));
        originalError.apply(console, args);
    };

    console.warn = (...args) => {
        addLog('warn', args[0], args.slice(1));
        originalWarn.apply(console, args);
    };

    window.onerror = (message, source, lineno, colno, error) => {
        addLog('error', `Global Error: ${message}`, { source, lineno, colno, stack: error?.stack });
    };

    window.onunhandledrejection = (event) => {
        addLog('error', `Unhandled Rejection: ${event.reason?.message || event.reason}`, { stack: event.reason?.stack });
    };
};

export const getCapturedLogs = () => [...logs];
