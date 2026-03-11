const express = require("express");
const router = express.Router();
const User = require("../models/User");

// FACE LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { descriptor } = req.body;

    if (!descriptor) {
      return res.status(400).json({ message: "No face descriptor received" });
    }

    const users = await User.find();

    if (!users.length) {
      return res.status(404).json({ message: "No registered users found" });
    }

    let matchedUser = null;

    for (let user of users) {
      if (!user.faceDescriptor) continue;

      // Simple match check (basic comparison)
      const distance = Math.sqrt(
        user.faceDescriptor.reduce((sum, value, i) => {
          return sum + Math.pow(value - descriptor[i], 2);
        }, 0)
      );

      if (distance < 0.6) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ message: "Face not recognized" });
    }

    res.json({
      message: "Login successful",
      user: matchedUser,
    });

  } catch (error) {
    console.error("Face login error:", error);
    res.status(500).json({ message: "Server error during face login" });
  }
});

module.exports = router;