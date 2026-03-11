import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

const FaceLogin = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [status, setStatus] = useState("Initializing AI...");
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [matchedEmployee, setMatchedEmployee] = useState(null);

  const [dashboardOpen, setDashboardOpen] = useState(false);

  const [loginTime, setLoginTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [logoutSummary, setLogoutSummary] = useState(null);

  const [paused, setPaused] = useState(false);
  const [pauseStart, setPauseStart] = useState(null);
  const [totalPaused, setTotalPaused] = useState(0);

  // ================= LOAD MODELS =================
  useEffect(() => {
    const loadModels = async () => {
      try {
        await tf.setBackend("webgl");
        await tf.ready();

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        setStatus("Face Login Ready ✅");
        fetchEmployees();
      } catch (err) {
        console.log(err);
        setStatus("AI Initialization Failed");
      }
    };

    loadModels();

    // Load previously logged-in employee
    const savedLogin = localStorage.getItem("loginTime");
    const savedEmployee = localStorage.getItem("activeEmployee");

    if (savedLogin && savedEmployee) {
      setLoginTime(Number(savedLogin));
      setMatchedEmployee(JSON.parse(savedEmployee));
    }

    return () => stopCamera();
  }, []);

  // ================= TIMER =================
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ================= FETCH EMPLOYEES =================
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5050/api/admin/onboarded-employees"
      );

      if (res.data?.employees) {
        const list = res.data.employees.map(emp => ({
          ...emp,
          faceDescriptor: new Float32Array(emp.faceDescriptor),
        }));

        setEmployees(list);
      }
    } catch (err) {
      console.log("Employee fetch error:", err);
    }
  };

  // ================= CAMERA =================
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraOn(true);
    } catch (err) {
      console.log("Camera error:", err);
      setStatus("Camera permission denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  // ================= FACE SCAN =================
  const scanFace = async () => {
    if (!videoRef.current) return null;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return null;
    return Array.from(detection.descriptor);
  };

  // ================= MATCH FACE =================
  const matchEmployee = descriptor => {
    for (let emp of employees) {
      const distance = faceapi.euclideanDistance(descriptor, emp.faceDescriptor);
      if (distance < 0.5) return emp;
    }
    return null;
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    if (matchedEmployee) {
      setStatus("Another employee is already logged in");
      return;
    }

    setLoading(true);
    setStatus("Scanning face...");
    await startCamera();

    let success = false;

    const interval = setInterval(async () => {
      const descriptor = await scanFace();

      if (descriptor && !success) {
        const emp = matchEmployee(descriptor);

        if (emp) {
          success = true;
          const login = Date.now();

          setMatchedEmployee(emp);
          setLoginTime(login);
          setPaused(false);
          setPauseStart(null);
          setTotalPaused(0);

          localStorage.setItem("loginTime", login);
          localStorage.setItem("activeEmployee", JSON.stringify(emp)); // store active employee

          setStatus("Login Successful ✅");
          clearInterval(interval);

          setTimeout(() => stopCamera(), 5000);
          setLoading(false);
        } else {
          setStatus("Face not registered");
        }
      }
    }, 300);

    setTimeout(() => {
      if (!success) {
        clearInterval(interval);
        stopCamera();
        setStatus("Face not detected");
        setLoading(false);
      }
    }, 6000);
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    if (!matchedEmployee || !loginTime) return;

    const logoutTime = Date.now();
    const diff = logoutTime - loginTime - totalPaused;

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    setLogoutSummary({
      login: new Date(loginTime).toLocaleTimeString(),
      logout: new Date(logoutTime).toLocaleTimeString(),
      total: `${hours}h ${minutes}m ${seconds}s`,
    });

    localStorage.removeItem("loginTime");
    localStorage.removeItem("activeEmployee"); // clear active employee

    setMatchedEmployee(null);
    setLoginTime(null);
    setPaused(false);
    setPauseStart(null);
    setTotalPaused(0);
    setStatus("Logged out");
  };

  // ================= PAUSE =================
  const handlePause = () => {
    if (!paused) {
      setPaused(true);
      setPauseStart(Date.now());
    }
  };

  // ================= RESUME =================
  const handleResume = () => {
    if (paused && pauseStart) {
      const pauseDuration = Date.now() - pauseStart;
      setTotalPaused(prev => prev + pauseDuration);
      setPaused(false);
      setPauseStart(null);
    }
  };

  // ================= WORK TIMER =================
  const getWorkingTime = () => {
    if (!loginTime) return "00:00:00";

    let diff = currentTime - loginTime - totalPaused;
    if (paused && pauseStart) diff -= currentTime - pauseStart;

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>TechNg Nexus 💙</h2>
        <p>{status}</p>

        <div style={styles.cameraBox}>
          <img
            src="/placeholder.png"
            alt="placeholder"
            style={{ ...styles.placeholder, display: cameraOn ? "none" : "block" }}
          />
          <video
            ref={videoRef}
            autoPlay
            muted
            width="320"
            height="240"
            style={{ ...styles.video, display: cameraOn ? "block" : "none" }}
          />
        </div>

        {matchedEmployee && (
          <p>
            Logged in as <b>{matchedEmployee.name}</b>
            <br />
            Employee ID: <b>{matchedEmployee.employeeId}</b>
          </p>
        )}

        <div style={styles.buttonGroup}>
          <button
            onClick={handleLogin}
            style={styles.button}
            disabled={loading || matchedEmployee}
          >
            {loading ? "Processing..." : "Login"}
          </button>
          <button onClick={handleLogout} style={styles.button} disabled={!matchedEmployee}>
            Logout
          </button>
        </div>
      </div>

      {!dashboardOpen && (
        <div style={styles.dashboardButton} onClick={() => setDashboardOpen(true)}>
          Dashboard
        </div>
      )}

      {dashboardOpen && (
        <div style={styles.dashboardPanel}>
          <div style={styles.dashboardHeader}>
            <b>Employee Dashboard</b>
            <button style={styles.closeBtn} onClick={() => setDashboardOpen(false)}>
              _
            </button>
          </div>

          {!loginTime && <p>No employee logged in</p>}

          {loginTime && (
            <>
              <div style={styles.row}>
                <span>Name</span>
                <b>{matchedEmployee?.name}</b>
              </div>
              <div style={styles.row}>
                <span>Employee ID</span>
                <b>{matchedEmployee?.employeeId}</b>
              </div>
              <div style={styles.row}>
                <span>Login Time</span>
                <b>{new Date(loginTime).toLocaleTimeString()}</b>
              </div>
              <div style={styles.row}>
                <span>Working</span>
                <b style={{ color: "#1565c0" }}>{getWorkingTime()}</b>
              </div>

              {!paused && <button style={styles.button} onClick={handlePause}>Pause</button>}
              {paused && <button style={styles.button} onClick={handleResume}>Resume</button>}
            </>
          )}
        </div>
      )}

      {logoutSummary && (
        <div style={styles.popup}>
          <h3>Work Summary</h3>
          <div style={styles.row}>
            <span>Login</span>
            <b>{logoutSummary.login}</b>
          </div>
          <div style={styles.row}>
            <span>Logout</span>
            <b>{logoutSummary.logout}</b>
          </div>
          <div style={styles.row}>
            <span>Total</span>
            <b style={{ color: "#1565c0" }}>{logoutSummary.total}</b>
          </div>
          <button style={styles.button} onClick={() => setLogoutSummary(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef4ff",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },
  cameraBox: {
    marginTop: "15px",
    width: "320px",
    height: "240px",
    margin: "0 auto",
    position: "relative",
  },
  placeholder: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    border: "2px solid #1565c0",
    borderRadius: "12px",
  },
  video: {
    position: "absolute",
    borderRadius: "12px",
    border: "2px solid #1565c0",
  },
  buttonGroup: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
    flexDirection: "column",
  },
  button: {
    padding: "10px",
    background: "#1565c0",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "8px",
  },
  dashboardButton: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#1565c0",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  dashboardPanel: {
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "280px",
    background: "#fff",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
  closeBtn: {
    border: "none",
    background: "#e53935",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    padding: "2px 8px",
  },
  popup: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
    width: "320px",
    textAlign: "center",
  },
};

export default FaceLogin;