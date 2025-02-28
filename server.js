require("dotenv").config();  // Load environment variables
console.log("server");
const db = require("./database");
const express = require("express");
const app = express();
const expenseRouter = require("./routes");
const authRoutes = require("./auth");
const cors = require("cors");

app.use("/nati-expense-app", express.static("./public"));
app.use(cors());
app.use(express.json());  // No need for bodyParser.json()

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/expenses', expenseRouter);
app.use("/auth", authRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
