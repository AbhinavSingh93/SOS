import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import mysql from "mysql2";
import jwt from "jsonwebtoken";
import fetch from 'node-fetch';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Replace with your MySQL root password
  database: "userdb", // Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Routes
// Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("Database error during registration:", err);
          return res.status(500).json({ message: "Error registering user." });
        }
        res.status(201).json({ message: "User registered successfully." });
      }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error occurred during registration." });
  }
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Database error during login:", err);
      return res.status(500).json({ message: "Error occurred during login." });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: "User not found." });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ id: user.id }, "your_secret_key", { expiresIn: "1h" });
      return res.status(200).json({ 
        message: "Login successful.", 
        token, 
        user: { id: user.id, name: user.name } 
      });
    } else {
      res.status(401).json({ message: "Invalid password." });
    }
  });
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided." });

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      const message = err.name === "TokenExpiredError" ? "Token expired." : "Invalid token.";
      return res.status(403).json({ message });
    }
    req.user = user;
    next();
  });
};

// Add SOS request
app.post("/sos", authenticateToken, (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude || typeof latitude !== "number" || typeof longitude !== "number") {
    return res.status(400).json({ message: "Invalid latitude or longitude." });
  }

  const userId = req.user.id;

  db.query(
    "INSERT INTO sos_requests (user_id, latitude, longitude) VALUES (?, ?, ?)",
    [userId, latitude, longitude],
    (err, result) => {
      if (err) {
        console.error("Database error during SOS request:", err);
        return res.status(500).json({ message: "Error saving SOS request." });
      }
      res.status(201).json({ message: "SOS request saved successfully." });
    }
  );
});

// Get SOS requests
app.get("/sos", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    SELECT 
      id, latitude, longitude, timestamp
    FROM sos_requests
    `,
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving SOS requests." });
      } else {
        res.status(200).json({ sosRequests: results });
      }
    }
  );
});

app.post("/getLocation", (req, res) => {
  const { lat, lng } = req.body;

  const apiURL = `http://api.positionstack.com/v1/forward?access_key=5080e1fe544d222e55cca14ccaee6132&query=${lat},${lng}`;

  fetch(apiURL)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
      console.error("Error fetching from PositionStack API:", error);
      res.status(500).json({ message: "Error retrieving data" });
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
