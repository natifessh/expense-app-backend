const router = require("express").Router();
const db = require("./database");
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"].split(' ')[1];
    if (!token) return res.status(403).json({ error: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
};
router.get("/all", authenticateToken, (req, res) => {
    const userId=req.user.id;
    const query = "SELECT * FROM expenses where user_id=$1";
    const values=[userId]
    db.query(query,values, (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(result.rows);
    });
});
router.get("/category/:category",authenticateToken, (req, res) => {
    const userId=req.user.id;
    const query = "SELECT * FROM expenses WHERE category = $1 AND user_id=$2";
    const values = [req.params.category,userId];
    
    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result.rows);
    });
});
router.get("/expense/:id",authenticateToken, (req, res) => {
    const userId=req.user.id;
    const query = "SELECT * FROM expenses WHERE id = $1 AND user_id=$2";
    const values = [req.params.id,userId];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.rows.length === 0) return res.status(404).json({ error: "Expense not found" });
        res.json(result.rows[0]);
    });
});
router.put("/update/:id", authenticateToken,(req, res) => {
    const userId=req.user.id;
    const { amt, category, description, date } = req.body;
    const query = `
        UPDATE expenses
        SET amount = $1, category = $2, description = $3, date = $4
        WHERE id = $5 AND user_id=$6
    `;
    const values = [amt, category, description, date, req.params.id,userId];

    db.query(query, values, (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        if (result.rowCount === 0) return res.status(404).json({ error: "Expense not found" });
        res.json({ message: "Expense updated successfully" });
    });
});
router.delete("/delete/:id", authenticateToken,(req, res) => {
    const userId=req.user.id;
    const query = "SELECT * FROM expenses WHERE id = $1 AND user_id=$2";
    const values = [req.params.id,userId];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.rows.length === 0) return res.status(404).json({ error: "Expense not found" });

        const deleteQuery = "DELETE FROM expenses WHERE id = $1 AND user_id=$2";
        db.query(deleteQuery, values, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Expense deleted successfully" });
        });
    });
});
router.post("/add", authenticateToken, (req, res) => {
    const userId=req.user.id;
    const { amt, category, description, date } = req.body;
    const query = `
        INSERT INTO expenses (amount, category, description, date,user_id)
        VALUES ($1, $2, $3, $4,$5)
        RETURNING id
    `;
    const values = [amt, category, description, date,userId];

    db.query(query, values, (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: "Expense added successfully", id: result.rows[0].id });
    });
});
router.get("/rank",authenticateToken,(req,res)=>{
    const query=`
    SELECT users.id AS user_id, users.username, COALESCE(SUM(expenses.amount), 0) AS total_spent
            FROM users
            LEFT JOIN expenses ON users.id = expenses.user_id
            GROUP BY users.id, users.username
            ORDER BY total_spent DESC;`
    db.query(query,(error,result)=>{
        if(error) return res.status(500).json({error:error.message})
        res.json(result.rows)
    })
})

module.exports = router;
