// frontend/src/components/FaceValidator.js
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import * as tf from "@tensorflow/tfjs";

const FaceValidator = ({ onLoginSuccess }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Initializing AI...");
  const [loading, setLoading] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [descriptor, setDescriptor] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null); // ✅ for showing location info

  // ================= INIT MODELS =================
  useEffect(() => {
    const init = async () => {
      try {
        await tf.setBackend("webgl");
        await tf.ready();

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models")
        ]);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;

        setModelsReady(true);
        setStatus("Face Validator Ready ✅");
      } catch (err) {
        console.error(err);
        setStatus("AI Initialization Failed ❌");
      }
    };
    init();
  }, []);

  // ================= SCAN FACE =================
  const scanFaceDescriptor = async () => {
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return null;

    setDescriptor(Array.from(detection.descriptor));
    return Array.from(detection.descriptor);
  };

  // ================= FACE LOGIN =================
  const handleFaceLogin = async () => {
    if (!modelsReady || loading) return;
    setLoading(true);
    setStatus("Scanning face... 👀");

    try {
      const faceDesc = await scanFaceDescriptor();
      if (!faceDesc || faceDesc.length !== 128) {
        setStatus("Face scan failed ❌");
        setLoading(false);
        return;
      }

      // ✅ fetch current geolocation
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const response = await fetch("http://localhost:5050/api/admin/face-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ faceDescriptor: faceDesc, location: { lat: latitude, lng: longitude } })
          });

          const data = await response.json();
          if (data.success) {
            setStatus(`Login successful ✅`);
            setLoginInfo({
              distance: data.message.match(/\d+/)[0], // extract distance from message
              lat: latitude,
              lng: longitude
            });
            if (onLoginSuccess) onLoginSuccess(data.user);
          } else if (data.newUser) {
            setStatus("Face not recognized — please register ❌");
          } else {
            setStatus(data.message || "Login failed ❌");
          }
          setLoading(false);
        },
        (err) => {
          console.error("Location Error:", err);
          setStatus("Location access denied ❌");
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } catch (err) {
      console.error("Face Login Error:", err);
      setStatus("Server error ❌");
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Face Validator 🔐</h2>
        <p>{status}</p>

        <video ref={videoRef} autoPlay muted width="320" height="240" style={styles.video} />

        <button onClick={handleFaceLogin} style={styles.button}>
          {loading ? "Scanning..." : "Login with Face"}
        </button>

        {/* ✅ Display login location and distance */}
        {loginInfo && (
          <div style={{ marginTop: "15px", fontSize: "14px", color: "#333" }}>
            <p>Login Latitude: {loginInfo.lat.toFixed(5)}</p>
            <p>Login Longitude: {loginInfo.lng.toFixed(5)}</p>
            <p>Distance from TechNG: {loginInfo.distance} meters</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ================= STYLES =================
const styles = {
  page: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#eef4ff" },
  card: { background: "#fff", padding: "30px", borderRadius: "20px", width: "400px", textAlign: "center", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" },
  video: { borderRadius: "12px", border: "2px solid #1565c0" },
  button: { width: "100%", padding: "12px", marginTop: "15px", background: "#1565c0", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }
};

export default FaceValidator;