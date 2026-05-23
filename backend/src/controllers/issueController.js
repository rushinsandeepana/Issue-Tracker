const Issue = require('../models/Issue');
const { validationResult } = require('express-validator');
const { createNotification } = require('../routes/notificationRoutes');

const createIssue = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const issueData = { ...req.body, user_id: req.userId };
        const issueId = await Issue.create(issueData);
        
        const issue = await Issue.findById(issueId, req.userId);
        
        await createNotification(
            req.userId,
            'Issue Created',
            `You created a new issue: "${issue.title}"`,
            'success'
        );
        
        res.status(201).json({
            message: 'Issue created successfully',
            issue
        });
    } catch (error) {
        console.error('Create issue error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getIssues = async (req, res) => {
    try {
        const { status, priority, search, page = 1, limit = 10 } = req.query;
        
        const filters = { status, priority, search };
        const result = await Issue.findAll(filters, req.userId, parseInt(page), parseInt(limit));
        
        const statusCounts = await Issue.getStatusCounts(req.userId);
        
        res.json({
            issues: result.issues,
            pagination: {
                page: result.page,
                totalPages: result.totalPages,
                total: result.total,
                hasMore: result.page < result.totalPages
            },
            statusCounts
        });
    } catch (error) {
        console.error('Get issues error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id, req.userId);
        
        if (!issue) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        
        res.json(issue);
    } catch (error) {
        console.error('Get issue error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateIssue = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const oldIssue = await Issue.findById(req.params.id, req.userId);
        
        const updated = await Issue.update(req.params.id, req.userId, req.body);
        
        if (!updated) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        
        const issue = await Issue.findById(req.params.id, req.userId);
        
        let updateMessage = `You updated issue: "${issue.title}"`;
        
        if (req.body.status && req.body.status !== oldIssue.status) {
            updateMessage += `\nStatus changed from ${oldIssue.status} to ${req.body.status}`;
        }
        if (req.body.priority && req.body.priority !== oldIssue.priority) {
            updateMessage += `\nPriority changed from ${oldIssue.priority} to ${req.body.priority}`;
        }
        
        await createNotification(
            req.userId,
            'Issue Updated',
            updateMessage,
            'info'
        );
        
        if (req.body.status === 'resolved' && oldIssue.status !== 'resolved' && oldIssue.user_id !== req.userId) {
            await createNotification(
                oldIssue.user_id,
                'Issue Resolved',
                `Your issue "${issue.title}" has been resolved`,
                'success'
            );
        }
        
        res.json({
            message: 'Issue updated successfully',
            issue
        });
    } catch (error) {
        console.error('Update issue error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id, req.userId);
        
        if (!issue) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        
        const deleted = await Issue.delete(req.params.id, req.userId);
        
        if (!deleted) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        
        await createNotification(
            req.userId,
            'Issue Deleted',
            `You deleted issue: "${issue.title}"`,
            'warning'
        );
        
        res.json({ message: 'Issue deleted successfully' });
    } catch (error) {
        console.error('Delete issue error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getStatusCounts = async (req, res) => {
    try {
        const counts = await Issue.getStatusCounts(req.userId);
        res.json(counts);
    } catch (error) {
        console.error('Get status counts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createIssue,
    getIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    getStatusCounts
};