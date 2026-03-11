// src/components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Menu items: add new sections here if needed
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "App Usage", path: "/app-usage" },
    { name: "Register Face", path: "/register-face" },
    { name: "Analytics Dashboard", path: "/analytics-dashboard" },
  ];

  return (
    <div
      style={{
        width: "220px",
        background: "#1e1e2f",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: "40px", fontSize: "1.5rem" }}>AI Attendance</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {menuItems.map((item) => (
          <li key={item.name} style={{ margin: "15px 0" }}>
            <Link
              to={item.path}
              style={{
                display: "block",
                padding: "10px 15px",
                borderRadius: "6px",
                backgroundColor: location.pathname === item.path ? "#4caf50" : "transparent",
                color: location.pathname === item.path ? "#fff" : "#ccc",
                textDecoration: "none",
                fontWeight: location.pathname === item.path ? "bold" : "normal",
                transition: "background-color 0.3s, color 0.3s",
              }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;