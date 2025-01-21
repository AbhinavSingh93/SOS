import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import mysql from "mysql2";
import jwt from "jsonwebtoken";

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Replace with your MySQL root password
  database: "userdb", // Your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to the database");
  }
});

// Routes
// Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Error registering user." });
        } else {
          res.status(201).json({ message: "User registered successfully." });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error occurred during registration." });
  }
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error occurred during login." });
    } else if (results.length === 0) {
      res.status(401).json({ message: "User not found." });
    } else {
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id }, "your_secret_key", { expiresIn: "1h" });
        res.status(200).json({ 
          message: "Login successful.", 
          token, 
          user: { id: user.id, name: user.name } 
        });
      } else {
        res.status(401).json({ message: "Invalid password." });
      }
    }
  });
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
