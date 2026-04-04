'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card } from "./shared/Card";

const data = [
  { name: "Chrome", value: 68, color: "#14b8a6" },
  { name: "Safari", value: 16, color: "#f59e0b" },
  { name: "Firefox", value: 9, color: "#8b5cf6" },
  { name: "Others", value: 7, color: "#ec4899" },
];

export function BrowserPie() {
  return (
    <Card title="Browsers" description="Share of sessions">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
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
