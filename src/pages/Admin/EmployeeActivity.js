import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";

const EmployeeActivity = () => {
  const [expandedCard, setExpandedCard] = useState(""); // daily/monthly chart
  const [activityVisible, setActivityVisible] = useState(false); // show/hide table
  const [activityList, setActivityList] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Dummy usage data
    setUsageData([
      { name: "Chrome", value: 120, color: "#00C49F" },
      { name: "VSCode", value: 180, color: "#0088FE" },
      { name: "Slack", value: 60, color: "#FFBB28" },
    ]);

    setMonthlyData([
      { name: "Chrome", value: 1500, color: "#00C49F" },
      { name: "VSCode", value: 1200, color: "#0088FE" },
      { name: "Slack", value: 600, color: "#FFBB28" },
    ]);
  }, []);

  const toggleCard = (card) => setExpandedCard(expandedCard === card ? "" : card);

  // ================= FETCH ACTIVITY =================
  const fetchActivity = async () => {
    try {
      // Toggle table visibility
      if (activityVisible) {
        setActivityVisible(false);
        return;
      }

     const res = await axios.get("http://localhost:5050/api/employee/activities");
      if (res.data.success) {
        // Flatten each employee's last session
       const filtered = res.data.activities
          .map((emp) => {
            if (!emp.loginHistory || emp.loginHistory.length === 0) return null;

            // Get last session with a real login
            const lastSession = emp.loginHistory
              .slice()
              .reverse()
              .find((s) => s.loginTime !== null);

            if (!lastSession) return null;

            // Calculate worked hours (ms → h & m)
            let workedHours = "-";
            if (lastSession.loginTime) {
              const loginTime = new Date(lastSession.loginTime).getTime();
              const logoutTime = lastSession.logoutTime ? new Date(lastSession.logoutTime).getTime() : Date.now();
              let totalPause = 0;
              if (lastSession.pauseTime && lastSession.pauseTime.length > 0) {
                lastSession.pauseTime.forEach((p) => {
                  const start = new Date(p.start).getTime();
                  const end = p.end ? new Date(p.end).getTime() : Date.now();
                  totalPause += end - start;
                });
              }
              const totalWorked = logoutTime - loginTime - totalPause;
              const h = Math.floor(totalWorked / (1000 * 60 * 60));
              const m = Math.floor((totalWorked % (1000 * 60 * 60)) / (1000 * 60));
              workedHours = `${h}h ${m}m`;
            }

            return {
              date: new Date(lastSession.loginTime).toLocaleDateString(),
              employeeId: emp.employeeId,
              name: emp.name,
              loginTime: lastSession.loginTime ? new Date(lastSession.loginTime).toLocaleTimeString() : "-",
              pauseTime:
                lastSession.pauseTime && lastSession.pauseTime.length > 0
                  ? lastSession.pauseTime.map((p) => (p.start ? new Date(p.start).toLocaleTimeString() : "-")).join(", ")
                  : "-",
              logoutTime: lastSession.logoutTime ? new Date(lastSession.logoutTime).toLocaleTimeString() : "-",
              workingHours,
            };
          })
          .filter((e) => e !== null); // remove defaults/nulls

        setActivityList(filtered);
        setActivityVisible(true);
      }
    } catch (err) {
      console.error("Error fetching activity:", err);
      alert("Failed to fetch activity. Check backend!");
    }
  };

  // ================= GENERATE PDF =================
  const generatePDF = (title) => {
    const doc = new jsPDF();
    doc.text(title, 20, 10);
    const tableColumn = ["Date", "Employee ID", "Name", "Login", "Pause", "Logout", "Worked Hours"];
    const tableRows = activityList.map((emp) => [
      emp.date,
      emp.employeeId,
      emp.name,
      emp.loginTime,
      emp.pauseTime,
      emp.logoutTime,
      emp.workingHours,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`${title}.pdf`);
  };

  // ================= CARD STYLING =================
  const cardStyle = {
    flex: "1",
    minWidth: "280px",
    maxWidth: "380px",
    height: "160px",
    borderRadius: "15px",
    color: "#fff",
    boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "center",
  };

  const cardHover = (e) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.35)";
  };
  const cardLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.25)";
  };

  return (
    <AdminLayout>
      <div style={styles.page}>
        <h1 style={styles.heading}>Employee Activity Dashboard</h1>

        {/* CARDS */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          <div
            style={{ ...cardStyle, backgroundColor: "#1a73e8" }}
            onClick={fetchActivity} // toggle activity table
            onMouseEnter={cardHover}
            onMouseLeave={cardLeave}
          >
            <h3>Activity</h3>
          </div>

          <div
            style={{ ...cardStyle, backgroundColor: "#20c997" }}
            onClick={() => toggleCard("daily")}
            onMouseEnter={cardHover}
            onMouseLeave={cardLeave}
          >
            <h3>Daily Usage</h3>
          </div>

          <div
            style={{ ...cardStyle, backgroundColor: "#f39c12" }}
            onClick={() => toggleCard("monthly")}
            onMouseEnter={cardHover}
            onMouseLeave={cardLeave}
          >
            <h3>Monthly Report</h3>
          </div>
        </div>

        {/* CHARTS */}
        <div style={{ marginTop: "20px" }}>
          {expandedCard === "daily" && (
            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {usageData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} min`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {expandedCard === "monthly" && (
            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={monthlyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {monthlyData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} min`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ACTIVITY TABLE */}
        {activityVisible && (
          <div style={{ marginTop: "30px" }}>
            <h2>Employee Activity List</h2>
            <div style={{ marginBottom: "15px" }}>
              <button onClick={() => generatePDF("Employee_Activity")} style={styles.button}>
                Export PDF
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
                    <th style={styles.th}>Logout</th>
                    <th style={styles.th}>Worked Hours</th>
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
                        <td style={styles.td}>{emp.logoutTime}</td>
                        <td style={styles.td}>{emp.workingHours}</td>
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
        )}
      </div>
    </AdminLayout>
  );
};

const styles = {
  page: { minHeight: "80vh", background: "#f4f7ff", padding: "40px" },
  heading: { textAlign: "center", marginBottom: "30px", color: "#1565c0" },
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

export default EmployeeActivity;