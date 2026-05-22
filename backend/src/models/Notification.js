const { pool } = require('../config/database');

class Notification {
    static async create(notificationData) {
        const { user_id, title, message, type, related_entity_type, related_entity_id } = notificationData;
        
        const [result] = await pool.execute(
            `INSERT INTO notifications 
             (user_id, title, message, type, related_entity_type, related_entity_id) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, title, message, type || 'info', related_entity_type || null, related_entity_id || null]
        );
        
        return result.insertId;
    }
    
    static async findByUser(userId, page = 1, limit = 20, filter = 'all') {
        const offset = (page - 1) * limit;
        let whereClause = 'user_id = ?';
        
        if (filter === 'unread') {
            whereClause += ' AND is_read = FALSE';
        } else if (filter === 'read') {
            whereClause += ' AND is_read = TRUE';
        }
        
        const [notifications] = await pool.execute(
            `SELECT id, user_id, title, message, type, is_read as read, 
                    related_entity_type, related_entity_id, created_at
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
        
        const [unreadResult] = await pool.execute(
            'SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );
        
        return {
            notifications,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(countResult[0].total / limit),
                totalItems: countResult[0].total,
                itemsPerPage: limit
            },
            unreadCount: unreadResult[0].unread
        };
    }
    
    static async getUnreadCount(userId) {
        const [result] = await pool.execute(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );
        return result[0].count;
    }
    
    static async markAsRead(notificationId, userId) {
        const [result] = await pool.execute(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );
        return result.affectedRows > 0;
    }
    
    static async markAllAsRead(userId) {
        const [result] = await pool.execute(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );
        return result.affectedRows;
    }
    
    static async delete(notificationId, userId) {
        const [result] = await pool.execute(
            'DELETE FROM notifications WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );
        return result.affectedRows > 0;
    }
    
    static async deleteOldNotifications(days = 30) {
        const [result] = await pool.execute(
            'DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY) AND is_read = TRUE',
            [days]
        );
        return result.affectedRows;
    }
    
    static async findById(notificationId, userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );
        return rows[0];
    }
}

module.exports = Notification;