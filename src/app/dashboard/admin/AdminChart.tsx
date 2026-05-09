"use client";

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface DataPoint { date: string; volume: number; }

export default function AdminChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 12 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(9, 9, 11, 0.92)",
            color: "#fff",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
          }}
          itemStyle={{ color: "#22d3ee" }}
        />
        <Line
          type="monotone"
          dataKey="volume"
          stroke="#0f52ba"
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
          activeDot={{ r: 6, strokeWidth: 0, fill: "#22d3ee" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
