export interface SpendingOverviewDto {
  currentMonthTotal: number;
  previousMonthTotal: number;
  percentChange: number;
  isIncrease: boolean;
  currentMonthReceiptCount: number;
  previousMonthReceiptCount: number;
  averageReceiptAmount: number;
  yearToDateTotal: number;
}

export interface MonthlyTrendDto {
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  totalAmount: number;
  receiptCount: number;
  averageAmount: number;
  projectedAmount?: number;
}

export interface MerchantSpendingDto {
  merchantName: string;
  normalizedName: string;
  totalAmount: number;
  receiptCount: number;
  averageAmount: number;
  firstPurchase: string | null;
  lastPurchase: string | null;
  monthlyTrends: MonthlyTrendDto[];
  category: string | null;
}

export interface CategoryBreakdownDto {
  category: string;
  totalAmount: number;
  percentageOfTotal: number;
  receiptCount: number;
  color: string;
}

export interface TaxRateDistributionDto {
  rate: number;
  totalAmount: number;
  receiptCount: number;
}

export interface MonthlyTaxDto {
  month: string;
  totalTax: number;
  totalAmount: number;
  taxRate: number;
}

export interface TaxSummaryDto {
  totalTaxPaid: number;
  effectiveTaxRate: number;
  deductibleEstimate: number;
  taxRates: TaxRateDistributionDto[];
  monthlyBreakdown: MonthlyTaxDto[];
}

export interface DayOfWeekDistributionDto {
  dayName: string;
  dayOfWeek: number;
  totalAmount: number;
  receiptCount: number;
}

export interface HourDistributionDto {
  hour: number;
  timeLabel: string;
  totalAmount: number;
  receiptCount: number;
}

export interface PeakSpendingDto {
  peakDay: string;
  peakTime: string;
  peakDayAmount: number;
  peakTimeAmount: number;
}

export interface TimeDistributionDto {
  byDayOfWeek: DayOfWeekDistributionDto[];
  byHour: HourDistributionDto[];
  peakSpending: PeakSpendingDto;
}

export interface QuickStatsDto {
  totalReceipts: number;
  thisMonthReceipts: number;
  allTimeTotal: number;
  uniqueMerchants: number;
  averageConfidence: number;
  mostFrequentMerchant: string;
  firstReceiptDate: string | null;
}

export interface AnalyticsDashboardDto {
  spendingOverview: SpendingOverviewDto;
  spendingTrends: MonthlyTrendDto[];
  topMerchants: MerchantSpendingDto[];
  categoryBreakdown: CategoryBreakdownDto[];
  taxSummary: TaxSummaryDto;
  timeDistribution: TimeDistributionDto;
  quickStats: QuickStatsDto;
  currency: string;
  generatedAt: string;
}

export type Granularity = "day" | "week" | "month" | "year";
