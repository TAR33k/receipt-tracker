import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatAmount } from "@/lib/utils";
import type { MonthlyTrendDto } from "@/types/analytics";

interface SpendingTrendChartProps {
  data: MonthlyTrendDto[];
  currency: string;
  height?: number;
}

export function SpendingTrendChart({ data, currency, height = 300 }: SpendingTrendChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      displayAmount: item.totalAmount,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center text-[#8A8F98]" style={{ height }}>
        No data available
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5E6AD2" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#5E6AD2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="periodLabel"
            stroke="#8A8F98"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
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
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as MonthlyTrendDto;
                return (
                  <div className="bg-[#0a0a0b] border border-white/10 rounded-lg p-3 shadow-xl">
                    <p className="text-[#8A8F98] text-sm mb-1">{label}</p>
                    <p className="text-white font-semibold">
                      {formatAmount(data.totalAmount, currency)}
                    </p>
                    <p className="text-[#8A8F98] text-xs mt-1">{data.receiptCount} receipts</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="totalAmount"
            stroke="#5E6AD2"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAmount)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
