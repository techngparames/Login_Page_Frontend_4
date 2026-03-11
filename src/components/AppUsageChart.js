// src/components/AppUsageChart.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#8884D8"];

const AppUsageChart = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAppUsage = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/app-usage/today/${userId}`);
        if (res.data.success) {
          // Convert backend data to recharts format
          const chartData = res.data.data.map(item => ({
            name: item.appName,
            value: parseFloat(item.totalMinutes.toFixed(2)), // ensure numeric
          }));
          setData(chartData);
        }
      } catch (err) {
        console.error("Error fetching app usage:", err.message);
      }
    };

    fetchAppUsage();
  }, [userId]);

  return (
    <div>
      <h3>Today's App Usage (Minutes)</h3>
      {data.length > 0 ? (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label={(entry) => `${entry.name}: ${entry.value}m`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p>No app usage data for today</p>
      )}
    </div>
  );
};

export default AppUsageChart;