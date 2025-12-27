import { describe, it, expect, vi } from 'vitest';
import { resolveFileHandler, SYSTEM_APPS } from '../../src/os/kernel/registry';

describe('App Registry', () => {
    
    it('should resolve handler by mime type', () => {
        // TextPad handles text/plain
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

    it('should have valid system apps configuration', () => {
        expect(SYSTEM_APPS['files']).toBeDefined();
        expect(SYSTEM_APPS['files'].permissions).toContain('files:manage');
    });
});
