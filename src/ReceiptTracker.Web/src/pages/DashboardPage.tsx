import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SpendingSummary } from "@/components/dashboard/SpendingSummary";
import { MerchantAnalytics } from "@/components/dashboard/MerchantAnalytics";
import { ProcessingReceiptsList } from "@/components/dashboard/ProcessingReceiptsList";
import { ReceiptsListSection } from "@/components/dashboard/ReceiptsListSection";
import { DesktopUploadDropzone } from "@/components/upload/DesktopUploadDropzone";
import { MobileUploadFAB } from "@/components/upload/MobileUploadFAB";
import { MobileUploadModal } from "@/components/upload/MobileUploadModal";
import Layout from "@/components/layout/Layout";

export default function DashboardPage() {
  const [mobileUploadOpen, setMobileUploadOpen] = useState(false);
  const { userDisplayName } = useAuth();
  const {
    receipts,
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
    convert,
    uploadReceipt,
  } = useDashboardData();

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

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="space-y-6">
          <SpendingSummary
            receipts={receipts}
            convert={convert}
            targetCurrency={preferredCurrency}
          />
          <MerchantAnalytics
            receipts={receipts}
            convert={convert}
            targetCurrency={preferredCurrency}
          />
          <DesktopUploadDropzone onUpload={uploadReceipt} />
        </div>
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
