import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAnalyticsDashboard } from "@/hooks/useAnalytics";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProcessingReceiptsList } from "@/components/dashboard/ProcessingReceiptsList";
import { ReceiptsListSection } from "@/components/dashboard/ReceiptsListSection";
import { DesktopUploadDropzone } from "@/components/upload/DesktopUploadDropzone";
import { MobileUploadFAB } from "@/components/upload/MobileUploadFAB";
import { MobileUploadModal } from "@/components/upload/MobileUploadModal";
import { SpendingTrendChart } from "@/components/analytics/charts/SpendingTrendChart";
import { MerchantBarChart } from "@/components/analytics/charts/MerchantBarChart";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { formatAmount } from "@/lib/utils";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [mobileUploadOpen, setMobileUploadOpen] = useState(false);
  const { userDisplayName } = useAuth();
  const {
    recentReceipts,
    activeReceipts,
    pagination,
    setPage,
    searchInput,
    setSearchInput,
    clearSearch,
    isLoadingReceipts,
    availableCurrencies,
    preferredCurrency,
    setPreferredCurrency,
    isLoadingRates,
    ratesLastUpdated,
    refreshRates,
    uploadReceipt,
  } = useDashboardData();

  const currency = preferredCurrency || "BAM";
  const { data: analytics, isLoading: isLoadingAnalytics } = useAnalyticsDashboard({
    currency,
  });

  return (
    <Layout>
      <DashboardHeader
        userName={userDisplayName || "User"}
        currencies={availableCurrencies}
        selectedCurrency={preferredCurrency}
        onSelectCurrency={setPreferredCurrency}
        isLoadingRates={isLoadingRates}
        ratesLastUpdated={ratesLastUpdated}
        onRefreshRates={refreshRates}
      />

      {/* Analytics Section with Navigation */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#5E6AD2]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Analytics Overview</h2>
              <p className="text-[#8A8F98] text-sm">Quick insights from your receipts</p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/analytics")}
            className="bg-[#5E6AD2] hover:bg-[#4F57B8] text-white shrink-0"
          >
            View Full Analytics
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Analytics Content */}
        {isLoadingAnalytics ? (
          <motion.div
            className="glass flex items-center justify-center py-16 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Loader2 className="w-6 h-6 animate-spin text-[#8A8F98]" />
          </motion.div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Spending Overview Card */}
            <motion.div
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-[#5E6AD2]" />
                  </div>
                  <div>
                    <p className="text-[#8A8F98] text-sm mb-1">This Month</p>
                    <p className="text-3xl font-bold text-white">
                      {formatAmount(analytics.spendingOverview.currentMonthTotal, currency)}
                    </p>
                    <div
                      className={`flex items-center gap-1 mt-1 text-sm ${
                        analytics.spendingOverview.isIncrease ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      {analytics.spendingOverview.isIncrease ? "↑" : "↓"}
                      {Math.abs(analytics.spendingOverview.percentChange).toFixed(1)}% vs last month
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 lg:text-right">
                  <div>
                    <p className="text-[#8A8F98] text-xs mb-1">Receipts</p>
                    <p className="text-lg font-semibold text-white">
                      {analytics.spendingOverview.currentMonthReceiptCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#8A8F98] text-xs mb-1">Year to Date</p>
                    <p className="text-lg font-semibold text-white">
                      {formatAmount(analytics.spendingOverview.yearToDateTotal, currency, {
                        notation: "compact",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#8A8F98] text-xs mb-1">Average</p>
                    <p className="text-lg font-semibold text-white">
                      {formatAmount(analytics.spendingOverview.averageReceiptAmount, currency, {
                        notation: "compact",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending Trend Chart */}
              <motion.div
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Spending Trend (12 Months)
                </h3>
                <SpendingTrendChart
                  data={analytics.spendingTrends}
                  currency={currency}
                  height={250}
                />
              </motion.div>

              {/* Top Merchants Chart */}
              <motion.div
                className="glass rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">Top 5 Merchants</h3>
                <MerchantBarChart
                  data={analytics.topMerchants.slice(0, 5)}
                  currency={currency}
                  height={250}
                />
              </motion.div>
            </div>
          </div>
        ) : null}
      </motion.div>

      <div className="mb-8">
        <DesktopUploadDropzone onUpload={uploadReceipt} />
      </div>

      <ProcessingReceiptsList receipts={activeReceipts} />

      <ReceiptsListSection
        receipts={recentReceipts}
        pagination={pagination}
        isLoading={isLoadingReceipts}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onClearSearch={clearSearch}
        onPageChange={setPage}
      />

      <MobileUploadFAB onClick={() => setMobileUploadOpen(true)} />

      <MobileUploadModal
        isOpen={mobileUploadOpen}
        onClose={() => setMobileUploadOpen(false)}
        onUpload={uploadReceipt}
      />
    </Layout>
  );
}
