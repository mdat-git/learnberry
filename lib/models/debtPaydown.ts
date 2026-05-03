export type Debt = {
  id: string;
  name: string;
  balance: number;
  apr: number; // decimal, e.g. 0.045 for 4.5%
  monthlyPayment: number;
};

export type DebtStrategy = 'minimum' | 'snowball' | 'avalanche';

export type MonthSnapshot = {
  month: number;
  totalBalance: number;
  interestPaidThisMonth: number;
  cashFlowUnlocked: number;
  balances: Record<string, number>;
};

export type StrategyResult = {
  snapshots: MonthSnapshot[];
  debtFreeMonth: number | null;
  totalInterestPaid: number;
  cashFlowMilestones: {
    month: number;
    debtName: string;
    cashFlowUnlocked: number;
    cumulativeCashFlow: number;
  }[];
};

export type DebtPaydownResult = {
  minimum: StrategyResult;
  snowball: StrategyResult;
  avalanche: StrategyResult;
};

export type DebtPaydownInputs = {
  debts: Debt[];
  extraMonthlyBudget: number;
};

const MAX_MONTHS = 600;
const EPS = 0.005;

function simulate(debts: Debt[], extraMonthlyBudget: number, strategy: DebtStrategy): StrategyResult {
  const balances: Record<string, number> = {};
  const cleared = new Set<string>();

  for (const d of debts) {
    balances[d.id] = d.balance;
    if (d.balance <= 0) cleared.add(d.id);
  }

  const initialTotal = debts.reduce((s, d) => s + Math.max(0, d.balance), 0);

  const snapshots: MonthSnapshot[] = [{
    month: 0,
    totalBalance: initialTotal,
    interestPaidThisMonth: 0,
    cashFlowUnlocked: 0,
    balances: { ...balances },
  }];

  const cashFlowMilestones: StrategyResult['cashFlowMilestones'] = [];
  let totalInterestPaid = 0;
  let cumulativeCashFlow = 0;
  let debtFreeMonth: number | null = null;

  if (initialTotal <= EPS) {
    return { snapshots, debtFreeMonth: 0, totalInterestPaid: 0, cashFlowMilestones };
  }

  for (let month = 1; month <= MAX_MONTHS; month++) {
    let interestThisMonth = 0;
    let unlockedThisMonth = 0;

    // 1. Accrue monthly interest on all active debts
    for (const d of debts) {
      if (balances[d.id] > 0) {
        const interest = balances[d.id] * (d.apr / 12);
        balances[d.id] += interest;
        interestThisMonth += interest;
      }
    }

    // 2. Apply minimum payments. Track leftover only for snowball/avalanche so
    //    over-paid minimums (when balance < minimum) get redirected to the pool.
    let leftoverFromMinimums = 0;
    for (const d of debts) {
      if (balances[d.id] > 0) {
        const want = d.monthlyPayment;
        const pay = Math.min(want, balances[d.id]);
        balances[d.id] -= pay;
        if (balances[d.id] < 0) balances[d.id] = 0;
        if (strategy !== 'minimum' && pay < want) {
          leftoverFromMinimums += want - pay;
        }
      }
    }

    // 3. Apply extra budget pool (snowball/avalanche only). The pool grows
    //    as debts clear because their former minimum payments roll in.
    if (strategy !== 'minimum') {
      const rolled = debts
        .filter((d) => cleared.has(d.id))
        .reduce((s, d) => s + d.monthlyPayment, 0);
      let remaining = extraMonthlyBudget + rolled + leftoverFromMinimums;

      const active = debts.filter((d) => balances[d.id] > 0 && !cleared.has(d.id));
      if (strategy === 'snowball') {
        active.sort((a, b) => balances[a.id] - balances[b.id]);
      } else {
        active.sort((a, b) => b.apr - a.apr);
      }

      for (const d of active) {
        if (remaining <= EPS) break;
        const pay = Math.min(remaining, balances[d.id]);
        balances[d.id] -= pay;
        remaining -= pay;
        if (balances[d.id] < 0) balances[d.id] = 0;
      }
    }

    // 4. Detect newly cleared debts → record milestones
    for (const d of debts) {
      if (balances[d.id] <= EPS && !cleared.has(d.id)) {
        cleared.add(d.id);
        cumulativeCashFlow += d.monthlyPayment;
        unlockedThisMonth += d.monthlyPayment;
        cashFlowMilestones.push({
          month,
          debtName: d.name,
          cashFlowUnlocked: d.monthlyPayment,
          cumulativeCashFlow,
        });
      }
    }

    totalInterestPaid += interestThisMonth;

    const totalBalance = Object.values(balances).reduce((s, b) => s + Math.max(0, b), 0);

    snapshots.push({
      month,
      totalBalance,
      interestPaidThisMonth: interestThisMonth,
      cashFlowUnlocked: unlockedThisMonth,
      balances: { ...balances },
    });

    if (totalBalance <= EPS) {
      debtFreeMonth = month;
      break;
    }
  }

  return { snapshots, debtFreeMonth, totalInterestPaid, cashFlowMilestones };
}

export function calculateDebtPaydown(inputs: DebtPaydownInputs): DebtPaydownResult {
  const { debts, extraMonthlyBudget } = inputs;
  return {
    minimum: simulate(debts, extraMonthlyBudget, 'minimum'),
    snowball: simulate(debts, extraMonthlyBudget, 'snowball'),
    avalanche: simulate(debts, extraMonthlyBudget, 'avalanche'),
  };
}
