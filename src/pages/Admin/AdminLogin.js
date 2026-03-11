import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Default admin credentials
    if (email === "parames@gmail.com" && password === "parames1234") {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin-home");
    } else {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={{ marginBottom: "20px" }}>Admin Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "linear-gradient(to right, #4facfe, #00f2fe)",
};

const formStyle = {
  backgroundColor: "#fff",
  padding: "40px",
  borderRadius: "10px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  width: "300px",
};

const inputStyle = {
  marginBottom: "15px",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#1a73e8",
  color: "#fff",
  cursor: "pointer",
};

export default AdminLogin;