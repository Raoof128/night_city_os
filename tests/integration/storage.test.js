import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../../src/os/kernel/storage';

describe('Storage Integration (IndexedDB)', () => {
    
    beforeEach(async () => {
        // fake-indexeddb uses in-memory simulation, but good to ensure clean state
        await storage.init();
        await storage.clear();
    });

    it('should persist and retrieve file metadata', async () => {
        const meta = {
            id: 'file-123',
            name: 'test.txt',
            type: 'file',
            parentId: 'root',
            mime: 'text/plain'
        };

        await storage.createNode(meta, null); // No blob in mock environment easily without polyfill, focusing on IDB
        
        const retrieved = await storage.getNode('file-123');
        expect(retrieved).toMatchObject({
            id: 'file-123',
            name: 'test.txt'
        });
        expect(retrieved.created).toBeDefined();
    });

    it('should update parentId on move', async () => {
        const meta = { id: 'move-me', name: 'doc.md', type: 'file', parentId: 'folder-a' };
        await storage.createNode(meta);

        await storage.moveNode('move-me', 'folder-b');
        const updated = await storage.getNode('move-me');
        
        expect(updated.parentId).toBe('folder-b');
    });

    it('should clear all data on hard reset', async () => {
        await storage.createNode({ id: 'persist-test', name: 'persist', type: 'file', parentId: 'root' });
        await storage.clear();
        
        const result = await storage.getNode('persist-test');
        expect(result).toBeUndefined();
    });
});
