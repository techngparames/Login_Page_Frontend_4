import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import * as tf from "@tensorflow/tfjs";

const FaceValidatorLogin = ({ onLoginSuccess }) => {
  const videoRef = useRef(null);

  const [status, setStatus] = useState("Initializing AI...");
  const [loading, setLoading] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);

  const [email, setEmail] = useState("");

  // ================= INIT MODELS =================
  useEffect(() => {
    const init = async () => {
      try {
        await tf.setBackend("webgl");
        await tf.ready();

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;

        setModelsReady(true);
        setStatus("Face Login Ready ✅");
      } catch (err) {
        console.error("AI Init Error:", err);
        setStatus("AI Initialization Failed ❌");
      }
    };

    init();
  }, []);

  // ================= FACE SCAN =================
  const scanFaceDescriptor = async () => {
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return null;
    return Array.from(detection.descriptor);
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    if (!modelsReady || loading) return;

    if (!email) {
      setStatus("Email required ❌");
      return;
    }

    setLoading(true);
    setStatus("Scanning face... 👀");

    try {
      const descriptor = await scanFaceDescriptor();
      if (!descriptor || descriptor.length !== 128) {
        setStatus("Face scan failed ❌");
        setLoading(false);
        return;
      }

      // Call backend login-face API
      const response = await fetch("http://localhost:5050/api/admin/login-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, faceDescriptor: descriptor }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Login Successful ✅");
        if (onLoginSuccess) onLoginSuccess(data.admin);
      } else {
        setStatus(data.message || "Login Failed ❌");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setStatus("Server Error ❌");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Admin Face Login 💙</h2>
        <p>{status}</p>

        <video
          ref={videoRef}
          autoPlay
          muted
          width="320"
          height="240"
          style={styles.video}
        />

        <input
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login with Face"}
        </button>
      </div>
    </div>
  );
};

// ================= STYLES =================
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
  video: {
    borderRadius: "12px",
    border: "2px solid #1565c0",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    background: "#1565c0",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default FaceValidatorLogin;