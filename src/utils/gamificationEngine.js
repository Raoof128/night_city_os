
// --- GAMIFICATION CONSTANTS ---

export const LEVELS = [
    { level: 1, title: "STREET_RAT", xp: 0 },
    { level: 2, title: "EDGERUNNER", xp: 500 },
    { level: 3, title: "FIXER", xp: 1500 },
    { level: 4, title: "CORPO_EXEC", xp: 4000 },
    { level: 5, title: "NIGHT_CITY_LEGEND", xp: 10000 }
];

export const BADGES = [
    { id: 'first_login', title: "JACKED_IN", desc: "Access the system for the first time", icon: "Plug" },
    { id: 'first_save', title: "PIGGY_BANK", desc: "Set a savings goal", icon: "Target" },
    { id: 'saver_bronze', title: "CHIP_HOARDER", desc: "Accumulate 10,000 €$ in assets", icon: "Coins" },
    { id: 'streak_7', title: "DAILY_GRIND", desc: "Use Finance OS for 7 consecutive days", icon: "Calendar" },
    { id: 'debt_free', title: "UNSHACKLED", desc: "Clear all debt (Mocked)", icon: "Unlock" },
    { id: 'tax_master', title: "CREATIVE_ACCOUNTANT", desc: "Tag 10 transactions as Tax Deductible", icon: "FileText" }
];

export const QUEST_TEMPLATES = [
    { id: 'check_tx', text: "Review 3 recent transactions", xp: 50, type: 'action' },
    { id: 'check_analytics', text: "Analyze spending distribution", xp: 30, type: 'visit' },
    { id: 'set_goal', text: "Update savings goal", xp: 100, type: 'action' },
    { id: 'export_csv', text: "Backup data (Export CSV)", xp: 75, type: 'action' }
];

// --- LOGIC HELPERS ---

export const getLevelInfo = (xp) => {
    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];

    for (let i = 0; i < LEVELS.length; i++) {
        if (xp >= LEVELS[i].xp) {
            currentLevel = LEVELS[i];
            nextLevel = LEVELS[i + 1] || null;
        }
    }

    return {
        level: currentLevel.level,
        title: currentLevel.title,
        currentXp: xp,
        nextLevelXp: nextLevel ? nextLevel.xp : null,
        progress: nextLevel ? ((xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100 : 100
    };
};

export const generateDailyQuests = () => {
    // Randomly select 3 quests
    const shuffled = [...QUEST_TEMPLATES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map(q => ({ ...q, completed: false }));
};

export const checkNudges = (financeData) => {
    const nudges = [];

    // 1. High Spend Alert (Mock average check)
    if (financeData.spent > 5000) {
        nudges.push({
            id: 'high_spend',
            title: "SPENDING_ALERT",
            message: "Monthly burn rate exceeds recommended 4000 €$ threshold.",
            type: "warning"
        });
    }

    // 2. Subscription Creep
    if (financeData.subscriptions && financeData.subscriptions.length > 3) {
        nudges.push({
            id: 'sub_creep',
            title: "SUB_BLOAT",
            message: `Detected ${financeData.subscriptions.length} active subscriptions. Review required?`,
            type: "info"
        });
    }

    return nudges;
};
