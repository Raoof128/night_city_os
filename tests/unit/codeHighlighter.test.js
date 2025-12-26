import { describe, it, expect } from 'vitest';
import { highlightCode } from '../../src/utils/codeHighlighter';

describe('codeHighlighter', () => {
    it('wraps keywords with spans', () => {
        const code = 'const fn = function() { return 1; }';
        const result = highlightCode(code);
        expect(result).toContain('<span');
        expect(result).toContain('const');
        expect(result).toContain('function');
        expect(result).toContain('return');
    });

    it('handles non-string safely', () => {
        expect(highlightCode(null)).toBe('');
        expect(highlightCode(undefined)).toBe('');
    });
});
