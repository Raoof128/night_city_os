import { describe, expect, it } from 'vitest';
import { createFileDescriptor, validateTransactionPayload } from '../../src/utils/validation';

describe('Validation utilities', () => {
    describe('validateTransactionPayload', () => {
        it('returns sanitized transaction data for valid payloads', () => {
            const payload = { amount: 42, summary: 'Cyberdeck upgrade' };
            const result = validateTransactionPayload(payload);

            expect(result.amount).toBe(42);
            expect(result.summary).toBe('Cyberdeck upgrade');
        });

        it('throws when amount is invalid', () => {
            expect(() => validateTransactionPayload({ amount: -5, summary: 'bad' })).toThrow();
            expect(() => validateTransactionPayload({ amount: 'nan', summary: 'bad' })).toThrow();
        });

        it('falls back to UNKNOWN summary when missing', () => {
            const payload = { amount: 1000 };
            const result = validateTransactionPayload(payload);

            expect(result.summary).toBe('UNKNOWN');
        });
    });

    describe('createFileDescriptor', () => {
        it('creates descriptor with safe defaults', () => {
            const descriptor = createFileDescriptor({ name: 'demo.png', type: 'image/png', size: 2048 });
            expect(descriptor.name).toBe('demo.png');
            expect(descriptor.type).toBe('image/png');
            expect(descriptor.sizeKb).toBeGreaterThan(0);
        });

        it('throws when file is missing', () => {
            expect(() => createFileDescriptor()).toThrow();
        });
    });
});
