import { CheckCircle } from "lucide-react";

export function CompletedBanner() {
  return (
    <div className="glass border-emerald-500/20 p-5 flex items-center gap-4 rounded-2xl">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <CheckCircle className="w-5 h-5 text-emerald-400" />
      </div>
      <p className="text-base text-emerald-400 font-medium">
        Extraction complete — all fields verified
      </p>
    </div>
  );
}
