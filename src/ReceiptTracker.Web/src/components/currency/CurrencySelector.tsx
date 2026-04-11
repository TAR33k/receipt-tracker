import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, RefreshCw } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface CurrencySelectorProps {
  currencies: string[];
  selectedCurrency: string;
  onSelect: (currency: string) => void;
  isLoading: boolean;
  lastUpdated?: Date;
  onRefresh: () => void;
}

export function CurrencySelector({
  currencies,
  selectedCurrency,
  onSelect,
  isLoading,
  lastUpdated,
  onRefresh,
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (currencies.length <= 1) return null;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Globe className="w-4 h-4 text-[#5E6AD2]" />
          <span className="text-white font-medium">{selectedCurrency}</span>
          <ChevronDown
            className={cn("w-4 h-4 text-[#8A8F98] transition-transform", isOpen && "rotate-180")}
          />
        </button>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
          title="Refresh exchange rates"
        >
          <RefreshCw className={cn("w-4 h-4 text-[#8A8F98]", isLoading && "animate-spin")} />
        </button>
      </div>

      {lastUpdated && (
        <p className="text-xs text-[#8A8F98] mt-1">
          Rates updated: {formatDate(lastUpdated.toISOString(), "full")}
        </p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-48 bg-[#0a0a0b] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {currencies.map((currency) => (
              <button
                key={currency}
                onClick={() => {
                  onSelect(currency);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between",
                  currency === selectedCurrency
                    ? "bg-[#5E6AD2]/20 text-[#5E6AD2]"
                    : "text-white hover:bg-white/5"
                )}
              >
                <span>{currency}</span>
                {currency === selectedCurrency && (
                  <div className="w-2 h-2 rounded-full bg-[#5E6AD2]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
