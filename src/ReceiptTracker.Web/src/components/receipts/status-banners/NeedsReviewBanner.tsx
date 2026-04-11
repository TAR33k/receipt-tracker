import { AlertTriangle } from "lucide-react";

export function NeedsReviewBanner() {
  return (
    <div className="glass border-amber-500/20 p-5 flex items-start gap-4 rounded-2xl">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
      </div>
      <div>
        <p className="font-medium text-base text-amber-400">Review required</p>
        <p className="text-sm text-[#8A8F98] mt-0.5">
          One or more fields were extracted with low confidence. Please verify
          and correct them below.
        </p>
      </div>
    </div>
  );
}
