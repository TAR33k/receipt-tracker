import { motion } from "framer-motion";
import { Loader2, Clock } from "lucide-react";

export function ProcessingReceiptCard() {
  return (
    <motion.div
      className="glass rounded-2xl p-5 overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#5E6AD2]/5 via-purple-500/5 to-[#5E6AD2]/5 animate-pulse" />

      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#5E6AD2] animate-spin" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-white">Processing receipt...</p>
          <p className="text-sm text-[#8A8F98]">AI is extracting data</p>
        </div>
        <div className="text-right">
          <Clock className="w-5 h-5 text-[#5E6AD2] mb-1" />
          <span className="text-xs text-[#8A8F98]">~5s</span>
        </div>
      </div>

      <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#5E6AD2] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: ["0%", "40%", "70%", "90%"] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
