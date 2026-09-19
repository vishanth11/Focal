const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const { initializeContract } = require('./services/blockchainService');
const logger = require('./utils/logger');

let server;

async function start() {
  await connectDB();

  try {
    await initializeContract();
    logger.info('Blockchain contract initialized');
  } catch (error) {
    logger.warn('Blockchain initialization skipped', { reason: error.message });
  }

  server = app.listen(env.port, () => {
    logger.info(`OMEN backend running on port ${env.port}`);
  });
}

function shutdown(signal) {
  logger.info(`${signal} received, shutting down`);
  if (server) {
    server.close(() => process.exit(0));
    return;
  }
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start().catch((error) => {
  logger.error('Failed to start server', { error: error.message });
  process.exit(1);
});
