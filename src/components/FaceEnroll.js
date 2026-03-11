// frontend/src/components/FaceEnroll.js
import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "@vladmandic/face-api";
import axios from "axios";

const FaceEnroll = ({ name, email, empId, onRegisterSuccess }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [status, setStatus] = useState("");
  const [descriptor, setDescriptor] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      setStatus("Loading models...");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setStatus("Models loaded ✅");
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    setCameraOn(true);
    setCaptured(false);
    setStatus("Camera starting...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setStatus("Camera on. Click Capture Face.");
    } catch (err) {
      console.error(err);
      setStatus("Camera access denied ❌");
      setCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setStatus("Canvas not ready ❌");
      return;
    }
    setStatus("Detecting face...");
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setStatus("Face not detected ❌");
        return;
      }

      setDescriptor(Array.from(detection.descriptor));

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setStatus("Canvas context error ❌");
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      setCaptured(true);
      setStatus("Face captured ✅");
      stopCamera();
    } catch (err) {
      console.error(err);
      setStatus("Face detection failed ❌");
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !empId || !descriptor) {
      setStatus("Fill all fields and capture face ❌");
      return;
    }

    setStatus("Registering...");
    try {
      const res = await axios.post("http://localhost:5050/api/admin/register-employee", {
        name,
        email,
        employeeId: empId,
        faceDescriptor: descriptor, // array of 128 floats
      });

      if (res.data.success) {
        setStatus("Registration successful ✅");
        setCaptured(false);
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        onRegisterSuccess();
      } else {
        setStatus(res.data.message || "Registration failed ❌");
      }
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        {!cameraOn && !captured && <img src="/placeholder.png" alt="placeholder" width="250" />}
        {cameraOn && !captured && <video ref={videoRef} width="250" height="200" autoPlay />}
        <canvas
          ref={canvasRef}
          width="250"
          height="200"
          style={{ display: captured ? "block" : "none", margin: "0 auto" }}
        />
      </div>

      {!cameraOn && !captured && (
        <button onClick={startCamera} style={styles.button}>
          Scan Face
        </button>
      )}
      {cameraOn && !captured && (
        <button onClick={handleCapture} style={styles.button}>
          Capture Face
        </button>
      )}
      {captured && (
        <button onClick={handleRegister} style={styles.button}>
          Register Employee
        </button>
      )}

      {status && (
        <p style={{ color: status.includes("✅") ? "green" : "red", marginTop: "10px" }}>
          {status}
        </p>
      )}
    </div>
  );
};

const styles = {
  button: {
    margin: "5px",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#1565c0",
    color: "white",
    fontWeight: "bold",
  },
};

export default FaceEnroll;