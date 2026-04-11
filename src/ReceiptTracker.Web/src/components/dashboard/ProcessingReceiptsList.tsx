import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ProcessingReceiptCard } from "@/components/receipts/ProcessingReceiptCard";
import type { Receipt } from "@/types/receipt";

interface ProcessingReceiptsListProps {
  receipts: Receipt[];
}

export function ProcessingReceiptsList({ receipts }: ProcessingReceiptsListProps) {
  if (receipts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Loader2 className="w-5 h-5 text-[#5E6AD2] animate-spin" />
          Processing
        </h3>
        <div className="space-y-3">
          {receipts.map((receipt) => (
            <ProcessingReceiptCard key={receipt.id} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
