'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card } from "../shared/Card";

type DataItem = { name: string; value: number };

type Props = {
  data: DataItem[];
  title: string;
  description?: string;
  colors?: string[];
};

const DEFAULT_COLORS = [
  "#14b8a6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#06b6d4",
  "#f97316",
  "#a855f7",
];

export function StatusPieChart({
  data,
  title,
  description,
  colors = DEFAULT_COLORS,
}: Props) {
  return (
    <Card title={title} description={description}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
