'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../shared/Card";

type Props = {
  data: { month: string; count: number }[];
  title?: string;
  description?: string;
  color?: string;
};

export function ActivityLineChart({
  data,
  title = "Activity Trend",
  description = "Monthly activity over the last 12 months",
  color = "#8b5cf6",
}: Props) {
  return (
    <Card title={title} description={description}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2.4}
              dot={{ r: 4, strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
