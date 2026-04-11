import { XCircle } from "lucide-react";

interface FailedBannerProps {
  message: string | null;
}

export function FailedBanner({ message }: FailedBannerProps) {
  return (
    <div className="glass border-red-500/20 p-6 flex items-start gap-4 rounded-2xl">
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <XCircle className="w-6 h-6 text-red-400" />
      </div>
      <div>
        <p className="font-medium text-base text-red-400">Processing failed</p>
        <p className="text-sm text-[#8A8F98] mt-1">
          {message ?? "An unknown error occurred. The file may not contain a readable receipt."}
        </p>
      </div>
    </div>
  );
}
