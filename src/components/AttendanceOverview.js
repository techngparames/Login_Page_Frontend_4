import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4caf50", "#f44336"]; // Green for present, Red for absent

const AttendanceOverview = ({ attendanceData }) => {
  if (!attendanceData) return <p>Loading attendance...</p>;

  const { totalDays, present, absent } = attendanceData;

  const chartData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent }
  ];

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Attendance Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginBottom: "20px",
    textAlign: "center",
  },
  title: { color: "#1565c0", marginBottom: "15px" },
};

export default AttendanceOverview;