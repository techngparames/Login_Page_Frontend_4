import React from "react";
import axios from "axios";

const EmployeeActionPopup = ({ employeeId, onClose }) => {
  
  const handleAction = async (actionType) => {
    try {
      await axios.post("http://localhost:5050/api/employee/action", {
        employeeId,
        action: actionType,
      });
      alert(`Action '${actionType}' recorded!`);
    } catch (err) {
      console.error(err);
      alert("Error recording action");
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: "30%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      backgroundColor: "white",
      boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
      zIndex: 1000,
    }}>
      <h3>Employee Actions</h3>
      <button onClick={() => handleAction("login")}>Login</button>
      <button onClick={() => handleAction("logout")}>Logout</button>
      <button onClick={() => handleAction("pause")}>Pause</button>
      <button onClick={onClose} style={{ marginLeft: "10px" }}>Close</button>
    </div>
  );
};

export default EmployeeActionPopup;