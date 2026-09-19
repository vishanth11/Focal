const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

async function connectDB() {
  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(env.mongodbUri);
  logger.info(`MongoDB connected: ${connection.connection.host}`);
  return connection;
}

module.exports = connectDB;
