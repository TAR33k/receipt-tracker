import { motion } from "framer-motion";
import { CurrencySelector } from "@/components/currency/CurrencySelector";

interface DashboardHeaderProps {
  userName: string;
  currencies: string[];
  selectedCurrency: string;
  onSelectCurrency: (currency: string) => void;
  isLoadingRates: boolean;
  ratesLastUpdated?: Date;
  onRefreshRates: () => void;
}

export function DashboardHeader({
  userName,
  currencies,
  selectedCurrency,
  onSelectCurrency,
  isLoadingRates,
  ratesLastUpdated,
  onRefreshRates,
}: DashboardHeaderProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex items-center gap-1">
          <span className="text-[#8A8F98] text-sm">{greeting},</span>
          <span className="text-[#EDEDEF] text-sm font-medium">{userName}</span>
        </div>
        <CurrencySelector
          currencies={currencies}
          selectedCurrency={selectedCurrency}
          onSelect={onSelectCurrency}
          isLoading={isLoadingRates}
          lastUpdated={ratesLastUpdated}
          onRefresh={onRefreshRates}
        />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-white">
        Your <span className="text-gradient-accent">Dashboard</span>
      </h1>
    </motion.div>
  );
}
