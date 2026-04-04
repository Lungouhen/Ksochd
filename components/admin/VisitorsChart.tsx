'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "./shared/Card";

const data = [
  { name: "Mon", visitors: 820, members: 120 },
  { name: "Tue", visitors: 960, members: 142 },
  { name: "Wed", visitors: 1120, members: 188 },
  { name: "Thu", visitors: 980, members: 176 },
  { name: "Fri", visitors: 1220, members: 210 },
  { name: "Sat", visitors: 1480, members: 250 },
  { name: "Sun", visitors: 1360, members: 230 },
];

export function VisitorsChart() {
  return (
    <Card title="Visitors" description="Weekly traffic and member sessions">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#f6c453"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="members"
              stroke="#0ea5a6"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
