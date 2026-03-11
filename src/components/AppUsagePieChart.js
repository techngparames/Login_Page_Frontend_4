import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#FF6384"];

const AppUsagePieChart = ({ data }) => {
  // Aggregate total duration per app
  const aggregatedData = data.reduce((acc, item) => {
    if (!acc[item.appName]) acc[item.appName] = 0;
    acc[item.appName] += item.duration;
    return acc;
  }, {});

  const chartData = Object.entries(aggregatedData).map(([appName, duration]) => ({ name: appName, value: duration }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AppUsagePieChart;