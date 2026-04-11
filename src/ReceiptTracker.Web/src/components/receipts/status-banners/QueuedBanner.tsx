import { Clock } from "lucide-react";

export function QueuedBanner() {
  return (
    <div className="glass card-spotlight p-6 flex flex-col items-center gap-4 text-center rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center">
        <Clock className="w-7 h-7 text-[#818CF8]" />
      </div>
      <div>
        <p className="font-medium text-lg text-[#EDEDEF]">Waiting to be processed</p>
        <p className="text-sm text-[#8A8F98] mt-1">
          Your receipt is queued. Processing will start shortly.
        </p>
      </div>
    </div>
  );
}
