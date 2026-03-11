// frontend/src/pages/Admin/AdminLayout.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmployeeProfile from "./EmployeeProfile"; // Make sure this path is correct

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // State to toggle Employee Profile section
  const [showEmployeeProfile, setShowEmployeeProfile] = useState(false);

  // Protect all admin pages
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin-login", { replace: true });
  };

  // ================= STYLES =================
  const buttonStyle = {
    color: "#fff",
    backgroundColor: "#1a73e8",
    border: "none",
    borderRadius: "30px",
    padding: "8px 20px",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const handleHover = (e, color) => {
    e.currentTarget.style.backgroundColor = color;
    e.currentTarget.style.transform = "scale(1.05)";
  };

  const handleLeave = (e, originalColor) => {
    e.currentTarget.style.backgroundColor = originalColor;
    e.currentTarget.style.transform = "scale(1)";
  };

  const logoutStyle = {
    ...buttonStyle,
    backgroundColor: "#ff4d4d",
  };

  // ================= MENU ITEMS =================
  const menuItems = [
    { name: "Dashboard", path: "/admin-home" },
    { name: "Add Employee", path: "/add-employee" },
    { name: "Employee Activity", path: "/employee-activity" },
    { name: "Manage Employee", path: "/remove-employee" },
    // Employee Profile handled separately
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f4f7ff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        style={{
          backgroundColor: "#0047ab",
          padding: "12px 25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ color: "#fff", margin: 0 }}>Admin Panel</h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {menuItems.map((item) => (
            <button
              key={item.name}
              style={{
                ...buttonStyle,
                backgroundColor:
                  location.pathname === item.path ? "#1565c0" : "#1a73e8",
              }}
              onClick={() => {
                setShowEmployeeProfile(false); // hide profile if navigating
                navigate(item.path);
              }}
              onMouseEnter={(e) => handleHover(e, "#1565c0")}
              onMouseLeave={(e) =>
                handleLeave(
                  e,
                  location.pathname === item.path ? "#1565c0" : "#1a73e8"
                )
              }
            >
              {item.name}
            </button>
          ))}

          {/* Employee Profile button */}
          <button
            style={{
              ...buttonStyle,
              backgroundColor: showEmployeeProfile ? "#1565c0" : "#1a73e8",
            }}
            onClick={() => setShowEmployeeProfile((prev) => !prev)}
            onMouseEnter={(e) => handleHover(e, "#1565c0")}
            onMouseLeave={(e) =>
              handleLeave(e, showEmployeeProfile ? "#1565c0" : "#1a73e8")
            }
          >
            Employee Profile
          </button>

          <button
            style={logoutStyle}
            onClick={handleLogout}
            onMouseEnter={(e) => handleHover(e, "#d43c3c")}
            onMouseLeave={(e) => handleLeave(e, "#ff4d4d")}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main style={{ flex: 1, padding: "30px" }}>
        {showEmployeeProfile ? (
          <EmployeeProfile /> // Inline employee profile
        ) : (
          children // Other pages/components render here
        )}
      </main>
    </div>
  );
};

export default AdminLayout;