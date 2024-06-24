// chart.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MerchantData } from "./page";

interface ChartProps {
  summary: MerchantData[];
}

const Chart: React.FC<ChartProps> = ({ summary }) => (
  <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 py-4 space-y-4 min flex justify-center">
    <ResponsiveContainer width="80%" height={450}>
      <BarChart data={summary}>
        <XAxis dataKey="staffID" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="rgba(249, 115, 22, 0.9)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default Chart;
