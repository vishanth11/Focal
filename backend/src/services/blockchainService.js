const { ethers } = require('ethers');
const { getContract } = require('../config/blockchain');
const logger = require('../utils/logger');
const { hashObject } = require('../utils/helpers');

function parseTokenId(receipt) {
  for (const log of receipt.logs || []) {
    try {
      if (log.topics?.length >= 4) {
        return Number(BigInt(log.topics[3]));
      }
    } catch (error) {
      logger.warn('Could not parse token ID from log', { error: error.message });
    }
  }
  return null;
}

async function initializeContract() {
  const contract = getContract();
  await contract.runner.provider.getNetwork();
  return contract;
}

async function mintBadge(companyAddress, tokenURI) {
  try {
    if (!ethers.isAddress(companyAddress)) {
      throw new Error('Invalid company wallet address');
    }
    const contract = await initializeContract();
    const tx = await contract.mintBadge(companyAddress, tokenURI);
    const receipt = await tx.wait();
    return {
      transactionHash: receipt.hash,
      tokenId: parseTokenId(receipt)
    };
  } catch (error) {
    logger.error('mintBadge failed', { error: error.message });
    throw new Error(`Blockchain mint failed: ${error.message}`);
  }
}

async function revokeBadge(tokenId) {
  try {
    const contract = await initializeContract();
    const tx = await contract.revokeBadge(tokenId);
    const receipt = await tx.wait();
    return { transactionHash: receipt.hash };
  } catch (error) {
    logger.error('revokeBadge failed', { error: error.message, tokenId });
    throw new Error(`Blockchain revoke failed: ${error.message}`);
  }
}

async function updateBadgeURI(tokenId, newURI) {
  try {
    const contract = await initializeContract();
    const tx = await contract.updateBadgeURI(tokenId, newURI);
    const receipt = await tx.wait();
    return { transactionHash: receipt.hash };
  } catch (error) {
    logger.error('updateBadgeURI failed', { error: error.message, tokenId });
    throw new Error(`Blockchain URI update failed: ${error.message}`);
  }
}

async function hasValidBadge(companyAddress) {
  try {
    if (!ethers.isAddress(companyAddress)) {
      return false;
    }
    const contract = await initializeContract();
    return Boolean(await contract.hasValidBadge(companyAddress));
  } catch (error) {
    logger.warn('hasValidBadge failed', { error: error.message, companyAddress });
    return false;
  }
}

async function getBadgeDetails(companyAddress) {
  try {
    const contract = await initializeContract();
    const tokenId = await contract.getBadgeId(companyAddress);
    const tokenURI = await contract.tokenURI(tokenId);
    const isValid = await contract.hasValidBadge(companyAddress);
    return {
      tokenId: Number(tokenId),
      tokenURI,
      isValid: Boolean(isValid)
    };
  } catch (error) {
    logger.warn('getBadgeDetails failed', { error: error.message, companyAddress });
    return { tokenId: null, tokenURI: null, isValid: false };
  }
}

function createVerificationHash(companyData) {
  return hashObject({
    name: companyData.name,
    domain: companyData.domain,
    registrationNumber: companyData.registrationNumber,
    taxId: companyData.taxId,
    walletAddress: companyData.walletAddress
  });
}

module.exports = {
  createVerificationHash,
  getBadgeDetails,
  hasValidBadge,
  initializeContract,
  mintBadge,
  revokeBadge,
  updateBadgeURI
};
