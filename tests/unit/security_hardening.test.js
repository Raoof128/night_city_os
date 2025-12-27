import { describe, it, expect } from 'vitest';
import { validateImport, sanitizeDiagnosticData } from '../../src/utils/security';

describe('Security Utilities Hardening', () => {
    
    it('should reject non-object backups', () => {
        expect(() => validateImport("not an object")).toThrow();
    });

    it('should reject backups with too many nodes (bomb protection)', () => {
        const largeNodes = {};
        for(let i=0; i<1001; i++) largeNodes[i] = { id: String(i) };
        expect(() => validateImport({ fs: { nodes: largeNodes } })).toThrow(/too large/);
    });

    it('should reject deeply nested JSON (recursion depth limit)', () => {
        const createDeep = (depth) => {
            if (depth === 0) return "leaf";
            return { a: createDeep(depth - 1) };
        };
        const deepObj = createDeep(15); // limit is 10
        expect(() => validateImport(deepObj)).toThrow(/depth exceeded/);
    });

    it('should reject single massive string field', () => {
        const massiveString = "a".repeat(100001); // limit is 100,000
        expect(() => validateImport({ data: massiveString })).toThrow(/excessively long string/);
    });

    it('should redact sensitive keys in diagnostic data', () => {
        const data = {
            user: "Raouf",
            password: "supersecretpassword",
            nested: {
                auth_token: "xyz123"
            }
        };
        const sanitized = sanitizeDiagnosticData(data);
        expect(sanitized.password).toBe('[REDACTED]');
        expect(sanitized.nested.auth_token).toBe('[REDACTED]');
        expect(sanitized.user).toBe('Raouf');
    });
});
