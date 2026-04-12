import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatAmount, formatMerchantName } from "@/lib/utils";
import type { MerchantSpendingDto } from "@/types/analytics";

interface MerchantBarChartProps {
  data: MerchantSpendingDto[];
  currency: string;
  height?: number;
}

const COLORS = ["#5E6AD2", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"];

export function MerchantBarChart({ data, currency, height = 300 }: MerchantBarChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: formatMerchantName(item.merchantName),
      shortName:
        formatMerchantName(item.merchantName).length > 25
          ? formatMerchantName(item.merchantName).slice(0, 25) + "..."
          : formatMerchantName(item.merchantName),
      amount: item.totalAmount,
      count: item.receiptCount,
      fullData: item,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center text-[#8A8F98]" style={{ height }}>
        No merchant data available
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis
            type="number"
            stroke="#8A8F98"
            fontSize={12}
            tickFormatter={(value) =>
              formatAmount(Number(value), currency, {
                notation: "compact",
                maximumFractionDigits: 0,
              })
            }
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="shortName"
            stroke="#8A8F98"
            fontSize={11}
            width={90}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload.fullData as MerchantSpendingDto;
                return (
                  <div className="bg-[#0a0a0b] border border-white/10 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-semibold mb-1">{data.merchantName}</p>
                    <p className="text-[#8A8F98] text-sm">
                      Total: {formatAmount(data.totalAmount, currency)}
                    </p>
                    <p className="text-[#8A8F98] text-sm">{data.receiptCount} receipts</p>
                    {data.category && (
                      <p className="text-[#8A8F98] text-xs mt-1">Category: {data.category}</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]} animationDuration={1000}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
