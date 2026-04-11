import { apiRequest } from "./client";
import type {
  Receipt,
  ReceiptReviewDto,
  ReceiptUploadResponse,
  ReceiptStatus,
} from "@/types/receipt";

export interface ReceiptListRequest {
  search?: string;
  status?: ReceiptStatus;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  sortBy?: "transactionDate" | "createdAt" | "amount";
  sortDirection?: "asc" | "desc";
  page?: number;
  perPage?: number;
}

export interface PagedReceiptsResponse {
  data: Receipt[];
  pagination: {
    totalCount: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function uploadReceipt(file: File): Promise<ReceiptUploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest<ReceiptUploadResponse>("/api/receipts/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getReceipts(params?: ReceiptListRequest): Promise<PagedReceiptsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.search) searchParams.set("search", params.search);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.dateFrom) searchParams.set("dateFrom", params.dateFrom);
  if (params?.dateTo) searchParams.set("dateTo", params.dateTo);
  if (params?.amountMin) searchParams.set("amountMin", params.amountMin.toString());
  if (params?.amountMax) searchParams.set("amountMax", params.amountMax.toString());
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortDirection) searchParams.set("sortDirection", params.sortDirection);
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.perPage) searchParams.set("perPage", params.perPage.toString());

  const query = searchParams.toString();
  return apiRequest<PagedReceiptsResponse>(`/api/receipts${query ? `?${query}` : ""}`);
}

export async function getReceipt(id: string): Promise<Receipt> {
  return apiRequest<Receipt>(`/api/receipts/${id}`);
}

export async function submitReview(id: string, review: ReceiptReviewDto): Promise<Receipt> {
  return apiRequest<Receipt>(`/api/receipts/${id}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
}
