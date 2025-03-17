export interface IMonthlySummary {
  month: number;
  year: number;
  totalRents: number;
  totalExpenses: number;
  netIncome: number;
  totalPaidRents: number;
  totalUnpaidRents: number;
  occupancyRate: number;
  expenses: {
    electricity: number;
    water: number;
    gas: number;
    maintenance: number;
    other: number;
  };
}

export interface MonthlyStats {
  month: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  occupancyRate: number;
  expenses: {
    electricity: number;
    water: number;
    gas: number;
    maintenance: number;
    other: number;
  };
}

export interface YearlyStatsSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  averageOccupancyRate: number;
  expenses: {
    electricity: number;
    water: number;
    gas: number;
    maintenance: number;
    other: number;
  };
  monthlyData: {
    month: number;
    income: number;
    expenses: number;
    netIncome: number;
  }[];
}
