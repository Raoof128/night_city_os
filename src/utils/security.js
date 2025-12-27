import { nanoid } from 'nanoid';

const MAX_NODES = 1000;
const MAX_DEPTH = 10;
const MAX_STRING_LEN = 100000; // 100KB per string field

const checkDepth = (obj, depth = 0) => {
    if (depth > MAX_DEPTH) throw new Error('Backup nesting depth exceeded');
    if (obj && typeof obj === 'object') {
        Object.values(obj).forEach(val => checkDepth(val, depth + 1));
    }
};

const checkStrings = (obj) => {
    if (typeof obj === 'string' && obj.length > MAX_STRING_LEN) {
        throw new Error('Backup contains excessively long string field');
    }
    if (obj && typeof obj === 'object') {
        Object.values(obj).forEach(checkStrings);
    }
};

// Simple schema validation
export const validateImport = (data) => {
    if (!data || typeof data !== 'object') throw new Error('Invalid backup format');
    if (data.version && typeof data.version !== 'string') throw new Error('Invalid version');
    
    // Check total node count
    if (data.fs?.nodes && Object.keys(data.fs.nodes).length > MAX_NODES) {
        throw new Error('Backup too large (exceeds 1000 nodes)');
    }

    // Depth & String length bomb protection
    checkDepth(data);
    checkStrings(data);

    // Validate FS nodes if present
    if (data.fs && data.fs.nodes) {
        Object.values(data.fs.nodes).forEach(node => {
            if (!node.id || typeof node.id !== 'string') throw new Error('Invalid node ID');
            if (!node.name || typeof node.name !== 'string') throw new Error('Invalid node name');
            if (!['file', 'folder', 'mount'].includes(node.type)) throw new Error('Invalid node type');
        });
    }

    return true;
};

// Redact PII and secrets
export const sanitizeDiagnosticData = (data) => {
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth', 'biometric'];
    const str = JSON.stringify(data);
    
    // Simple regex redaction for common patterns
    return JSON.parse(str, (key, value) => {
        if (typeof key === 'string' && sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
            return '[REDACTED]';
        }
        return value;
    });
};

// Safe JSON Parse
export const safeParse = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
};

// Profile Generator
export const createProfile = (name, type = 'user') => ({
    id: `profile_${nanoid()}`,
    name,
    type,
    created: Date.now(),
    preferences: {
        theme: 'night',
        wallpaper: 'night'
    }
});
