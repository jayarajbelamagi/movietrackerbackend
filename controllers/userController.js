const User = require("../models/User");

// ➕ Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔑 Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Store userId in session for movie controller to use
    req.session.userId = user._id;

    res.json({ message: "Login successful", userId: user._id, username: user.username });
  } catch (err) {
    console.error("❌ Error logging in:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🚪 Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Error logging out:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.json({ message: "Logged out successfully" });
  });
};
