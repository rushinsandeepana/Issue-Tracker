const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Notification = require('../models/Notification');

router.get('/', authenticateToken, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const filter = req.query.filter || 'all';
        
        const result = await Notification.findByUser(req.user.id, page, limit, filter);
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            error: error.message
        });
    }
});

router.get('/unread-count', authenticateToken, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const unreadCount = await Notification.getUnreadCount(req.user.id);
        
        res.json({
            success: true,
            data: {
                unreadCount
            }
        });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch unread count',
            error: error.message
        });
    }
});

router.patch('/:id/read', authenticateToken, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const updated = await Notification.markAsRead(req.params.id, req.user.id);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        const notification = await Notification.findById(req.params.id, req.user.id);
        
        res.json({
            success: true,
            message: 'Notification marked as read',
            data: notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read',
            error: error.message
        });
    }
});

router.patch('/mark-all-read', authenticateToken, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const affectedRows = await Notification.markAllAsRead(req.user.id);
        
        res.json({
            success: true,
            message: 'All notifications marked as read',
            data: { affectedRows }
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark all notifications as read',
            error: error.message
        });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const deleted = await Notification.delete(req.params.id, req.user.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification',
            error: error.message
        });
    }
});

const createNotification = async (userId, title, message, type = 'info', relatedEntityType = null, relatedEntityId = null) => {
    try {
        const notificationId = await Notification.create({
            user_id: userId,
            title,
            message,
            type,
            related_entity_type: relatedEntityType,
            related_entity_id: relatedEntityId
        });
        return notificationId;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

module.exports = { router, createNotification };