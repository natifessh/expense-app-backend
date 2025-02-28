const { Client } = require('pg');

// Aiven PostgreSQL connection config
const config = {
    user: "avnadmin",  // Your Aiven PostgreSQL username
    password: "AVNS_XR6E-AOjxYhKcS5Gzwx",  // Your Aiven PostgreSQL password
    host: "pg-1f101fb4-natitesfaldet111-3f74.i.aivencloud.com",  // Your Aiven PostgreSQL host
    port: 24910,  // Port for Aiven PostgreSQL
    database: "defaultdb",  // Your database name
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIETTCCArWgAwIBAgIUIbOh+OKvgLY7hdXbgrI7D1m6d08wDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1ZDgyZjIzMjItMWZiMy00OGM2LWJlMWEtMjkzNzMzMGNm
ZWVmIEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwMjIyMTUxNjQ3WhcNMzUwMjIwMTUx
NjQ3WjBAMT4wPAYDVQQDDDVkODJmMjMyMi0xZmIzLTQ4YzYtYmUxYS0yOTM3MzMw
Y2ZlZWYgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBAMjfzc6SVLuHa2c2IHfOrMhRnt8pLfns0X5Tf6lE4WvTF2nYLUy8h6My
jvrXRaOFKqEoF2aRagAImBmceycDjqohe3UaEa8s20DrGK/dsopF6kjpOuEBgsbD
YKZIt24u0bOjLXgPlwOnie4hgBkkLGcFiZgVgEk5Ehtv0BDixpWXIxzldRtvDO34
P9HWJD2nK8OhtbaH4XtOQWsajywzEnwysol/wH7yiQBUfNf/YlHNcSaxYrAccH1h
FenAjv35m4GalGo3USRyKMZU7HcgJ8YRQ2iKGqcwXk6NWGq25C1NWcvtFFEckVT9
LYDL+f2UDBa/mZnxvg1wfvyHLCg/wojPkXvXzoxjavwxk+o57nCA+VzWugyXDFMf
IOaCdWArAVa+slwjpm3R7vO8tLqj2n6ue3c9rDIcSVTdKTUzZw9s6n6w9hNRvCcE
rMUnkCQpD27t9+esrhdYSpU/0DohjdlAShx+kOAlPqlHJqqmxpBR5UA1cO/zhAA8
D1S/XG8ltwIDAQABoz8wPTAdBgNVHQ4EFgQUSFQpKaUxlFS0vMDa9Pkbv8uUQ4cw
DwYDVR0TBAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGB
AMJAtfGF2KbdHZD/qz/3pnEKigfv+S4QbGUVk0DZIcQd30RCdG/CGXXw/vSIkfkW
LQ6sIK0DbydEppqJSBqwMrHzioAxIP1jrNyTur7LJSTid1KsWb8xax2KRsN1XcOf
SK95OTsAV3cwj67fIbOqpkSSLNRj0urbFVV0GsBnOo5SS97nLZRVJv7WLSqKy1YX
beMnoG5RkfYNJlBXF14RU1EUvbh1zyD0/NCKnpHZQxJiaVHX1K3JcUwcx8W+BzlL
CkBCRyoP31soAygdejkop3Y2W5eWaIUXj4N+b2vAT0HZPS9WZYcCuw5TpI60yjx/
Zc1xmhnPcxDdJCxIb617KP9OfywkqfI8/VYVSQgq80rXnor2v6jlHMzH3CQDt8Qx
pCfL3SQnCwqDlbUL2fHKG5Io0PX88LpzIyzSY4m9hv746hYea2eZ8rkrF2UMyvmZ
OumBedgYpOOsfdoLeamjJoNXPSRWaXz/PboYXw3oa1ttIMcFYQNDC0VIRWs04PfK
Qw==
-----END CERTIFICATE-----`
    }
};

const client = new Client(config);

// Connect to PostgreSQL
client.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.message);
    } else {
        console.log('Connected to PostgreSQL database');

        // Create tables only if they do not exist
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

        // Execute the queries to create tables if they don't exist
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
