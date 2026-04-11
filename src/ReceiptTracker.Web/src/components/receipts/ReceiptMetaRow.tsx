import { formatDateTime } from "@/lib/utils";
import type { Receipt } from "@/types/receipt";

interface ReceiptMetaRowProps {
  receipt: Receipt;
}

export function ReceiptMetaRow({ receipt }: ReceiptMetaRowProps) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#8A8F98] mt-2">
      <span>Uploaded {formatDateTime(receipt.createdAt)}</span>
      {receipt.processedAt && <span>Processed {formatDateTime(receipt.processedAt)}</span>}
    </div>
  );
}
