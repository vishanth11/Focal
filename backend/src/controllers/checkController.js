const Company = require('../models/Company');
const Check = require('../models/Check');
const { analyzeOpportunity } = require('../services/scamDetectionService');
const { hasValidBadge } = require('../services/blockchainService');
const { asyncHandler, normalizeDomain } = require('../utils/helpers');

async function matchCompany(input, inputType) {
  if (inputType === 'url') {
    return Company.findOne({ domain: normalizeDomain(input) });
  }
  if (inputType === 'email') {
    const domain = normalizeDomain(input.split('@').pop());
    return Company.findOne({ domain });
  }
  return Company.findOne({ $text: { $search: input } });
}

function resolveResult(company, isVerified, riskScore) {
  if (company?.status === 'revoked') return 'revoked';
  if (isVerified) return 'verified';
  if (!company && riskScore < 50) return 'not_found';
  return riskScore >= 50 ? 'suspicious' : 'not_found';
}

const checkOpportunity = asyncHandler(async (req, res) => {
  const { input } = req.body;
  const analysis = await analyzeOpportunity(input);
  const company = await matchCompany(input, analysis.inputType);
  const chainValid = company?.status === 'verified'
    ? await hasValidBadge(company.walletAddress)
    : false;
  const isVerified = Boolean(company && company.status === 'verified' && (chainValid || company.tokenId));
  const result = resolveResult(company, isVerified, analysis.riskScore);

  const redFlags = [...analysis.redFlags];
  if (company?.status === 'revoked') redFlags.push('Company badge has been revoked');
  if (!company) redFlags.push('No verified company record found');

  const check = await Check.create({
    input,
    inputType: analysis.inputType,
    companyId: company?._id,
    isVerified,
    riskScore: analysis.riskScore,
    redFlags,
    result
  });

  res.status(201).json({
    success: true,
    data: {
      check,
      company,
      confidence: analysis.confidence
    }
  });
});

const getHistory = asyncHandler(async (req, res) => {
  const checks = await Check.find().populate('companyId').sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, count: checks.length, data: checks });
});

module.exports = {
  checkOpportunity,
  getHistory
};
