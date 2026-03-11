import React, { useRef } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const RegisterFace = () => {

  const videoRef = useRef(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });

    videoRef.current.srcObject = stream;
  };

  const handleRegisterFace = async () => {

    try {

      // ✅ Load TinyFaceDetector instead of SSD
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models")
      ]);

      const video = videoRef.current;

      // ✅ Use TinyFaceDetectorOptions
      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert("Face not detected");
        return;
      }

      const descriptor = Array.from(detection.descriptor);

      console.log("Descriptor length:", descriptor.length);

      await axios.post(
        "http://localhost:5050/api/auth/register",
        {
          faceDescriptor: descriptor
        }
      );

      alert("Face Registered Successfully");

    } catch (err) {
      console.log("Registration Error:", err);
      alert("Face registration failed");
    }
  };

  return (
    <div>
      <h2>Face Registration</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="300"
      />

      <br />

      <button onClick={startCamera}>
        Start Camera
      </button>

      <button onClick={handleRegisterFace}>
        Register Face
      </button>
    </div>
  );
};

export default RegisterFace;