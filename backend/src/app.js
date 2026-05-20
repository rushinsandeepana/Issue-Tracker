const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDatabase } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Issue Tracker API running' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = async () => {
    try {
        await initDatabase();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;