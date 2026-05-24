const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'issue_tracker',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: process.env.NODE_ENV === 'production' ? 5 : 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ...(process.env.DB_SSL === 'true' && {
        ssl: {
            rejectUnauthorized: false
        }
    })
});

const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`MySQL Database connected successfully to ${process.env.DB_HOST || 'localhost'}`);
        connection.release();
        
        const [result] = await pool.query('SELECT 1 as test');
        console.log('Database test query successful');
        
        return true;
    } catch (error) {
        console.error('MySQL Database connection failed:', error.message);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        throw error;
    }
};

module.exports = { pool, initDatabase };