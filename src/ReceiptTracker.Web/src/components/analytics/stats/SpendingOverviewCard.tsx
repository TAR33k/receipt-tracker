import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, Receipt, Calendar } from "lucide-react";
import { formatAmount } from "@/lib/utils";
import type { SpendingOverviewDto } from "@/types/analytics";

interface SpendingOverviewCardProps {
  data: SpendingOverviewDto;
  currency: string;
}

export function SpendingOverviewCard({ data, currency }: SpendingOverviewCardProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Main Stats */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center shrink-0">
            <Wallet className="w-7 h-7 text-[#5E6AD2]" />
          </div>
          <div>
            <p className="text-[#8A8F98] text-sm mb-1">Total Spent This Month</p>
            <p className="text-4xl font-bold text-white">
              {formatAmount(data.currentMonthTotal, currency)}
            </p>
            <div
              className={`flex items-center gap-1 mt-2 text-sm font-medium ${
                data.isIncrease ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {data.isIncrease ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {data.isIncrease ? "+" : ""}
                {data.percentChange.toFixed(1)}%
              </span>
              <span className="text-[#8A8F98]">vs last month</span>
            </div>
          </div>
        </div>

        {/* Additional Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-center lg:justify-start gap-2 text-[#8A8F98] text-sm mb-1">
              <Receipt className="w-4 h-4" />
              Receipts
            </div>
            <p className="text-xl font-semibold text-white">{data.currentMonthReceiptCount}</p>
            <p className="text-xs text-[#8A8F98]">{data.previousMonthReceiptCount} last month</p>
          </motion.div>

          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-center lg:justify-start gap-2 text-[#8A8F98] text-sm mb-1">
              <Wallet className="w-4 h-4" />
              Avg. Amount
            </div>
            <p className="text-xl font-semibold text-white">
              {formatAmount(data.averageReceiptAmount, currency)}
            </p>
            <p className="text-xs text-[#8A8F98]">per receipt</p>
          </motion.div>

          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center lg:justify-start gap-2 text-[#8A8F98] text-sm mb-1">
              <Calendar className="w-4 h-4" />
              Year to Date
            </div>
            <p className="text-xl font-semibold text-white">
              {formatAmount(data.yearToDateTotal, currency)}
            </p>
            <p className="text-xs text-[#8A8F98]">this year</p>
          </motion.div>

          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-center lg:justify-start gap-2 text-[#8A8F98] text-sm mb-1">
              <TrendingDown className="w-4 h-4" />
              Last Month
            </div>
            <p className="text-xl font-semibold text-white">
              {formatAmount(data.previousMonthTotal, currency)}
            </p>
            <p className="text-xs text-[#8A8F98]">{data.previousMonthReceiptCount} receipts</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
