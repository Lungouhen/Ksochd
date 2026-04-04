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
import { Card } from "./shared/Card";

const data = [
  { day: "1", visitors: 420 },
  { day: "2", visitors: 890 },
  { day: "3", visitors: 340 },
  { day: "4", visitors: 670 },
  { day: "5", visitors: 520 },
  { day: "6", visitors: 810 },
  { day: "7", visitors: 940 },
];

export function VisitorsChart() {
  return (
    <Card title="Visitors Trend" description="Last 7 days">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#14b8a6"
              strokeWidth={2.4}
              dot={{ r: 4, strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
