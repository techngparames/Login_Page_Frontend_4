// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ users }) => {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("overview");
  const [loginTime, setLoginTime] = useState(null);
  const [logoutTime, setLogoutTime] = useState(null);
  const [workingHours, setWorkingHours] = useState("--");
  const [locationStatus, setLocationStatus] = useState("Checking location...");

  const [usageData, setUsageData] = useState([]);
  const [legendData, setLegendData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyLegend, setMonthlyLegend] = useState([]);
  const [monthlyHours, setMonthlyHours] = useState("--");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#FF3333", "#33FF99"];
  const employeeName = "Parameswari";

  const officeLat = 12.953252768274158;
  const officeLng = 80.24217392966877;

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const dummyDaily = [
      { name: "Chrome", value: 120, color: "#0088FE" },
      { name: "VSCode", value: 180, color: "#00C49F" },
      { name: "Slack", value: 60, color: "#FFBB28" }
    ];
    setUsageData(dummyDaily);
    setLegendData(dummyDaily);
    setWorkingHours("6h 0m");

    const dummyMonthly = [
      { name: "Chrome", value: 1500, color: "#0088FE" },
      { name: "VSCode", value: 1200, color: "#00C49F" },
      { name: "Slack", value: 600, color: "#FFBB28" }
    ];
    setMonthlyData(dummyMonthly);
    setMonthlyLegend(dummyMonthly);
    setMonthlyHours("70h 0m");
  }, []);

  useEffect(() => {
    setLoginTime(new Date());

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const distance = calculateDistance(userLat, userLng, officeLat, officeLng);
          setLocationStatus(distance <= 300 ? "TechNG, Perungudi, Chennai, Tamil Nadu 600096" : "Outside Office Location");
        },
        () => setLocationStatus("Location permission denied")
      );
    } else {
      setLocationStatus("Geolocation not supported");
    }
  }, []);

  const handleLogout = async () => {
    setLogoutTime(new Date());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatTime = (time) => (time ? time.toLocaleTimeString() : "--");
  const formatDate = () => new Date().toLocaleDateString("en-GB");

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return (
          <>
            <h2 className="page-title">Welcome, {employeeName} 👋</h2>

            {/* ================= ONBOARDED EMPLOYEE COUNT CARD ================= */}
            <div className="dashboard-cards" style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
              <div className="dashboard-card" style={{
                flex: "1 1 200px",
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #cce0ff",
                boxShadow: "0 4px 6px rgba(0,64,128,0.1)",
                textAlign: "center"
              }}>
                <h3>Total Onboarded Employees</h3>
                <p>{users.length}</p>
              </div>
            </div>

            {/* ================= USER DETAILS CARD ================= */}
            <div className="rect-card">
              <div className="rect-row"><div>Name : </div><div>{employeeName}</div></div>
              <div className="rect-row"><div>Date : </div><div>{formatDate()}</div></div>
              <div className="rect-row"><div>Login Time : </div><div>{formatTime(loginTime)}</div></div>
              <div className="rect-row"><div>Logout Time : </div><div>{formatTime(logoutTime)}</div></div>
              <div className="rect-row"><div>Working Hours : </div><div>{workingHours}</div></div>
              <div className="rect-row"><div>Location : </div><div style={{ maxWidth: "300px", textAlign: "right" }}>{locationStatus}</div></div>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </>
        );

      case "usage":
        return (
          <div className="usage-chart-container">
            {/* Daily Usage Pie Chart */}
            <h2 className="page-title">Daily Application Usage</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={usageData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {usageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} min`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case "monthly":
        return <div className="usage-chart-container"><h2 className="page-title">Monthly Application Usage</h2></div>;
      case "sheet":
        return <h2 className="page-title">Attendance Sheet</h2>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2 className="logo">AI Attendance</h2>
        <button className={activePage === "overview" ? "active" : ""} onClick={() => setActivePage("overview")}>Attendance Overview</button>
        <button className={activePage === "usage" ? "active" : ""} onClick={() => setActivePage("usage")}>Application Usage</button>
        <button className={activePage === "monthly" ? "active" : ""} onClick={() => setActivePage("monthly")}>Monthly Report</button>
        <button className={activePage === "sheet" ? "active" : ""} onClick={() => setActivePage("sheet")}>Attendance Sheet</button>
      </div>
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;