const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing in environment variables');
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 8000,
  });
  console.info('MongoDB connected');
};

const getDbStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

const isDbConnected = () => getDbStatus() === 'connected';

module.exports = { connectDB, getDbStatus, isDbConnected };
