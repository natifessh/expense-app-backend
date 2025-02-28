const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./database");  // PostgreSQL client
const router = express.Router();

// User Registration
router.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });

    bcrypt.hash(password, 10, (error, hashedPassword) => {
        if (error) return res.status(500).json({ error: "Error hashing password" });

        const query = "INSERT INTO users (username, password) VALUES ($1, $2)";
        const values = [username, hashedPassword];
        
        db.query(query, values, (error, result) => {
            if (error) {
                if (error.code === '23505') { // Duplicate key error (username already taken)
                    return res.status(400).json({ error: "Username already taken" });
                }
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ message: "User registered successfully" });
        });
    });
});

// User Login
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    const query = "SELECT * FROM users WHERE username = $1";
    const values = [username];

    db.query(query, values, (error, result) => {
        if (error || result.rows.length === 0) return res.status(401).json({ error: "Invalid username" });

        const user = result.rows[0];

        bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error || !isMatch) return res.status(401).json({ error: "Invalid username or password" });

            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.json({ message: "Login successful", token });
        });
    });
});

module.exports = router;
