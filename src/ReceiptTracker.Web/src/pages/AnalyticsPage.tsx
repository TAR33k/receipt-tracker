import { motion } from "framer-motion";
import { BarChart3, TrendingUp, PieChart, Clock, Loader2 } from "lucide-react";
import { useAnalyticsDashboard } from "@/hooks/useAnalytics";
import { useCurrencyPreference, useExchangeRates } from "@/hooks/useExchangeRates";
import { CurrencySelector } from "@/components/currency/CurrencySelector";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { SpendingTrendChart } from "@/components/analytics/charts/SpendingTrendChart";
import { MerchantBarChart } from "@/components/analytics/charts/MerchantBarChart";
import { CategoryPieChart } from "@/components/analytics/charts/CategoryPieChart";
import { QuickStatsGrid } from "@/components/analytics/stats/QuickStatsGrid";
import { SpendingOverviewCard } from "@/components/analytics/stats/SpendingOverviewCard";
import { formatAmount } from "@/lib/utils";
import { BackLink } from "@/components/receipt-detail/ReceiptDetailHeader";

export default function AnalyticsPage() {
  const { preferredCurrency, setCurrency } = useCurrencyPreference(["BAM", "EUR", "USD"]);
  const currency = preferredCurrency || "BAM";

  const { data: dashboard, isLoading, error } = useAnalyticsDashboard({ currency });

  const { isLoading: isLoadingRates, rates, refetch: refreshRates } = useExchangeRates(currency);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <BackLink to="/dashboard">Back to Dashboard</BackLink>

        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-[#5E6AD2]" />
              Analytics Dashboard
            </h1>
            <p className="text-[#8A8F98] mt-1">Detailed insights into your spending patterns</p>
          </div>
          <CurrencySelector
            currencies={["BAM", "EUR", "USD"]}
            selectedCurrency={currency}
            onSelect={setCurrency}
            isLoading={isLoadingRates}
            lastUpdated={rates ? new Date() : undefined}
            onRefresh={refreshRates}
          />
        </motion.div>

        {isLoading && (
          <motion.div
            className="glass flex items-center justify-center py-16 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Loader2 className="w-6 h-6 animate-spin text-[#8A8F98]" />
          </motion.div>
        )}

        {error && (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-red-400 mb-4">Failed to load analytics. Please try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {dashboard && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <QuickStatsGrid data={dashboard.quickStats} currency={currency} />
            </motion.section>

            {/* Main Overview Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SpendingOverviewCard data={dashboard.spendingOverview} currency={currency} />
            </motion.section>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending Trends */}
              <motion.section
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#5E6AD2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Spending Trends</h2>
                    <p className="text-[#8A8F98] text-sm">
                      Monthly spending over the last 12 months
                    </p>
                  </div>
                </div>
                <SpendingTrendChart
                  data={dashboard.spendingTrends}
                  currency={currency}
                  height={300}
                />
              </motion.section>

              {/* Top Merchants */}
              <motion.section
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#5E6AD2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Top Merchants</h2>
                    <p className="text-[#8A8F98] text-sm">Where you spend the most</p>
                  </div>
                </div>
                <MerchantBarChart data={dashboard.topMerchants} currency={currency} height={300} />
              </motion.section>

              {/* Category Breakdown */}
              <motion.section
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-[#5E6AD2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Spending by Category</h2>
                    <p className="text-[#8A8F98] text-sm">Distribution across categories</p>
                  </div>
                </div>
                <CategoryPieChart
                  data={dashboard.categoryBreakdown}
                  currency={currency}
                  height={300}
                />
              </motion.section>

              {/* Time Distribution */}
              <motion.section
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#5E6AD2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Shopping Patterns</h2>
                    <p className="text-[#8A8F98] text-sm">When you shop most frequently</p>
                  </div>
                </div>
                <TimeDistributionSummary data={dashboard.timeDistribution} currency={currency} />
              </motion.section>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function TimeDistributionSummary({
  data,
  currency,
}: {
  data: import("@/types/analytics").TimeDistributionDto;
  currency: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-[#8A8F98] text-xs mb-1">Peak Day</p>
          <p className="text-white font-semibold">{data.peakSpending.peakDay}</p>
          <p className="text-[#8A8F98] text-xs">
            {formatAmount(data.peakSpending.peakDayAmount, currency)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-[#8A8F98] text-xs mb-1">Peak Time</p>
          <p className="text-white font-semibold">{data.peakSpending.peakTime}</p>
          <p className="text-[#8A8F98] text-xs">
            {formatAmount(data.peakSpending.peakTimeAmount, currency)}
          </p>
        </div>
      </div>
      <div className="text-sm text-[#8A8F98]">
        <p className="mb-2">Most active days:</p>
        <div className="flex flex-wrap gap-2">
          {data.byDayOfWeek
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .slice(0, 3)
            .map((day) => (
              <span
                key={day.dayName}
                className="px-2 py-1 rounded-md bg-[#5E6AD2]/10 text-[#5E6AD2] text-xs"
              >
                {day.dayName} ({day.receiptCount} receipts)
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
