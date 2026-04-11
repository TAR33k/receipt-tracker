import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReceipt } from "@/api/receipts";
import { TERMINAL_STATUSES } from "@/types/receipt";

interface UseReceiptDetailResult {
  receipt: Awaited<ReturnType<typeof getReceipt>> | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Hook to fetch a single receipt with automatic polling until terminal status.
 */
export function useReceiptDetail(receiptId: string | undefined): UseReceiptDetailResult {
  const [shouldPoll, setShouldPoll] = useState(true);

  const {
    data: receipt,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["receipt", receiptId],
    queryFn: () => getReceipt(receiptId!),
    refetchInterval: shouldPoll ? 3000 : false,
    enabled: !!receiptId,
  });

  useEffect(() => {
    if (receipt && TERMINAL_STATUSES.includes(receipt.status)) {
      setShouldPoll(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt?.status]);

  return {
    receipt,
    isLoading,
    isError,
    error: error as Error | null,
  };
}
