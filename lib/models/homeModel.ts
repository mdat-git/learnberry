export type HomeModelInputs = {
  // Phase 1 — Now (debt paydown period)
  currentMonthlySavings: number;
  currentSavingsBalance: number;
  annualReturn: number; // decimal, e.g. 0.045 for 4.5%

  // Debt bridge
  monthsUntilDebtFree: number;
  monthlyContributionAfterDebt: number;

  // Home sale equity
  currentHomeValue: number;
  remainingMortgage: number;
  sellingCostPercent: number; // decimal, e.g. 0.06 for 6%

  // Target home
  targetHomePrice: number;
  downPaymentPercent: number; // decimal, e.g. 0.20 for 20%
  closingCostPercent: number; // decimal, e.g. 0.02 for 2%
};

export type MonthlySnapshot = {
  month: number;
  balance: number;
  phase: 'debt' | 'saving';
};

export type HomeModelResult = {
  snapshots: MonthlySnapshot[];
  goalMonth: number | null;
  goalDate: string;
  totalCashNeeded: number;
  netEquity: number;
  equityContribution: number;
  totalSavedAtGoal: number;
  interestEarnedAtGoal: number;
  monthlyNeededOneYearEarlier: number;
  debtFreeMonth: number;
};

const MAX_MONTHS = 600;

function formatGoalDate(monthsFromNow: number): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + monthsFromNow);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Equity never enters the balance. The goal condition is:
//   balance >= savingsThreshold  (where savingsThreshold = totalCashNeeded - netEquity)
function simulate(
  inputs: HomeModelInputs,
  savingsThreshold: number,
  phase2Contribution: number,
  recordSnapshots: boolean,
  hardStopMonth?: number,
): {
  snapshots: MonthlySnapshot[];
  finalBalance: number;
  goalMonth: number | null;
  balanceAtGoal: number;
} {
  const {
    currentSavingsBalance,
    currentMonthlySavings,
    annualReturn,
    monthsUntilDebtFree,
  } = inputs;

  const monthlyRate = annualReturn / 12;
  const debtFreeMonth = Math.max(0, Math.floor(monthsUntilDebtFree));
  const stopAt = hardStopMonth ?? MAX_MONTHS;

  let balance = currentSavingsBalance;
  let goalMonth: number | null = null;
  let balanceAtGoal = 0;

  const snapshots: MonthlySnapshot[] = [];
  if (recordSnapshots) {
    snapshots.push({ month: 0, balance, phase: debtFreeMonth === 0 ? 'saving' : 'debt' });
  }

  if (balance >= savingsThreshold) {
    goalMonth = 0;
    balanceAtGoal = balance;
    if (!recordSnapshots) {
      return { snapshots, finalBalance: balance, goalMonth, balanceAtGoal };
    }
  }

  for (let m = 1; m <= stopAt; m++) {
    if (m <= debtFreeMonth) {
      balance = balance * (1 + monthlyRate) + currentMonthlySavings;
      if (recordSnapshots) {
        snapshots.push({ month: m, balance, phase: 'debt' });
      }
    } else {
      balance = balance * (1 + monthlyRate) + phase2Contribution;
      if (recordSnapshots) {
        snapshots.push({ month: m, balance, phase: 'saving' });
      }
    }

    if (goalMonth === null && balance >= savingsThreshold) {
      goalMonth = m;
      balanceAtGoal = balance;
      if (!recordSnapshots) break;
    }
  }

  return { snapshots, finalBalance: balance, goalMonth, balanceAtGoal };
}

function solveContributionForTargetMonth(
  inputs: HomeModelInputs,
  savingsThreshold: number,
  targetMonth: number,
): number {
  const debtFreeMonth = Math.max(0, Math.floor(inputs.monthsUntilDebtFree));
  if (targetMonth <= debtFreeMonth) {
    return 0;
  }

  let lo = 0;
  let hi = 1_000_000;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const sim = simulate(inputs, savingsThreshold, mid, false, targetMonth);
    if (sim.finalBalance >= savingsThreshold) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return Math.max(0, hi);
}

export function calculateHomeModel(inputs: HomeModelInputs): HomeModelResult {
  const {
    currentHomeValue,
    remainingMortgage,
    sellingCostPercent,
    targetHomePrice,
    downPaymentPercent,
    closingCostPercent,
    monthsUntilDebtFree,
    monthlyContributionAfterDebt,
  } = inputs;

  const netEquity = Math.max(
    0,
    currentHomeValue - remainingMortgage - currentHomeValue * sellingCostPercent,
  );
  const totalCashNeeded =
    targetHomePrice * downPaymentPercent + targetHomePrice * closingCostPercent;
  const debtFreeMonth = Math.max(0, Math.floor(monthsUntilDebtFree));

  // Savings only need to reach (totalCashNeeded - netEquity); equity covers the rest at closing.
  const savingsThreshold = Math.max(0, totalCashNeeded - netEquity);

  const main = simulate(
    inputs,
    savingsThreshold,
    monthlyContributionAfterDebt,
    true,
  );

  const goalMonth = main.goalMonth;
  const totalSavedAtGoal = goalMonth !== null ? main.balanceAtGoal : 0;

  let interestEarnedAtGoal = 0;
  if (goalMonth !== null) {
    const phase1Months = Math.min(debtFreeMonth, goalMonth);
    const phase2Months = Math.max(0, goalMonth - debtFreeMonth);
    const totalCashContributions =
      inputs.currentMonthlySavings * phase1Months +
      monthlyContributionAfterDebt * phase2Months;
    interestEarnedAtGoal =
      totalSavedAtGoal - inputs.currentSavingsBalance - totalCashContributions;
  }

  const goalDate = goalMonth !== null ? formatGoalDate(goalMonth) : '—';

  let monthlyNeededOneYearEarlier = 0;
  if (goalMonth !== null && goalMonth > 0) {
    const targetMonth = goalMonth - 12;
    const totalNeeded = solveContributionForTargetMonth(
      inputs,
      savingsThreshold,
      targetMonth,
    );
    monthlyNeededOneYearEarlier = Math.max(0, totalNeeded - monthlyContributionAfterDebt);
  }

  return {
    snapshots: main.snapshots,
    goalMonth,
    goalDate,
    totalCashNeeded,
    netEquity,
    equityContribution: netEquity,
    totalSavedAtGoal,
    interestEarnedAtGoal,
    monthlyNeededOneYearEarlier,
    debtFreeMonth,
  };
}
