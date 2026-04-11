import { ShoppingCart } from "lucide-react";
import { formatAmountSimple } from "@/lib/utils";
import type { ReceiptItem } from "@/types/receipt";

interface ReceiptItemsListProps {
  items: ReceiptItem[];
  currency: string | null;
}

export function ReceiptItemsList({ items, currency }: ReceiptItemsListProps) {
  if (items.length === 0) return null;

  return (
    <div className="glass card-spotlight rounded-2xl overflow-hidden">
      <div className="px-6 py-4 bg-white/[0.02] border-b border-white/[0.06]">
        <h3 className="text-sm font-medium text-[#EDEDEF] flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-[#5E6AD2]" />
          Items ({items.length})
        </h3>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {items.map((item, index) => (
          <div key={index} className="px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#EDEDEF] truncate">
                  {item.description ?? item.content ?? `Item ${index + 1}`}
                </p>
                {item.quantity !== null && (
                  <p className="text-xs text-[#8A8F98] mt-0.5">
                    Qty: {item.quantity}
                    {item.price !== null && (
                      <span className="ml-2">
                        ×{" "}
                        {formatAmountSimple(item.price, item.priceCurrency)}
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#EDEDEF]">
                  {formatAmountSimple(
                    item.totalPrice,
                    item.totalPriceCurrency ?? currency,
                  )}
                </p>
                {(item.descriptionConfidence < 0.8 ||
                  item.totalPriceConfidence < 0.8) && (
                  <span className="text-[10px] text-amber-400">
                    Low confidence
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
