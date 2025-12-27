import { describe, it, expect, vi } from 'vitest';
import { hashContent } from '../../src/utils/crypto';

describe('Crypto Utilities', () => {
    
    it('should generate a consistent SHA-256 hash', async () => {
        const content = 'NIGHT_CITY';
        const hash = await hashContent(content);
        
        expect(hash).toHaveLength(64);
        expect(hash).toBe(await hashContent(content));
    });

    it('should change hash for different content', async () => {
        const h1 = await hashContent('A');
        const h2 = await hashContent('B');
        expect(h1).not.toBe(h2);
    });
});
