import React, { useState, useEffect } from "react";
import axios from "axios";

function EmployeeTimer({ employee }) {

  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  const [loginTime] = useState(new Date());
  const [pauseTime, setPauseTime] = useState(null);
  const [resumeTime, setResumeTime] = useState(null);
  const [logoutTime, setLogoutTime] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  // ================= TIMER =================
  useEffect(() => {

    let interval = null;

    if (running) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);

  }, [running]);

  // ================= FORMAT TIME =================
  const formatTime = (sec) => {

    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return (
      h.toString().padStart(2, "0") +
      ":" +
      m.toString().padStart(2, "0") +
      ":" +
      s.toString().padStart(2, "0")
    );

  };

  // ================= PAUSE =================
  const pauseTimer = async () => {

    setPauseTime(new Date());
    setRunning(false);

    try {

      await axios.post(
        "http://localhost:5050/api/admin/employee/action",
        {
          employeeId: employee?.employeeId,
          action: "pause"
        }
      );

    } catch (err) {
      console.log("Pause API error:", err);
    }

  };

  // ================= RESUME =================
  const resumeTimer = async () => {

    setResumeTime(new Date());
    setRunning(true);

    try {

      await axios.post(
        "http://localhost:5050/api/admin/employee/action",
        {
          employeeId: employee?.employeeId,
          action: "resume"
        }
      );

    } catch (err) {
      console.log("Resume API error:", err);
    }

  };

  // ================= LOGOUT =================
  const logoutTimer = async () => {

    const logout = new Date();

    setLogoutTime(logout);
    setRunning(false);

    try {

      await axios.post(
        "http://localhost:5050/api/admin/employee/action",
        {
          employeeId: employee?.employeeId,
          action: "logout"
        }
      );

    } catch (err) {
      console.log("Logout API error:", err);
    }

    setShowPanel(false);
    setShowPopup(true);

  };

  return (

    <div>

      {/* ================= TIMER PANEL ================= */}
      {showPanel && (

        <div style={styles.panel}>

          <h4>Work Session</h4>

          <p>
            Employee: <b>{employee?.name}</b>
          </p>

          <p>
            Login Time: {loginTime.toLocaleTimeString()}
          </p>

          <h2>
            {formatTime(seconds)}
          </h2>

          <div style={styles.buttonRow}>

            <button
              onClick={pauseTimer}
              style={styles.pauseBtn}
              disabled={!running}
            >
              Pause
            </button>

            <button
              onClick={resumeTimer}
              style={styles.resumeBtn}
              disabled={running}
            >
              Resume
            </button>

            <button
              onClick={logoutTimer}
              style={styles.logoutBtn}
            >
              Logout
            </button>

          </div>

        </div>

      )}

      {/* ================= SESSION SUMMARY POPUP ================= */}
      {showPopup && (

        <div style={styles.overlay}>

          <div style={styles.popup}>

            <h3>Session Summary</h3>

            <p>
              Login Time: {loginTime.toLocaleTimeString()}
            </p>

            <p>
              Pause Time: {pauseTime ? pauseTime.toLocaleTimeString() : "-"}
            </p>

            <p>
              Resume Time: {resumeTime ? resumeTime.toLocaleTimeString() : "-"}
            </p>

            <p>
              Logout Time: {logoutTime ? logoutTime.toLocaleTimeString() : "-"}
            </p>

            <p>
              Total Work Time: {formatTime(seconds)}
            </p>

            <button
              onClick={() => setShowPopup(false)}
              style={styles.closeBtn}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

const styles = {

  panel: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    width: "250px",
    textAlign: "center"
  },

  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },

  pauseBtn: {
    background: "#007bff",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  resumeBtn: {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  logoutBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  popup: {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center"
  },

  closeBtn: {
    marginTop: "10px",
    padding: "6px 12px",
    border: "none",
    background: "#333",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer"
  }

};

export default EmployeeTimer;