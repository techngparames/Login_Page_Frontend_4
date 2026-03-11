import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import jsPDF from "jspdf";
import "jspdf-autotable";

const EmployeeActivityList = () => {
  const [activityList, setActivityList] = useState([]);

  const fetchActivity = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/admin/employee-activity");
      if (res.data.success) {
        const allActivities = [];
        res.data.employees.forEach((emp) => {
          if (emp.loginHistory && emp.loginHistory.length > 0) {
            emp.loginHistory.forEach((entry) => {
              const pauseTimes =
                entry.pauseTime && entry.pauseTime.length > 0
                  ? entry.pauseTime
                      .map((p) => {
                        const start = new Date(p.start).toLocaleTimeString();
                        const end = p.end ? new Date(p.end).toLocaleTimeString() : "Ongoing";
                        return `${start} - ${end}`;
                      })
                      .join(", ")
                  : "-";

              const resumeTimes =
                entry.resumeTime && entry.resumeTime.length > 0
                  ? entry.resumeTime.map((r) => new Date(r).toLocaleTimeString()).join(", ")
                  : "-";

              allActivities.push({
                name: emp.name,
                employeeId: emp.employeeId,
                date: entry.loginTime ? new Date(entry.loginTime).toLocaleDateString() : "-",
                loginTime: entry.loginTime ? new Date(entry.loginTime).toLocaleTimeString() : "-",
                pauseTime: pauseTimes,
                resumeTime: resumeTimes,
                logoutTime: entry.logoutTime ? new Date(entry.logoutTime).toLocaleTimeString() : "-",
              });
            });
          }
        });
        setActivityList(allActivities);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const generatePDF = (title) => {
    const doc = new jsPDF();
    doc.text(title, 20, 10);
    const tableColumn = ["Date", "Employee ID", "Name", "Login", "Pause", "Resume", "Logout"];
    const tableRows = [];

    activityList.forEach((emp) => {
      const rowData = [
        emp.date,
        emp.employeeId,
        emp.name,
        emp.loginTime,
        emp.pauseTime,
        emp.resumeTime,
        emp.logoutTime,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save(`${title}.pdf`);
  };

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h2>Employee Activity List</h2>

        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={() => generatePDF("Daily_Employee_Activity")}
            style={styles.button}
          >
            Download Daily PDF
          </button>
          <button
            onClick={() => generatePDF("Monthly_Employee_Activity")}
            style={{ ...styles.button, marginLeft: "10px", backgroundColor: "#f39c12" }}
          >
            Download Monthly PDF
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#1a73e8", color: "#fff" }}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Employee ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Login</th>
                <th style={styles.th}>Pause</th>
                <th style={styles.th}>Resume</th>
                <th style={styles.th}>Logout</th>
              </tr>
            </thead>
            <tbody>
              {activityList.length > 0 ? (
                activityList.map((emp, idx) => (
                  <tr key={idx} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                    <td style={styles.td}>{emp.date}</td>
                    <td style={styles.td}>{emp.employeeId}</td>
                    <td style={styles.td}>{emp.name}</td>
                    <td style={styles.td}>{emp.loginTime}</td>
                    <td style={styles.td}>{emp.pauseTime}</td>
                    <td style={styles.td}>{emp.resumeTime}</td>
                    <td style={styles.td}>{emp.logoutTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    No activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  button: {
    padding: "10px 15px",
    backgroundColor: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  th: { padding: "10px", border: "1px solid #ddd" },
  td: { padding: "10px", border: "1px solid #ddd" },
};

export default EmployeeActivityList;