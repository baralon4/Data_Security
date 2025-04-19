const db = require("../models/db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const transporter = require("../utils/email");
require("dotenv").config();

//register
exports.registerUser = (req, res) => {
  const {
    id,
    username,
    password,
    email,
    role,
    first_name,
    last_name
  } = req.body;

  if (!id || !username || !password || !email || !role || !first_name || !last_name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  //sha256
  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  const sql = `
    INSERT INTO users (id, username, password, email, role, first_name, last_name)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [id, username, hashedPassword, email, role, first_name, last_name], (err, result) => {
    if (err) {
      console.error("Error inserting user:", err.message);
      return res.status(500).json({ error: "Registration failed" });
    }
    return res.status(201).json({ message: "User registered successfully" });
  });
};

//login
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  //Check if there's a user in the database with the matching username and encrypted password
  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, hashedPassword], (err, results) => {
    if (err) {
      console.error("Login error:", err.message);
      return res.status(500).json({ error: "Login failed" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }


    const user = results[0];
    const { password, reset_token, token_expiration, ...safeUser } = user;
    return res.json({ message: "Login successful", userData: safeUser })
  });
};

//forgot password
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "Email not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 3600000);

    const updateSql = "UPDATE users SET reset_token = ?, token_expiration = ? WHERE email = ?";
    db.query(updateSql, [token, expiration, email], (err) => {
      if (err) return res.status(500).json({ error: "Could not save token" });

      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

      const mailOptions = {
        from: "your_email@gmail.com",
        to: email,
        subject: "Password Reset",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email error:", error);
          return res.status(500).json({ error: "Failed to send email" });
        }

        return res.status(200).json({ message: "Reset link sent to email" });
      });
    });
  });
};

//reset password
exports.resetPassword = (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required" });
  }

  const hashedPassword = crypto.createHash("sha256").update(newPassword).digest("hex");
  const checkSql = `
    SELECT * FROM users 
    WHERE reset_token = ? AND token_expiration > NOW()
  `;

  db.query(checkSql, [token], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(400).json({ error: "Invalid or expired token" });

    const updateSql = `
      UPDATE users 
      SET password = ?, reset_token = NULL, token_expiration = NULL 
      WHERE reset_token = ?
    `;

    db.query(updateSql, [hashedPassword, token], (err) => {
      if (err) return res.status(500).json({ error: "Failed to reset password" });

      return res.status(200).json({ message: "Password updated successfully" });
    });
  });
};