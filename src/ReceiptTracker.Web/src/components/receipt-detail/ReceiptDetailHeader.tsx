import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ReceiptMetaRow } from "@/components/receipts/ReceiptMetaRow";
import ReceiptStatusBadge from "@/components/receipts/ReceiptStatusBadge";
import { cn } from "@/lib/utils";
import type { Receipt } from "@/types/receipt";

interface ReceiptDetailHeaderProps {
  receipt: Receipt;
}

export function ReceiptDetailHeader({ receipt }: ReceiptDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1
          className={cn(
            "text-2xl sm:text-3xl font-semibold tracking-tight",
            receipt.merchantName
              ? "text-[#EDEDEF]"
              : "text-[#8A8F98] italic",
          )}
        >
          {receipt.merchantName ?? "Receipt"}
        </h1>
        <ReceiptMetaRow receipt={receipt} />
      </div>
      <ReceiptStatusBadge
        status={receipt.status}
        className="mt-1 flex-shrink-0"
      />
    </div>
  );
}

interface BackLinkProps {
  to: string;
  children: React.ReactNode;
}

export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm text-[#8A8F98] hover:text-[#EDEDEF] transition-colors mb-6 group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      {children}
    </Link>
  );
}
