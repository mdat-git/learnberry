export interface ModelInputs {
  currentSavings: number;
  monthlyContribution: number;
  savingsReturnRate: number;    // decimal e.g. 0.045
  homePrice: number;
  downPaymentPct: number;       // decimal e.g. 0.20
  homePriceGrowthRate: number;  // decimal e.g. 0.04
  years: number;
}

export interface TrajectoryResult {
  savingsPoints: { month: number; value: number }[];
  requiredPoints: { month: number; value: number }[];
  crossoverMonth: number | null;
  months: number;
}

export function computeTrajectory(inputs: ModelInputs): TrajectoryResult {
  const { currentSavings, monthlyContribution, savingsReturnRate, homePrice, downPaymentPct, homePriceGrowthRate, years } = inputs;
  const months = years * 12;
  const monthlyReturn = savingsReturnRate / 12;
  const monthlyHomeGrowth = homePriceGrowthRate / 12;

  const savingsPoints: { month: number; value: number }[] = [];
  const requiredPoints: { month: number; value: number }[] = [];

  let savings = currentSavings;
  let price = homePrice;

  for (let m = 0; m <= months; m++) {
    savingsPoints.push({ month: m, value: savings });
    requiredPoints.push({ month: m, value: price * downPaymentPct });
    savings = savings * (1 + monthlyReturn) + monthlyContribution;
    price = price * (1 + monthlyHomeGrowth);
  }

  let crossoverMonth: number | null = null;
  for (let m = 0; m <= months; m++) {
    if (savingsPoints[m].value >= requiredPoints[m].value) {
      crossoverMonth = m;
      break;
    }
  }

  return { savingsPoints, requiredPoints, crossoverMonth, months };
}
