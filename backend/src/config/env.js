const dotenv = require('dotenv');

dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET'];

function readEnv() {
  const env = {
    port: Number(process.env.PORT || 5000),
    nodeEnv: process.env.NODE_ENV || 'development',
    mongodbUri: process.env.MONGODB_URI,
    rpcUrl: process.env.RPC_URL,
    contractAddress: process.env.CONTRACT_ADDRESS,
    adminPrivateKey: process.env.ADMIN_PRIVATE_KEY,
    adminWalletAddress: process.env.ADMIN_WALLET_ADDRESS,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@omen.com',
    adminPassword: process.env.ADMIN_PASSWORD,
    mlApiUrl: process.env.ML_API_URL || 'http://localhost:8000/predict',
    phishTankApiKey: process.env.PHISHTANK_API_KEY,
    googleSafeBrowsingApiKey: process.env.GOOGLE_SAFE_BROWSING_API_KEY,
    whoisApiKey: process.env.WHOIS_API_KEY
  };

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length && process.env.NODE_ENV !== 'test') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (!env.adminPassword && process.env.NODE_ENV !== 'test') {
    throw new Error('Missing required environment variable: ADMIN_PASSWORD');
  }

  return env;
}

module.exports = readEnv();
