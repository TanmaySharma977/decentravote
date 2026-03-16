require('dotenv').config();
require('./config/env');

const express = require('express');
const cors = require('cors');

const authRoutes     = require('./routes/authRoutes');
const adminRoutes    = require('./routes/adminRoutes');
const electionRoutes = require('./routes/electionRoutes');
const voteRoutes     = require('./routes/voteRoutes');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://decentravote-mu.vercel.app/',
    /\.vercel\.app$/,
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/votes',     voteRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message || 'Server Error' });
});

module.exports = app;