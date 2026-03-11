// src/components/AdminNavbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-brand">Admin Panel</div>
      <ul className="navbar-links">
        <li>
          <Link to="/admin">Home</Link>
        </li>
        <li>
          <Link to="/admin/add-user">Add User</Link>
        </li>
        <li>
          <Link to="/admin/user-list">User List</Link>
        </li>
        <li>
          <Link to="/admin/reports">Reports</Link>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;