const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDbStatus } = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const candidateRoutes = require('./src/routes/candidateRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const matchRoutes = require('./src/routes/matchRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
);

app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  const dbStatus = getDbStatus();
  const dbConnected = dbStatus === 'connected';

  res.status(dbConnected ? 200 : 503).json({
    ok: dbConnected,
    message: 'Resume Parser API is running',
    dbStatus,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/matches', matchRoutes);

app.use((error, _req, res, _next) => {
  if (error.name === 'MulterError') {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === 'Only PDF and DOCX files are allowed') {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: 'Internal server error', error: error.message });
});

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});

connectDB().catch((error) => {
  console.error('Initial database connection failed:', error.message);
  console.error('Tip: verify MONGO_URI and whitelist current IP in MongoDB Atlas Network Access.');
});
