import type { Receipt } from "@/types/receipt";
import { DEFAULT_CURRENCY, normalizeMerchantName, formatMerchantName } from "@/lib/utils";

export interface MerchantSpending {
  name: string;
  amount: number;
}

interface MerchantAggregate {
  totalAmount: number;
  displayName: string;
  originalNames: Set<string>;
}

/**
 * Aggregate spending by merchant, normalizing merchant names to group variations.
 * Pure function - no React dependencies.
 */
export function aggregateSpendingByMerchant(
  receipts: Receipt[],
  convert: (amount: number, fromCurrency: string) => number
): MerchantSpending[] {
  const completed = receipts.filter((r) => r.status === "Completed" && r.merchantName);

  const grouped = new Map<string, MerchantAggregate>();

  for (const receipt of completed) {
    const normalizedKey = normalizeMerchantName(receipt.merchantName);
    if (!normalizedKey) continue;

    const convertedAmount = convert(receipt.totalAmount || 0, receipt.currency || DEFAULT_CURRENCY);

    const existing = grouped.get(normalizedKey);
    if (existing) {
      existing.totalAmount += convertedAmount;
      existing.originalNames.add(receipt.merchantName || "");
    } else {
      grouped.set(normalizedKey, {
        totalAmount: convertedAmount,
        displayName: formatMerchantName(receipt.merchantName),
        originalNames: new Set([receipt.merchantName || ""]),
      });
    }
  }

  // Determine most common display name for each merchant
  for (const [, aggregate] of grouped) {
    const nameCounts = new Map<string, number>();
    for (const name of aggregate.originalNames) {
      nameCounts.set(name, (nameCounts.get(name) || 0) + 1);
    }
    const mostCommon = [...nameCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    if (mostCommon) {
      aggregate.displayName = formatMerchantName(mostCommon);
    }
  }

  // Convert to array, sort by amount descending, take top 5
  return [...grouped.values()]
    .map((data) => ({ name: data.displayName, amount: data.totalAmount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
}
