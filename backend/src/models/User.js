const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const { email, password, name } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            [email, hashedPassword, name]
        );
        
        return result.insertId;
    }
    
    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }
    
    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, email, name, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }
    
    static async validatePassword(user, password) {
        return await bcrypt.compare(password, user.password);
    }
}

module.exports = User;