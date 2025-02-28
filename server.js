require("dotenv").config();  
console.log("server");
const db = require("./database");
const express = require("express");
const app = express();
const expenseRouter = require("./routes");
const authRoutes = require("./auth");
const cors = require("cors");
app.use(cors());
app.use(express.json()); 
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use('/expenses', expenseRouter);
app.use("/auth", authRoutes);
app.listen(10000, () => {
    console.log("Server is running on port 3000");
});
