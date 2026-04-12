import { motion } from "framer-motion";
import { Receipt, Store, TrendingUp, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { formatAmount, formatDate, formatMerchantName } from "@/lib/utils";
import type { QuickStatsDto } from "@/types/analytics";

interface QuickStatsGridProps {
  data: QuickStatsDto;
  currency: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay?: number;
}

function StatCard({ icon, label, value, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      className="glass rounded-xl p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[#8A8F98] text-xs">{label}</p>
          <p className="text-white font-semibold text-sm truncate">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function QuickStatsGrid({ data, currency }: QuickStatsGridProps) {
  const stats = [
    {
      icon: <Receipt className="w-5 h-5 text-[#5E6AD2]" />,
      label: "Total Receipts",
      value: data.totalReceipts.toString(),
    },
    {
      icon: <Store className="w-5 h-5 text-[#5E6AD2]" />,
      label: "Unique Merchants",
      value: data.uniqueMerchants.toString(),
    },
    {
      icon: <DollarSign className="w-5 h-5 text-[#5E6AD2]" />,
      label: "All Time Total",
      value: formatAmount(data.allTimeTotal, currency),
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-[#5E6AD2]" />,
      label: "This Month",
      value: `${data.thisMonthReceipts} receipts`,
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-[#5E6AD2]" />,
      label: "Top Merchant",
      value: formatMerchantName(data.mostFrequentMerchant),
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#5E6AD2]" />,
      label: "First Receipt",
      value: data.firstReceiptDate ? formatDate(data.firstReceiptDate, "short") : "N/A",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
