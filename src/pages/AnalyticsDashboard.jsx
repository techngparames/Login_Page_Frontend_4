import React from "react";
import AppUsagePieChart from "../components/AppUsagePieChart";
import ProductivityGauge from "../components/ProductivityGauge";

const AnalyticsDashboard = ({ user }) => {

  if (!user) {
    return (
      <div className="p-10 text-center text-gray-500">
        Please login to view analytics
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 min-h-screen">

      <AppUsagePieChart userId={user._id} />

      <ProductivityGauge userId={user._id} />

    </div>
  );
};

export default AnalyticsDashboard;