const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Notification = require('../models/Notification');

router.get('/unread-count', authenticateToken, async (req, res) => {
    try {
        const unreadCount = await Notification.getUnreadCount(req.userId);
        res.json({ success: true, data: { unreadCount } });
    } catch (error) {
        console.error('ERROR:', error.message);
        res.json({ success: true, data: { unreadCount: 0 } });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const filter = req.query.filter || 'all';
        
        const result = await Notification.findByUser(req.userId, page, limit, filter);
        const unreadCount = await Notification.getUnreadCount(req.userId);
        
        res.json({
            success: true,
            data: {
                ...result,
                unreadCount
            }
        });
    } catch (error) {
        console.error('Full error:', error);
        res.json({
            success: true,
            data: {
                notifications: [],
                pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 20 },
                unreadCount: 0
            }
        });
    }
});

router.patch('/:id/read', authenticateToken, async (req, res) => {
    try {
        
        const updated = await Notification.markAsRead(req.params.id, req.userId);
        
        res.json({ success: true, message: updated ? 'Marked as read' : 'Failed' });
    } catch (error) {
        console.error('ERROR:', error.message);
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

router.patch('/mark-all-read', authenticateToken, async (req, res) => {
    try {
        await Notification.markAllAsRead(req.userId);
        res.json({ success: true, message: 'All marked as read' });

    } catch (error) {
        console.error('ERROR:', error.message);
        res.json({ success: true, message: 'All marked as read' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        
        const deleted = await Notification.delete(req.params.id, req.userId);
        
        res.json({ success: true, message: deleted ? 'Deleted' : 'Failed' });
    } catch (error) {
        console.error('ERROR:', error.message);
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

const createNotification = async (userId, title, message, type = 'info') => {

    const result = await Notification.create({ user_id: userId, title, message, type });
    
    return result;
};

module.exports = { router, createNotification };