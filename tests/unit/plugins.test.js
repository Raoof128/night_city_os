import { describe, it, expect } from 'vitest';
import { registerPlugin, getAppManifest, getAllApps } from '../../src/os/kernel/registry';

describe('Plugin System Registry', () => {
    
    it('should register a valid plugin', () => {
        const manifest = {
            id: 'test-plugin',
            name: 'Test Plugin',
            component: () => 'Test'
        };
        const success = registerPlugin(manifest);
        
        expect(success).toBe(true);
        expect(getAppManifest('test-plugin')).toBeDefined();
        expect(getAllApps()['test-plugin']).toBeDefined();
    });

    it('should reject invalid plugin', () => {
        const manifest = { id: 'bad-plugin' };
        const success = registerPlugin(manifest);
        
        expect(success).toBe(false);
    });
});
