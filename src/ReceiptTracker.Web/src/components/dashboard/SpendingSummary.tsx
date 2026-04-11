import { motion } from "framer-motion";
import {
  Wallet,
  Receipt,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn, formatAmount } from "@/lib/utils";
import { calculateMonthlySpending } from "@/services/spendingAnalytics";
import type { Receipt as ReceiptType } from "@/types/receipt";

interface SpendingSummaryProps {
  receipts: ReceiptType[];
  convert: (amount: number, fromCurrency: string) => number;
  targetCurrency: string;
}

export function SpendingSummary({
  receipts,
  convert,
  targetCurrency,
}: SpendingSummaryProps) {
  const summary = calculateMonthlySpending(receipts, convert);

  return (
    <motion.div
      className="glass rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-[#5E6AD2]" />
          </div>
          <div>
            <p className="text-sm text-[#8A8F98]">Total Spent This Month</p>
            <p className="text-3xl font-bold text-white">
              {formatAmount(summary.thisMonthTotal, targetCurrency)}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
            summary.isPositiveChange
              ? "bg-red-500/10 text-red-400"
              : "bg-emerald-500/10 text-emerald-400",
          )}
        >
          {summary.isPositiveChange ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {summary.isPositiveChange ? "+" : ""}
          {summary.percentChange.toFixed(1)}% from last month
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-[#8A8F98]">
          <Receipt className="w-4 h-4" />
          {summary.thisMonthReceiptCount} receipts this month
        </div>
        <div className="flex items-center gap-2 text-[#8A8F98]">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </motion.div>
  );
}
