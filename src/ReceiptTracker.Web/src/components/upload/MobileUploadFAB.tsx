import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface MobileUploadFABProps {
  onClick: () => void;
}

export function MobileUploadFAB({ onClick }: MobileUploadFABProps) {
  return (
    <motion.button
      className="md:hidden fixed bottom-6 right-8 -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-[#5E6AD2] flex items-center justify-center shadow-[0_0_30px_rgba(94,106,210,0.5),0_4px_12px_rgba(0,0,0,0.3)]"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Plus className="w-7 h-7 text-white" />
    </motion.button>
  );
}
