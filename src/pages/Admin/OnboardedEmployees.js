// frontend/src/pages/Admin/OnboardedEmployees.js
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import axios from "axios";

const OnboardedEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/admin/employees");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Fetch employees error:", err);
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div style={{ padding: "40px" }}>
        <h2 style={{ color: "#1565c0", marginBottom: "20px" }}>Onboarded Employees</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Employee ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Enrolled On</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td style={styles.td}>{emp.employeeId}</td>
                  <td style={styles.td}>{emp.name}</td>
                  <td style={styles.td}>{emp.email}</td>
                  <td style={styles.td}>
                    {emp.createdAt
                      ? new Date(emp.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  th: {
    background: "#1565c0",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
};

export default OnboardedEmployees;