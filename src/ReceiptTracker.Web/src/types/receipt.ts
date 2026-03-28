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

export interface ReceiptItem {
  content: string | null;
  contentConfidence: number;
  description: string | null;
  descriptionConfidence: number;
  price: number | null;
  priceCurrency: string | null;
  priceConfidence: number;
  quantity: number | null;
  quantityConfidence: number;
  totalPrice: number | null;
  totalPriceCurrency: string | null;
  totalPriceConfidence: number;
}

export interface TaxDetail {
  content: string | null;
  contentConfidence: number;
  amount: number | null;
  amountCurrency: string | null;
  amountConfidence: number;
  description: string | null;
  descriptionConfidence: number;
  netAmount: number | null;
  netAmountCurrency: string | null;
  netAmountConfidence: number;
  rate: number | null;
  rateConfidence: number;
}

export interface MerchantAddress {
  houseNumber: string | null;
  houseNumberConfidence: number;
  road: string | null;
  roadConfidence: number;
  postalCode: string | null;
  postalCodeConfidence: number;
  city: string | null;
  cityConfidence: number;
  streetAddress: string | null;
  streetAddressConfidence: number;
  fullAddress: string | null;
  fullAddressConfidence: number;
}

export interface Receipt {
  id: string;
  status: ReceiptStatus;
  merchantName: string | null;
  totalAmount: number | null;
  transactionDate: string | null;
  transactionTime: string | null;
  currency: string | null;
  merchantNameConfidence: number | null;
  totalAmountConfidence: number | null;
  transactionDateConfidence: number | null;
  transactionTimeConfidence: number | null;
  countryRegion: string | null;
  countryRegionConfidence: number | null;
  receiptType: string | null;
  receiptTypeConfidence: number | null;
  totalTax: number | null;
  totalTaxCurrency: string | null;
  totalTaxConfidence: number | null;
  items: ReceiptItem[];
  merchantAddress: MerchantAddress | null;
  taxDetails: TaxDetail[];
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
