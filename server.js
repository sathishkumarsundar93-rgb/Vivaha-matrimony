require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/profiles',  require('./routes/profiles'));
app.use('/api/interests', require('./routes/interests'));
app.use('/api/user',      require('./routes/user'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', app: 'VivahMatch' }));

// Catch-all: serve frontend for any non-API route (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 VivahMatch server running on port ${PORT}`));
