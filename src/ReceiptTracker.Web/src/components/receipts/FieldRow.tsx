import { cn } from "@/lib/utils";

interface FieldRowProps {
  label: string;
  value: string | null;
  confidence?: number | null;
}

function ConfidenceBar({ value }: { value: number | null }) {
  if (value === null) return null;
  const pct = Math.round(value * 100);
  const color = pct >= 90 ? "bg-emerald-500" : pct >= 80 ? "bg-teal-500" : "bg-amber-500";

  return (
    <div className="flex items-center gap-2 mt-0.5">
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={cn(
          "text-xs tabular-nums font-medium",
          pct >= 90 ? "text-emerald-400" : pct >= 80 ? "text-teal-400" : "text-amber-400"
        )}
      >
        {pct}%
      </span>
    </div>
  );
}

export function FieldRow({ label, value, confidence }: FieldRowProps) {
  return (
    <div className="py-4">
      <p className="text-xs text-[#8A8F98] uppercase tracking-wider mb-1">{label}</p>
      <p
        className={cn("text-base font-medium", value ? "text-[#EDEDEF]" : "text-[#8A8F98] italic")}
      >
        {value ?? "Not detected"}
      </p>
      {confidence !== undefined && <ConfidenceBar value={confidence} />}
    </div>
  );
}
