
import { describe, it, expect } from 'vitest';
import { getLevelInfo, checkNudges } from '../../src/utils/gamificationEngine';

describe('Gamification Engine', () => {
    it('calculates level correctly', () => {
        const xp = 600; // Should be Level 2 (Edgerunner is 500)
        const info = getLevelInfo(xp);

        expect(info.level).toBe(2);
        expect(info.title).toBe("EDGERUNNER");
        expect(info.currentXp).toBe(600);
    });

    it('handles max level', () => {
        const xp = 20000;
        const info = getLevelInfo(xp);

        expect(info.level).toBe(5);
        expect(info.nextLevelXp).toBeNull();
    });

    it('generates high spend nudge', () => {
        const data = { spent: 6000 };
        const nudges = checkNudges(data);

        expect(nudges).toHaveLength(1);
        expect(nudges[0].id).toBe('high_spend');
    });

    it('generates subscription nudge', () => {
        const data = { subscriptions: [1, 2, 3, 4] };
        const nudges = checkNudges(data);

        expect(nudges).toHaveLength(1);
        expect(nudges[0].id).toBe('sub_creep');
    });
});
