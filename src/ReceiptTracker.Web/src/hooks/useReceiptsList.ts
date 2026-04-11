import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReceipts, type PagedReceiptsResponse } from "@/api/receipts";
import type { Receipt } from "@/types/receipt";
import { useDebouncedSearch } from "./useDebouncedSearch";

interface UseReceiptsListResult {
  // Data
  receipts: Receipt[];
  recentReceipts: Receipt[];
  activeReceipts: Receipt[];
  pagination: PagedReceiptsResponse["pagination"] | undefined;

  // Search
  searchInput: string;
  setSearchInput: (value: string) => void;
  clearSearch: () => void;

  // Pagination
  page: number;
  setPage: (page: number) => void;
  perPage: number;

  // State
  isLoading: boolean;

  // Currencies
  availableCurrencies: string[];
}

const PER_PAGE = 10;

/**
 * Hook to manage the receipts list with search, pagination, and auto-refresh.
 */
export function useReceiptsList(): UseReceiptsListResult {
  const [page, setPage] = useState(1);
  const {
    input: searchInput,
    debounced,
    setInput: setSearchInput,
    clear: clearSearch,
  } = useDebouncedSearch(300);

  const { data: pagedData, isLoading } = useQuery<PagedReceiptsResponse>({
    queryKey: ["receipts", page, PER_PAGE, debounced],
    queryFn: () => getReceipts({ page, perPage: PER_PAGE, search: debounced || undefined }),
    placeholderData: (previousData) => previousData,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data?.data) return false;
      return data.data.some((r) => r.status === "Uploaded" || r.status === "Processing")
        ? 3000
        : false;
    },
  });

  const receipts = useMemo(() => pagedData?.data ?? [], [pagedData]);

  const activeReceipts = useMemo(
    () => receipts.filter((r) => r.status === "Uploaded" || r.status === "Processing"),
    [receipts]
  );

  const recentReceipts = useMemo(
    () => receipts.filter((r) => r.status !== "Uploaded" && r.status !== "Processing"),
    [receipts]
  );

  const availableCurrencies = useMemo(() => {
    const currencies = new Set<string>();
    receipts.forEach((r) => {
      if (r.currency) currencies.add(r.currency);
    });
    return Array.from(currencies).sort();
  }, [receipts]);

  const handleSetPage = (newPage: number) => {
    setPage(newPage);
  };

  return {
    receipts,
    recentReceipts,
    activeReceipts,
    pagination: pagedData?.pagination,
    searchInput,
    setSearchInput,
    clearSearch,
    page,
    setPage: handleSetPage,
    perPage: PER_PAGE,
    isLoading,
    availableCurrencies,
  };
}
