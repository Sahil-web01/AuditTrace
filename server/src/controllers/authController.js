import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "audittrace_secret_key_2026";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Auto-seed demo accounts if not already present
export const ensureDemoUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.create([
        {
          name: "Sarah Jenkins",
          email: "auditor@audittrace.com",
          password: "AuditTrace2026!",
          role: "auditor",
          companyName: "AuditTrace Assurance"
        },
        {
          name: "David Vance",
          email: "owner@acme.com",
          password: "AuditTrace2026!",
          role: "owner",
          companyName: "Acme Enterprises Inc"
        }
      ]);
      console.log("Demo users initialized in database.");
    }
  } catch (err) {
    console.error("Demo user seed note:", err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    await ensureDemoUsers();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "auditor",
      companyName: companyName || "Acme MSME Ltd"
    });

    const token = generateToken(user);
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
