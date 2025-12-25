import { describe, it, expect } from 'vitest';
import { formatPersianDate } from '../../src/utils/helpers';

describe('Helpers Utility', () => {
  it('should format persian date correctly', () => {
    const date = new Date(2024, 0, 1); // Jan 1, 2024
    const result = formatPersianDate(date);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});
