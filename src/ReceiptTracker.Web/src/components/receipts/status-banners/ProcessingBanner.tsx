import { Loader2 } from "lucide-react";

export function ProcessingBanner() {
  return (
    <div className="glass card-spotlight p-6 flex flex-col items-center gap-4 text-center rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-[#5E6AD2]/15 border border-[#5E6AD2]/30 flex items-center justify-center shadow-[0_0_20px_rgba(94,106,210,0.2)]">
        <Loader2 className="w-7 h-7 text-[#5E6AD2] animate-spin" />
      </div>
      <div>
        <p className="font-medium text-lg text-[#EDEDEF]">
          AI extraction in progress
        </p>
        <p className="text-sm text-[#8A8F98] mt-1 max-w-sm">
          Document Intelligence is reading your receipt. This usually takes 5–15
          seconds.
        </p>
      </div>
    </div>
  );
}
