const { ethers } = require('ethers');
const env = require('./env');

const OMEN_BADGE_ABI = [
  'function mintBadge(address companyAddress, string tokenURI) returns (uint256)',
  'function revokeBadge(uint256 tokenId)',
  'function updateBadgeURI(uint256 tokenId, string newURI)',
  'function hasValidBadge(address companyAddress) view returns (bool)',
  'function getBadgeId(address companyAddress) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)'
];

function getProvider() {
  if (!env.rpcUrl) {
    throw new Error('RPC_URL is not configured');
  }
  return new ethers.JsonRpcProvider(env.rpcUrl);
}

function getSigner() {
  if (!env.adminPrivateKey) {
    throw new Error('ADMIN_PRIVATE_KEY is not configured');
  }
  return new ethers.Wallet(env.adminPrivateKey, getProvider());
}

function getContract() {
  if (!env.contractAddress || !ethers.isAddress(env.contractAddress)) {
    throw new Error('CONTRACT_ADDRESS is missing or invalid');
  }
  return new ethers.Contract(env.contractAddress, OMEN_BADGE_ABI, getSigner());
}

module.exports = {
  OMEN_BADGE_ABI,
  getProvider,
  getSigner,
  getContract
};
