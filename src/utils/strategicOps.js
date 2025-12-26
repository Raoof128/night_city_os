import Decimal from 'decimal.js';

/**
 * Order debts by highest interest (avalanche) or lowest balance (snowball).
 * @param {Array<{id:string, balance:number, apr:number, minPayment:number}>} debts
 * @param {'avalanche'|'snowball'} mode
 * @returns {Array} ordered debts
 */
export const rankDebts = (debts = [], mode = 'avalanche') => {
    const sorted = [...debts].sort((a, b) => {
        if (mode === 'avalanche') {
            return b.apr - a.apr;
        }
        return a.balance - b.balance;
    });
    return sorted;
};

/**
 * Calculate roundup (micro-siphon) value for a list of transactions.
 * @param {Array<{amount:number}>} transactions
 * @returns {number} total siphoned
 */
export const calculateRoundups = (transactions = []) => {
    const total = transactions.reduce((acc, tx) => {
        const amt = new Decimal(tx.amount || 0);
        const rounded = amt.toDecimalPlaces(0, Decimal.ROUND_CEIL);
        return acc.plus(rounded.minus(amt));
    }, new Decimal(0));
    return total.toNumber();
};

/**
 * Cascade contributions to the next goal when a target is met.
 * @param {Array<{id:string,current:number,target:number}>} goals ordered by priority
 * @param {number} contribution incoming contribution amount
 * @returns {{updatedGoals:Array, remainder:number}}
 */
export const cascadeContribution = (goals = [], contribution = 0) => {
    let remaining = new Decimal(contribution);
    const updated = goals.map(goal => {
        const target = new Decimal(goal.target || 0);
        const current = new Decimal(goal.current || 0);
        if (remaining.isZero() || target.lte(current)) {
            return goal;
        }
        const spaceLeft = Decimal.max(target.minus(current), 0);
        const applied = Decimal.min(spaceLeft, remaining);
        remaining = remaining.minus(applied);
        return { ...goal, current: current.plus(applied).toNumber() };
    });
    return { updatedGoals: updated, remainder: remaining.toNumber() };
};

/**
 * FIRE-style projection to estimate months to financial independence.
 * @param {object} params
 * @param {number} params.currentBalance
 * @param {number} params.monthlyContribution
 * @param {number} params.burnRate monthly spending
 * @param {number} params.expectedReturn annual return rate (e.g. 0.05)
 * @returns {{months:number,crossoverBalance:number}}
 */
export const projectFireTimeline = ({ currentBalance = 0, monthlyContribution = 0, burnRate = 0, expectedReturn = 0.05 }) => {
    const monthlyRate = new Decimal(expectedReturn).div(12);
    const burnNeeded = new Decimal(burnRate).times(12) / 0.04; // 4% rule

    let balance = new Decimal(currentBalance);
    let months = 0;

    while (balance.lt(burnNeeded) && months < 1200) { // cap 100 years
        balance = balance.times(monthlyRate.plus(1)).plus(monthlyContribution);
        months += 1;
    }

    return { months, crossoverBalance: balance.toNumber() };
};

/**
 * Project tuition fund requirement given inflation and expected return.
 * @param {object} params
 * @param {number} params.currentTuition
 * @param {number} params.years
 * @param {number} params.annualInflation
 * @param {number} params.expectedReturn
 * @returns {{futureCost:number, monthlyContribution:number}}
 */
export const projectLegacyFund = ({ currentTuition = 0, years = 10, annualInflation = 0.04, expectedReturn = 0.05 }) => {
    const futureCost = Decimal.mul(currentTuition, Decimal.pow(new Decimal(1 + annualInflation), years));
    const monthlyRate = new Decimal(expectedReturn).div(12);
    const periods = years * 12;
    const monthlyContribution = futureCost.times(monthlyRate).div(Decimal.pow(monthlyRate.plus(1), periods).minus(1));
    return { futureCost: futureCost.toNumber(), monthlyContribution: monthlyContribution.toNumber() };
};
