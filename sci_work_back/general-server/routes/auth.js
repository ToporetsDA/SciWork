const express = require("express");
const router = express.Router();
const User = require("../models/User");

const { getWebSocketByLogin } = require("../websockets");
const loggedInUsers = new Set();

// POST: login
router.post("/login", async (req, res) => {
  const { login, password } = req.body; // Use login and password from the client

  try {
    const user = await User.findOne({ login, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user already logged in
    if (loggedInUsers.has(login)) {
      return res.status(401).json({ message: "User is already logged in" });
    }

    // Add user to logged-in users list
    loggedInUsers.add(login);

    // Get WebSocket connection for logged-in user
    const ws = getWebSocketByLogin(login); // Fetch the specific WebSocket by user login
    if (ws) {
      ws.send(JSON.stringify({ message: "Login successful", login }));
    } else {
      console.error("WebSocket client not found for user:", login);
    }

    return res.status(200).json({ message: "Login successful", login });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
