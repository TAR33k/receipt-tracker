import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatAmount } from "@/lib/utils";
import type { CategoryBreakdownDto } from "@/types/analytics";

interface CategoryPieChartProps {
  data: CategoryBreakdownDto[];
  currency: string;
  height?: number;
}

export function CategoryPieChart({ data, currency, height = 300 }: CategoryPieChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.category,
      value: item.totalAmount,
      percentage: item.percentageOfTotal,
      count: item.receiptCount,
      color: item.color,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center text-[#8A8F98]" style={{ height }}>
        No category data available
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-[#0a0a0b] border border-white/10 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-semibold mb-1">{data.name}</p>
                    <p className="text-[#8A8F98] text-sm">{formatAmount(data.value, currency)}</p>
                    <p className="text-[#8A8F98] text-xs">
                      {data.percentage.toFixed(1)}% • {data.count} receipts
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => <span style={{ color: "#8A8F98" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
