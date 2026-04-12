import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/api/analytics";

interface UseAnalyticsOptions {
  currency?: string;
  enabled?: boolean;
}

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export function useAnalyticsDashboard(options: UseAnalyticsOptions = {}) {
  const { currency = "BAM", enabled = true } = options;

  return useQuery({
    queryKey: ["analytics", "dashboard", currency],
    queryFn: () => analyticsApi.getDashboard(currency),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    enabled,
  });
}
