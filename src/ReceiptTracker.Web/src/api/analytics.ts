import { apiRequest, buildUrl } from "./client";
import type { AnalyticsDashboardDto } from "@/types/analytics";

export const analyticsApi = {
  getDashboard: async (currency?: string) => {
    const url = buildUrl("/api/analytics/dashboard", { currency });
    return apiRequest<AnalyticsDashboardDto>(url);
  },
};
