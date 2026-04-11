import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart } from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatAmount } from "@/lib/utils";
import { aggregateSpendingByMerchant } from "@/services/merchantAnalytics";
import type { Receipt } from "@/types/receipt";

interface MerchantAnalyticsProps {
  receipts: Receipt[];
  convert: (amount: number, fromCurrency: string) => number;
  targetCurrency: string;
}

const COLORS = ["#6366F1", "#5E6AD2", "#818CF8", "#A5B4FC", "#C7D2FE"];

export function MerchantAnalytics({
  receipts,
  convert,
  targetCurrency,
}: MerchantAnalyticsProps) {
  const merchantData = useMemo(
    () => aggregateSpendingByMerchant(receipts, convert),
    [receipts, convert],
  );

  if (merchantData.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 h-[300px] flex items-center justify-center">
        <div className="text-center">
          <BarChart className="w-12 h-12 text-[#8A8F98] mx-auto mb-3" />
          <p className="text-[#8A8F98]">No data yet</p>
          <p className="text-sm text-[#8A8F98]/70">
            Upload receipts to see analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="glass rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-semibold text-white mb-6">
        Spending by Merchant
      </h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={merchantData} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#8A8F98"
              fontSize={12}
              tickFormatter={(value) =>
                formatAmount(Number(value), targetCurrency, {
                  notation: "compact",
                  maximumFractionDigits: 0,
                })
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#8A8F98"
              fontSize={12}
              width={120}
              tickFormatter={(value) =>
                value.length > 30 ? value.slice(0, 30) + "..." : value
              }
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "#0a0a0b",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "8px",
                color: "#EDEDEF",
              }}
              formatter={(value) => [
                <span style={{ color: "#EDEDEF" }}>
                  {formatAmount(Number(value), targetCurrency)}
                </span>,
              ]}
              cursor={{
                fill: "rgba(255,255,255,0.1)",
                stroke: "rgba(255,255,255,0.1)",
                strokeWidth: 0.5,
              }}
            />
            <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
              {merchantData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
