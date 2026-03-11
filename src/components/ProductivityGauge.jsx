import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

const ProductivityGauge = ({ userId }) => {

  const [score, setScore] = useState(0);

  const fetchScore = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5050/api/productivity/${userId}`
      );

      setScore(Number(res.data.productivityScore || 0));

    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {

    fetchScore();

    const interval = setInterval(fetchScore, 5000);

    return () => clearInterval(interval);

  }, [userId]);

  const data = [
    { name: "Productive", value: score },
    { name: "Remaining", value: 100 - score }
  ];

  const COLORS = ["#22c55e", "#e5e7eb"];

  return (
    <div className="w-full h-[300px] bg-white p-5 rounded-2xl shadow-lg flex flex-col items-center">

      <h2 className="text-xl font-semibold mb-4">
        Productivity Score
      </h2>

      <div className="w-full h-[220px]">
        <ResponsiveContainer>
          <PieChart>

            <Pie
              data={data}
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="text-2xl font-bold text-green-600">
        {score}%
      </p>

    </div>
  );
};

export default ProductivityGauge;