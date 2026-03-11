import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";

const FaceRegister = () => {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const [status, setStatus] = useState("Loading models...");

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

    setStatus("Models Loaded. Starting Camera...");
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStatus("Camera Started. Look straight...");
    } catch (error) {
      setStatus("Camera Permission Denied ❌");
    }
  };

  const handleVideoPlay = () => {
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current) return;

      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        clearInterval(intervalRef.current);
        setStatus("Face Captured. Saving...");

        const descriptor = Array.from(detection.descriptor);
        await saveFace(descriptor);
      }
    }, 2000);
  };

  const saveFace = async (descriptor) => {
    try {
      const response = await fetch(
        "http://localhost:5050/api/auth/register-face",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ descriptor }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("Face Registered Successfully ✅");
      } else {
        setStatus(data.message || "Registration Failed ❌");
      }
    } catch (error) {
      setStatus("Server Error ❌");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Face Registration</h2>
      <p>{status}</p>

      <video
        ref={videoRef}
        autoPlay
        muted
        width="400"
        height="300"
        onPlay={handleVideoPlay}
      />
    </div>
  );
};

export default FaceRegister;