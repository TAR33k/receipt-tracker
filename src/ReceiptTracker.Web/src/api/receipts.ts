import { apiRequest } from "./client";
import type {
  Receipt,
  ReceiptReviewDto,
  ReceiptUploadResponse,
} from "@/types/receipt";

export async function uploadReceipt(
  file: File,
): Promise<ReceiptUploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  return apiRequest<ReceiptUploadResponse>("/api/receipts/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getReceipts(): Promise<Receipt[]> {
  return apiRequest<Receipt[]>("/api/receipts");
}

export async function getReceipt(id: string): Promise<Receipt> {
  return apiRequest<Receipt>(`/api/receipts/${id}`);
}

export async function submitReview(
  id: string,
  review: ReceiptReviewDto,
): Promise<Receipt> {
  return apiRequest<Receipt>(`/api/receipts/${id}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
}
