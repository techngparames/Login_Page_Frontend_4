import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeProfile = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/admin/employees");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
    setLoading(false);
  };

  const handleChange = (e, id) => {
    setFormData({
      ...formData,
      [id]: {
        ...formData[id],
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSave = async (id) => {
    try {
      const updatedData = formData[id];

      // PUT request to backend
      const res = await axios.put(
        `http://localhost:5050/api/admin/employee/${id}`,
        updatedData
      );

      if (res.data.success) {
        // Update frontend instantly
        setEmployees((prev) =>
          prev.map((emp) => (emp._id === id ? { ...emp, ...updatedData } : emp))
        );
        alert("Employee updated successfully ✅");
        setEditingId(null);
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert(err.response?.data?.message || "Failed to update employee ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:5050/api/admin/employee/${id}`);
      alert("Employee deleted successfully ✅");
      fetchEmployees();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete employee ❌");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!employees.length) return <p>No employees found.</p>;

  return (
    <div style={{ padding: "30px", minHeight: "80vh", background: "#f4f7ff" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#1e3a8a" }}>
        Employee Profiles
      </h1>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ background: "#1565c0", color: "#fff" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Mobile</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Gender</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>ID Proof</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const isEditing = editingId === emp._id;
              const empData = isEditing ? formData[emp._id] : emp;
              return (
                <tr key={emp._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={tdStyle}>
                    {isEditing ? (
                      <input
                        name="name"
                        value={empData.name || ""}
                        onChange={(e) => handleChange(e, emp._id)}
                      />
                    ) : (
                      empData.name
                    )}
                  </td>
                  <td style={tdStyle}>
                    {isEditing ? (
                      <input
                        name="mobile"
                        value={empData.mobile || ""}
                        onChange={(e) => handleChange(e, emp._id)}
                      />
                    ) : (
                      empData.mobile || "-"
                    )}
                  </td>
                  <td style={tdStyle}>
                    {isEditing ? (
                      <input
                        name="email"
                        value={empData.email || ""}
                        onChange={(e) => handleChange(e, emp._id)}
                      />
                    ) : (
                      empData.email
                    )}
                  </td>
                  <td style={tdStyle}>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={empData.gender || ""}
                        onChange={(e) => handleChange(e, emp._id)}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      empData.gender || "-"
                    )}
                  </td>
                  <td style={tdStyle}>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={empData.address || ""}
                        onChange={(e) => handleChange(e, emp._id)}
                      />
                    ) : (
                      empData.address || "-"
                    )}
                  </td>
                  <td style={tdStyle}>
                    {isEditing ? (
                      <input
                        name="idProof"
                        value={empData.idProof || ""}
                        onChange={(e) => handleChange(e, emp._id)}
                      />
                    ) : (
                      empData.idProof || "-"
                    )}
                  </td>
                  <td style={tdStyle}>
                    {isEditing ? (
                      <button style={buttonSave} onClick={() => handleSave(emp._id)}>
                        Save
                      </button>
                    ) : (
                      <button
                        style={buttonEdit}
                        onClick={() => {
                          setEditingId(emp._id);
                          setFormData({ ...formData, [emp._id]: emp });
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button style={buttonDelete} onClick={() => handleDelete(emp._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============== STYLES ==============
const thStyle = { padding: "12px", textAlign: "left" };
const tdStyle = { padding: "10px", verticalAlign: "top" };

const buttonEdit = {
  padding: "6px 10px",
  marginRight: "5px",
  background: "#1565c0",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const buttonSave = {
  padding: "6px 10px",
  marginRight: "5px",
  background: "#1abc9c",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const buttonDelete = {
  padding: "6px 10px",
  background: "#e74c3c",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default EmployeeProfile;