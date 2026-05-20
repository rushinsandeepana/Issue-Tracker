const express = require('express');
const { body } = require('express-validator');
const {
    createIssue,
    getIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    getStatusCounts
} = require('../controllers/issueController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.post(
    '/',
    [
        body('title').notEmpty().trim().isLength({ min: 3, max: 255 }),
        body('description').optional().trim(),
        body('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed']),
        body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
        body('severity').optional().isIn(['minor', 'major', 'critical', 'blocker'])
    ],
    createIssue
);

router.get('/', getIssues);
router.get('/status-counts', getStatusCounts);
router.get('/:id', getIssueById);
router.put('/:id', updateIssue);
router.delete('/:id', deleteIssue);

module.exports = router;