import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X } from "lucide-react";

interface MobileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export function MobileUploadModal({ isOpen, onClose, onUpload }: MobileUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0b] border-t border-white/10 rounded-t-3xl p-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Add Receipt</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full">
                <X className="w-5 h-5 text-[#8A8F98]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="glass p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-[#5E6AD2]/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#5E6AD2]/10 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-[#5E6AD2]" />
                </div>
                <span className="text-white font-medium">Take Photo</span>
              </button>

              <button
                className="glass p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-[#5E6AD2]/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#5E6AD2]/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-[#5E6AD2]" />
                </div>
                <span className="text-white font-medium">Upload</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
