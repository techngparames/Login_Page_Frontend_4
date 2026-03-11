import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/admin/users");
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5050/api/admin/delete-user/${id}`);
      setMessage("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Failed to delete user");
    }
  };

  // Start editing
  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditData({ name: user.name, email: user.email });
  };

  // Save edit
  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5050/api/admin/update-user/${id}`,
        editData
      );

      if (res.data.success) {
        setMessage("User updated successfully");
        setEditingUserId(null);
        fetchUsers();
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Update failed (maybe duplicate email)");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Enrolled Users</h1>

      {message && <p style={styles.message}>{message}</p>}

      {users.length === 0 ? (
        <p>No users enrolled yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employee ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={styles.td}>{user.employeeId}</td>

                <td style={styles.td}>
                  {editingUserId === user._id ? (
                    <input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>

                <td style={styles.td}>
                  {editingUserId === user._id ? (
                    <input
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>

                <td style={styles.td}>
                  {editingUserId === user._id ? (
                    <>
                      <button
                        style={styles.saveBtn}
                        onClick={() => handleUpdate(user._id)}
                      >
                        Save
                      </button>
                      <button
                        style={styles.cancelBtn}
                        onClick={() => setEditingUserId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        style={styles.editBtn}
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(user._id)}
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
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f4f9ff",
    minHeight: "100vh",
  },
  heading: {
    color: "#0047ab",
    marginBottom: "20px",
  },
  message: {
    marginBottom: "15px",
    fontWeight: "bold",
    color: "green",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  th: {
    padding: "12px",
    backgroundColor: "#e3f2fd",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
  editBtn: {
    marginRight: "8px",
    padding: "6px 10px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  deleteBtn: {
    padding: "6px 10px",
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  saveBtn: {
    marginRight: "8px",
    padding: "6px 10px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  cancelBtn: {
    padding: "6px 10px",
    backgroundColor: "gray",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default UserList;