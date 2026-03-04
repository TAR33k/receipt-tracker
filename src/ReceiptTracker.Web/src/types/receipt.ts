export type ReceiptStatus =
  | "Uploaded"
  | "Processing"
  | "Completed"
  | "NeedsReview"
  | "Failed";

export const TERMINAL_STATUSES: ReceiptStatus[] = [
  "Completed",
  "NeedsReview",
  "Failed",
];

export const STATUS_LABELS: Record<ReceiptStatus, string> = {
  Uploaded: "Queued",
  Processing: "Processing",
  Completed: "Completed",
  NeedsReview: "Needs Review",
  Failed: "Failed",
};

export interface Receipt {
  id: string;
  status: ReceiptStatus;
  merchantName: string | null;
  totalAmount: number | null;
  transactionDate: string | null;
  currency: string | null;
  merchantNameConfidence: number | null;
  totalAmountConfidence: number | null;
  transactionDateConfidence: number | null;
  createdAt: string;
  processedAt: string | null;
  needsReview: boolean;
  errorMessage: string | null;
}

export interface ReceiptUploadResponse {
  receiptId: string;
  status: string;
  message: string;
}

export interface ReceiptReviewDto {
  merchantName?: string;
  totalAmount?: number;
  transactionDate?: string;
  currency?: string;
}
