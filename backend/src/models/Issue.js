const { pool } = require('../config/database');

class Issue {
    static async create(issueData) {
        const { title, description, status, priority, severity, user_id } = issueData;
        
        const [result] = await pool.execute(
            `INSERT INTO issues (title, description, status, priority, severity, user_id) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, description, status || 'open', priority || 'medium', severity || 'minor', user_id]
        );
        
        return result.insertId;
    }
    
    static async findAll(filters = {}, userId, page = 1, limit = 10) {
        let query = 'SELECT * FROM issues WHERE user_id = ?';
        const params = [userId];
        
        if (filters.status && filters.status !== 'all') {
            query += ' AND status = ?';
            params.push(filters.status);
        }
        
        if (filters.priority && filters.priority !== 'all') {
            query += ' AND priority = ?';
            params.push(filters.priority);
        }
        
        if (filters.search) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }
        
        const countQuery = query.replace('*', 'COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;
        
        const offset = (page - 1) * limit;
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        
        const [rows] = await pool.execute(query, params);
        
        return {
            issues: rows,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    
    static async findById(id, userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM issues WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    }
    
    static async update(id, userId, issueData) {
        const { title, description, status, priority, severity } = issueData;
        
        const [result] = await pool.execute(
            `UPDATE issues 
             SET title = COALESCE(?, title),
                 description = COALESCE(?, description),
                 status = COALESCE(?, status),
                 priority = COALESCE(?, priority),
                 severity = COALESCE(?, severity)
             WHERE id = ? AND user_id = ?`,
            [title, description, status, priority, severity, id, userId]
        );
        
        return result.affectedRows > 0;
    }
    
    static async delete(id, userId) {
        const [result] = await pool.execute(
            'DELETE FROM issues WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }
    
    static async getStatusCounts(userId) {
        const [rows] = await pool.execute(
            `SELECT status, COUNT(*) as count 
             FROM issues 
             WHERE user_id = ? 
             GROUP BY status`,
            [userId]
        );
        
        const counts = {
            open: 0,
            in_progress: 0,
            resolved: 0,
            closed: 0
        };
        
        rows.forEach(row => {
            counts[row.status] = row.count;
        });
        
        return counts;
    }
}

module.exports = Issue;