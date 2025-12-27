import { describe, it, expect } from 'vitest';
import { resolveFileHandler, SYSTEM_APPS, registerPlugin, getAppManifest, getAllApps } from '../../src/os/kernel/registry';

describe('App Registry & Plugins', () => {
    
    describe('File Handlers', () => {
        it('should resolve handler by mime type', () => {
            const appId = resolveFileHandler('doc.txt', 'text/plain');
            expect(appId).toBe('textpad');
        });

        it('should resolve handler by extension', () => {
            const appId = resolveFileHandler('script.js', null);
            expect(appId).toBe('textpad');
        });

        it('should return null for unknown types', () => {
            const appId = resolveFileHandler('unknown.xyz', 'application/unknown');
            expect(appId).toBeNull();
        });
    });

    describe('System Apps', () => {
        it('should have valid system apps configuration', () => {
            expect(SYSTEM_APPS['files']).toBeDefined();
            expect(SYSTEM_APPS['files'].permissions).toContain('files:manage');
        });
    });

    describe('Plugin System', () => {
        it('should register an authorized plugin from allowlist', () => {
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

        it('should reject unauthorized plugin not in allowlist', () => {
            const manifest = { 
                id: 'unauthorized-hacker-app',
                name: 'Bad App',
                component: () => 'Exploit'
            };
            const success = registerPlugin(manifest);
            expect(success).toBe(false);
        });

        it('should reject invalid plugin missing required fields', () => {
            const manifest = { id: 'test-plugin' }; // Missing component
            const success = registerPlugin(manifest);
            expect(success).toBe(false);
        });
    });
});