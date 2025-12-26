import { describe, expect, it } from 'vitest';
import { rankDebts, calculateRoundups, cascadeContribution, projectFireTimeline, projectLegacyFund } from '../../src/utils/strategicOps';

describe('strategicOps utilities', () => {
    it('ranks debts by avalanche and snowball', () => {
        const debts = [
            { id: 'a', balance: 2000, apr: 0.19 },
            { id: 'b', balance: 500, apr: 0.09 }
        ];
        expect(rankDebts(debts, 'avalanche')[0].id).toBe('a');
        expect(rankDebts(debts, 'snowball')[0].id).toBe('b');
    });

    it('calculates roundup siphons precisely', () => {
        const total = calculateRoundups([{ amount: 12.34 }, { amount: 5.01 }]);
        expect(total).toBeCloseTo(1.65, 2);
    });

    it('cascades contributions across goals', () => {
        const { updatedGoals, remainder } = cascadeContribution(
            [
                { id: 'vault', current: 90, target: 100 },
                { id: 'vacation', current: 0, target: 50 }
            ],
            30
        );
        expect(updatedGoals[0].current).toBe(100);
        expect(updatedGoals[1].current).toBe(20);
        expect(remainder).toBe(0);
    });

    it('projects FIRE timeline with a finite horizon', () => {
        const projection = projectFireTimeline({
            currentBalance: 10000,
            monthlyContribution: 1000,
            burnRate: 2000,
            expectedReturn: 0.05
        });
        expect(projection.months).toBeGreaterThan(0);
        expect(projection.months).toBeLessThanOrEqual(1200);
    });

    it('projects legacy fund cost and monthly contribution', () => {
        const { futureCost, monthlyContribution } = projectLegacyFund({
            currentTuition: 20000,
            years: 5,
            annualInflation: 0.03,
            expectedReturn: 0.05
        });
        expect(futureCost).toBeGreaterThan(20000);
        expect(monthlyContribution).toBeGreaterThan(0);
    });
});
