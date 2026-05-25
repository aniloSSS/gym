"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function NutritionChart({
  data
}: {
  data: { day: string; calories: number; protein: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="calories" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
        <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} width={42} />
        <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,.1)" }} />
        <Area type="monotone" dataKey="calories" stroke="#2dd4bf" fill="url(#calories)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ProgressChart({
  data
}: {
  data: { date: string; weight: number; protein: number; sessions: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="weight" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#fb923c" stopOpacity={0.42} />
            <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
        <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} width={38} domain={["dataMin - 1", "dataMax + 1"]} />
        <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,.1)" }} />
        <Area type="monotone" dataKey="weight" stroke="#fb923c" fill="url(#weight)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SessionsChart({
  data
}: {
  data: { date: string; sessions: number; protein: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
        <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} width={30} />
        <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,.1)" }} />
        <Bar dataKey="sessions" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
