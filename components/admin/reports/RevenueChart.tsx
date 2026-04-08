'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../shared/Card";

type Props = {
  data: { month: string; revenue: number }[];
  title?: string;
  description?: string;
};

function formatCurrency(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
}

export function RevenueChart({
  data,
  title = "Revenue Trend",
  description = "Monthly revenue over the last 12 months",
}: Props) {
  return (
    <Card title={title} description={description}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Revenue",
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
