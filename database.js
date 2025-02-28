const { Client } = require('pg');

// Aiven PostgreSQL connection config
const config = {
    user: process.env.PG_USER, 
    password: process.env.PG_PASSWORD,  
    host: process.env.PG_HOST, 
    port:process.env.PG_PORT, 
    database: process.env.PG_DATABASE, 
    ssl: {
        rejectUnauthorized: false,
        ca: process.env.PG_SSL_CERT
    }
};

const client = new Client(config);
client.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.message);
    } else {
        
        console.log('Connected to PostgreSQL database');
        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `;

        const createExpensesTableQuery = `
            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                amount REAL NOT NULL,
                category TEXT NOT NULL,
                description TEXT,
                date TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;

        
        client.query(createUsersTableQuery, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                console.log('Users table already exists or was created successfully');
            }
        });

        client.query(createExpensesTableQuery, (err) => {
            if (err) {
                console.error('Error creating expenses table:', err.message);
            } else {
                console.log('Expenses table already exists or was created successfully');
            }
        });
    }
});

module.exports = client;
