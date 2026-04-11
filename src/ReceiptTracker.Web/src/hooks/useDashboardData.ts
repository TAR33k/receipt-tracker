import { useCallback, useMemo } from "react";
import { useReceiptsList } from "./useReceiptsList";
import { useReceiptUpload } from "./useReceiptUpload";
import { useExchangeRates, useCurrencyPreference } from "./useExchangeRates";
import { DEFAULT_CURRENCY } from "@/lib/utils";
import type { Receipt } from "@/types/receipt";

interface DashboardData {
  // Receipts data
  receipts: Receipt[];
  recentReceipts: Receipt[];
  activeReceipts: Receipt[];

  // Pagination
  pagination: ReturnType<typeof useReceiptsList>["pagination"];
  page: number;
  setPage: (page: number) => void;
  perPage: number;

  // Search
  searchInput: string;
  setSearchInput: (value: string) => void;
  clearSearch: () => void;

  // Loading states
  isLoadingReceipts: boolean;

  // Currency
  availableCurrencies: string[];
  preferredCurrency: string;
  setPreferredCurrency: (currency: string) => void;
  isLoadingRates: boolean;
  ratesLastUpdated: Date | undefined;
  refreshRates: () => void;

  // Conversion
  convert: (amount: number, fromCurrency: string) => number;

  // Upload
  uploadReceipt: (file: File) => void;
  isUploading: boolean;
}

/**
 * Orchestration hook that combines all dashboard data sources.
 */
export function useDashboardData(): DashboardData {
  const {
    receipts,
    recentReceipts,
    activeReceipts,
    pagination,
    page,
    setPage,
    perPage,
    searchInput,
    setSearchInput,
    clearSearch,
    isLoading,
    availableCurrencies,
  } = useReceiptsList();

  const { upload: uploadReceipt, isUploading } = useReceiptUpload();

  const { preferredCurrency, setCurrency } =
    useCurrencyPreference(availableCurrencies);

  const {
    rates,
    isLoading: isLoadingRates,
    convert: rawConvert,
    refetch: refreshRates,
  } = useExchangeRates(preferredCurrency || DEFAULT_CURRENCY);

  // Safe wrapper for currency conversion
  const convert = useCallback(
    (amount: number, fromCurrency: string): number => {
      if (!rates || !preferredCurrency) return amount;
      if (fromCurrency === preferredCurrency) return amount;
      return rawConvert(amount, fromCurrency);
    },
    [rates, preferredCurrency, rawConvert],
  );

  const ratesLastUpdated = useMemo(
    () => (rates ? new Date() : undefined),
    [rates],
  );

  return {
    receipts,
    recentReceipts,
    activeReceipts,
    pagination,
    page,
    setPage,
    perPage,
    searchInput,
    setSearchInput,
    clearSearch,
    isLoadingReceipts: isLoading,
    availableCurrencies,
    preferredCurrency: preferredCurrency || DEFAULT_CURRENCY,
    setPreferredCurrency: setCurrency,
    isLoadingRates,
    ratesLastUpdated,
    refreshRates,
    convert,
    uploadReceipt,
    isUploading,
  };
}
