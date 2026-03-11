import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "" });

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/admin/employees");
      if (response.data.success) setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEditClick = (employee) => {
    setEditingId(employee._id);
    setEditData({ name: employee.name, email: employee.email });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5050/api/admin/employee/${id}`,
        editData
      );
      if (response.data.success) {
        fetchEmployees();
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert(error.response?.data?.message || "Update failed ❌");
    }
  };

  const handleCancel = () => setEditingId(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const response = await axios.delete(`http://localhost:5050/api/admin/employee/${id}`);
      if (response.data.success) fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert(error.response?.data?.message || "Delete failed ❌");
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h2>Manage Employees</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#1a73e8", color: "#fff" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Employee ID</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", textAlign: "center" }}>{emp.employeeId}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {editingId === emp._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    emp.name
                  )}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {editingId === emp._id ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    emp.email
                  )}
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  {editingId === emp._id ? (
                    <>
                      <button
                        onClick={() => handleSave(emp._id)}
                        style={{ marginRight: "5px", padding: "5px 10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        style={{ padding: "5px 10px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "5px" }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(emp)}
                        style={{ marginRight: "5px", padding: "5px 10px", backgroundColor: "#ffc107", color: "#000", border: "none", borderRadius: "5px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px" }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && <p style={{ marginTop: "20px" }}>No employees found.</p>}
      </div>
    </AdminLayout>
  );
};

export default ManageEmployee;