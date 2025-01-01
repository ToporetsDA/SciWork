const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/User"); // Import User model and validation

// GET all users
router.get("/", async function (req, res) {
  try {
    const users = await User.find(); // Retrieve all users
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET user by id
router.get("/:id", async function (req, res) {
  try {
    const user = await User.findById(req.params.id); // Find user by _id
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// GET user by login
router.get("/login/:login", async function (req, res) {
  try {
    const user = await User.findOne({ login: req.params.login }); // Find user by login
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// POST a new user
router.post("/", async function (req, res) {
  try {
    // Validate incoming user data
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: "Validation error", details: error.details });
    }

    const validatedData = req.body; // You can use Joi to validate and then save the data
    const newUser = new User(validatedData);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error saving user:", error.message);
    res.status(500).json({ message: "Error saving user" });
  }
});

// PUT (update) user by ID
router.put("/:id", async function (req, res) {
  try {
    // Validate incoming user data
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: "Validation error", details: error.details });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Error updating user" });
  }
});

// DELETE user by ID
router.delete("/:id", async function (req, res) {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
