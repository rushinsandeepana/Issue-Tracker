const { pool } = require('../config/database');

class Notification {
    static async getUnreadCount(userId) {
        try {
            const [result] = await pool.execute(
                'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
                [userId]
            );
            return result[0].count;
        } catch (error) {
            console.error('Error:', error.message);
            return 0;
        }
    }
    
    static async findByUser(userId, page = 1, limit = 20, filter = 'all') {
        try {
            const offset = (page - 1) * limit;
            let whereClause = 'user_id = ?';
            
            if (filter === 'unread') {
                whereClause += ' AND is_read = FALSE';
            } else if (filter === 'read') {
                whereClause += ' AND is_read = TRUE';
            }
            
            const [notifications] = await pool.execute(
                `SELECT id, user_id, title, message, type, is_read as \`read\`, created_at
                FROM notifications 
                WHERE ${whereClause}
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?`,
                [userId, limit, offset]
            );
            
            const [countResult] = await pool.execute(
                `SELECT COUNT(*) as total FROM notifications WHERE ${whereClause}`,
                [userId]
            );
            
            return {
                notifications,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(countResult[0].total / limit),
                    totalItems: countResult[0].total,
                    itemsPerPage: limit
                }
            };
        } catch (error) {
            console.error('Error in findByUser:', error.message);
            return {
                notifications: [],
                pagination: {
                    currentPage: page,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: limit
                }
            };
        }
    }
    
    static async markAsRead(notificationId, userId) {
        try {
            const [result] = await pool.execute(
                'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
                [notificationId, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            return false;
        }
    }
    
    static async markAllAsRead(userId) {
        try {
            const [result] = await pool.execute(
                'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
                [userId]
            );
            return result.affectedRows;
        } catch (error) {
            return 0;
        }
    }
    
    static async delete(notificationId, userId) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM notifications WHERE id = ? AND user_id = ?',
                [notificationId, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            return false;
        }
    }
    
    static async create(notificationData) {
        try {
            const { user_id, title, message, type } = notificationData;
            const [result] = await pool.execute(
                `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
                [user_id, title, message, type || 'info']
            );
            return result.insertId;
        } catch (error) {
            console.error('Error:', error.message);
            return null;
        }
    }
}

module.exports = Notification;