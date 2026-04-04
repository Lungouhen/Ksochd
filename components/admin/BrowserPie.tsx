'use client';

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import { Card } from "./shared/Card";

const data = [
  { name: "Chrome", value: 54, color: "#f6c453" },
  { name: "Safari", value: 24, color: "#0ea5a6" },
  { name: "Firefox", value: 12, color: "#a78bfa" },
  { name: "Edge", value: 7, color: "#38bdf8" },
  { name: "Others", value: 3, color: "#94a3b8" },
];

export function BrowserPie() {
  return (
    <Card title="Top Browsers" description="Share of sessions by browser">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
