import { Calculator } from "lucide-react";
import { formatAmountSimple } from "@/lib/utils";
import type { TaxDetail } from "@/types/receipt";

interface TaxDetailsListProps {
  taxDetails: TaxDetail[];
  currency: string | null;
}

export function TaxDetailsList({ taxDetails, currency }: TaxDetailsListProps) {
  if (taxDetails.length === 0) return null;

  return (
    <div className="glass card-spotlight rounded-2xl overflow-hidden">
      <div className="px-6 py-4 bg-white/[0.02] border-b border-white/[0.06]">
        <h3 className="text-sm font-medium text-[#EDEDEF] flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#5E6AD2]" />
          Tax Details
        </h3>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {taxDetails.map((tax, index) => (
          <div key={index} className="px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#EDEDEF]">
                  {tax.description ?? tax.content ?? `Tax ${index + 1}`}
                </p>
                {tax.rate !== null && (
                  <p className="text-xs text-[#8A8F98] mt-0.5">
                    Rate: {(tax.rate * 100).toFixed(0)}%
                  </p>
                )}
                {tax.netAmount !== null && (
                  <p className="text-xs text-[#8A8F98]">
                    Net:{" "}
                    {formatAmountSimple(
                      tax.netAmount,
                      tax.netAmountCurrency ?? currency,
                    )}
                  </p>
                )}
              </div>
              <div className="text-right">
                {tax.amount !== null && (
                  <p className="text-sm font-medium text-[#EDEDEF]">
                    {formatAmountSimple(
                      tax.amount,
                      tax.amountCurrency ?? currency,
                    )}
                  </p>
                )}
                {tax.amountConfidence < 0.8 && (
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
