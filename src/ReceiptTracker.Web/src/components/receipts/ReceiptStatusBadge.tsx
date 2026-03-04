import { cva } from "class-variance-authority";
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
} from "lucide-react";
import type { ReceiptStatus } from "@/types/receipt";
import { STATUS_LABELS } from "@/types/receipt";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border",
  {
    variants: {
      status: {
        Uploaded: "bg-[#5E6AD2]/10 text-[#818CF8] border-[#5E6AD2]/20",
        Processing: "bg-[#5E6AD2]/15 text-[#5E6AD2] border-[#5E6AD2]/30",
        Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        NeedsReview: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        Failed: "bg-red-500/10 text-red-400 border-red-500/20",
      },
    },
  },
);

const statusIcons: Record<ReceiptStatus, React.ReactNode> = {
  Uploaded: <Clock className="w-3 h-3" />,
  Processing: <Loader2 className="w-3 h-3 animate-spin" />,
  Completed: <CheckCircle className="w-3 h-3" />,
  NeedsReview: <AlertTriangle className="w-3 h-3" />,
  Failed: <XCircle className="w-3 h-3" />,
};

interface Props {
  status: ReceiptStatus;
  className?: string;
}

export default function ReceiptStatusBadge({ status, className }: Props) {
  return (
    <span className={cn(badgeVariants({ status }), className)}>
      {statusIcons[status]}
      {STATUS_LABELS[status]}
    </span>
  );
}
