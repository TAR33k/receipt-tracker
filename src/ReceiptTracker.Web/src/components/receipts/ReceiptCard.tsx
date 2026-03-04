import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronRight,
  Receipt as ReceiptIcon,
  Sparkles,
} from "lucide-react";
import ReceiptStatusBadge from "./ReceiptStatusBadge";
import type { Receipt } from "@/types/receipt";
import { motion } from "framer-motion";
import { formatAmountSimple, formatDate } from "@/lib/utils";

export default function ReceiptCard({ receipt }: { receipt: Receipt }) {
  const navigate = useNavigate();
  const isActive =
    receipt.status === "Uploaded" || receipt.status === "Processing";

  return (
    <motion.div
      className="glass rounded-xl p-4 cursor-pointer group hover:border-[#5E6AD2]/30 transition-all duration-200"
      onClick={() => navigate(`/receipts/${receipt.id}`)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {isActive ? (
            <div className="w-10 h-10 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#5E6AD2] animate-pulse" />
            </div>
          ) : receipt.status === "Completed" ? (
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ReceiptIcon className="w-5 h-5 text-emerald-400" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-amber-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-white truncate">
                {receipt.merchantName ||
                  (isActive ? "Processing..." : "Unknown merchant")}
              </p>
              <p className="text-sm text-[#8A8F98]">
                {formatDate(receipt.transactionDate || receipt.createdAt)}
              </p>
            </div>
            <div className="text-right flex flex-col gap-2">
              <p className="font-semibold text-white">
                {formatAmountSimple(receipt.totalAmount, receipt.currency)}
              </p>
              <ReceiptStatusBadge status={receipt.status} />
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-[#8A8F98] group-hover:text-white flex-shrink-0" />
      </div>
    </motion.div>
  );
}
