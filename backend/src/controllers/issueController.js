const Issue = require('../models/Issue');
const { validationResult } = require('express-validator');

const createIssue = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const issueData = { ...req.body, user_id: req.userId };
        const issueId = await Issue.create(issueData);
        
        const issue = await Issue.findById(issueId, req.userId);
        
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
        
        const updated = await Issue.update(req.params.id, req.userId, req.body);
        
        if (!updated) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        
        const issue = await Issue.findById(req.params.id, req.userId);
        
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
        const deleted = await Issue.delete(req.params.id, req.userId);
        
        if (!deleted) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        
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