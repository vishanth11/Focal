const Company = require('../models/Company');
const { hasValidBadge, getBadgeDetails } = require('../services/blockchainService');
const { asyncHandler, normalizeDomain } = require('../utils/helpers');

const registerCompany = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    domain: normalizeDomain(req.body.domain || req.body.website)
  };

  const company = await Company.create(payload);
  res.status(201).json({ success: true, data: company });
});

const listCompanies = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const companies = await Company.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: companies.length, data: companies });
});

const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(404).json({ success: false, message: 'Company not found' });
  }
  return res.json({ success: true, data: company });
});

const checkCompanyByDomain = asyncHandler(async (req, res) => {
  const domain = normalizeDomain(req.query.domain || '');
  if (!domain) {
    return res.status(400).json({ success: false, message: 'domain query parameter is required' });
  }

  const company = await Company.findOne({ domain });
  if (!company) {
    return res.json({ success: true, data: { found: false, domain, isVerified: false } });
  }

  const chainValid = company.status === 'verified'
    ? await hasValidBadge(company.walletAddress)
    : false;

  return res.json({
    success: true,
    data: {
      found: true,
      company,
      isVerified: company.status === 'verified' && (chainValid || Boolean(company.tokenId))
    }
  });
});

const checkCompanyByWallet = asyncHandler(async (req, res) => {
  const company = await Company.findOne({
    walletAddress: new RegExp(`^${req.params.walletAddress}$`, 'i')
  });
  const badge = await getBadgeDetails(req.params.walletAddress);

  res.json({
    success: true,
    data: {
      company,
      badge,
      isVerified: Boolean(company && company.status === 'verified' && (badge.isValid || company.tokenId))
    }
  });
});

module.exports = {
  checkCompanyByDomain,
  checkCompanyByWallet,
  getCompany,
  listCompanies,
  registerCompany
};
