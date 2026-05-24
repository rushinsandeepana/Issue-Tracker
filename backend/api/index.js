const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { initDatabase } = require('../src/config/database');

const authRoutes = require('../src/routes/authRoutes');
const issueRoutes = require('../src/routes/issueRoutes');
const { router: notificationRoutes } = require('../src/routes/notificationRoutes');

dotenv.config();

initDatabase();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use('/api/issues', issueRoutes);

app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Issue Tracker API running'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running on Vercel'
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: 'Something went wrong!'
    });
});

module.exports = app;