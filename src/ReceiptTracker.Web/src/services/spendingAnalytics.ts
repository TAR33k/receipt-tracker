import type { Receipt } from "@/types/receipt";
import { DEFAULT_CURRENCY } from "@/lib/utils";

export interface MonthlySpendingSummary {
  thisMonthTotal: number;
  lastMonthTotal: number;
  percentChange: number;
  isPositiveChange: boolean;
  thisMonthReceiptCount: number;
  lastMonthReceiptCount: number;
}

/**
 * Calculate monthly spending totals and compare to previous month.
 * Pure function - no React dependencies.
 */
export function calculateMonthlySpending(
  receipts: Receipt[],
  convert: (amount: number, fromCurrency: string) => number,
): MonthlySpendingSummary {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let thisMonthTotal = 0;
  let lastMonthTotal = 0;
  let thisMonthReceiptCount = 0;
  let lastMonthReceiptCount = 0;

  for (const receipt of receipts) {
    if (!receipt.transactionDate || receipt.status !== "Completed") {
      continue;
    }

    const date = new Date(receipt.transactionDate);
    const amount = convert(
      receipt.totalAmount || 0,
      receipt.currency || DEFAULT_CURRENCY,
    );

    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      thisMonthTotal += amount;
      thisMonthReceiptCount++;
    } else if (
      date.getMonth() === lastMonth &&
      date.getFullYear() === lastMonthYear
    ) {
      lastMonthTotal += amount;
      lastMonthReceiptCount++;
    }
  }

  const percentChange =
    lastMonthTotal > 0
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : 0;

  return {
    thisMonthTotal,
    lastMonthTotal,
    percentChange,
    isPositiveChange: percentChange >= 0,
    thisMonthReceiptCount,
    lastMonthReceiptCount,
  };
}
