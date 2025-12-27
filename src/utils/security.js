import { nanoid } from 'nanoid';

// Simple schema validation
export const validateImport = (data) => {
    if (!data || typeof data !== 'object') throw new Error('Invalid backup format');
    if (data.version && typeof data.version !== 'string') throw new Error('Invalid version');
    
    // Validate FS nodes if present
    if (data.fs && data.fs.nodes) {
        Object.values(data.fs.nodes).forEach(node => {
            if (!node.id || !node.name || !node.type) {
                throw new Error('Corrupt file system node detected');
            }
        });
    }

    return true;
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
