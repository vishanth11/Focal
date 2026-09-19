const bcrypt = require('bcryptjs');
const Company = require('../models/Company');
const Report = require('../models/Report');
const Check = require('../models/Check');
const env = require('../config/env');
const { generateToken } = require('../middleware/auth');
const { asyncHandler, buildTokenURI } = require('../utils/helpers');
const { verifyCompany } = require('../services/verificationService');
const {
  createVerificationHash,
  mintBadge,
  revokeBadge,
  updateBadgeURI
} = require('../services/blockchainService');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const emailMatches = email === env.adminEmail;
  const passwordMatches = env.adminPassword.startsWith('$2')
    ? await bcrypt.compare(password, env.adminPassword)
    : password === env.adminPassword;

  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  return res.json({
    success: true,
    data: {
      token: generateToken('omen-admin'),
      admin: { email: env.adminEmail, role: 'admin' }
    }
  });
});

const listAdminCompanies = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const companies = await Company.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: companies.length, data: companies });
});

const approveCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(404).json({ success: false, message: 'Company not found' });
  }
  if (company.status === 'verified') {
    return res.status(409).json({ success: false, message: 'Company is already verified' });
  }

  const verificationReport = await verifyCompany(company.toObject());
  const verificationHash = createVerificationHash(company);
  const tokenURI = buildTokenURI(company, verificationHash);
  const mintResult = await mintBadge(company.walletAddress, tokenURI);

  company.status = 'verified';
  company.verificationDate = new Date();
  company.verificationHash = verificationHash;
  company.tokenURI = tokenURI;
  company.tokenId = mintResult.tokenId || company.tokenId;
  company.mintTransactionHash = mintResult.transactionHash;
  company.verificationReport = verificationReport;
  await company.save();

  res.json({ success: true, data: { company, mint: mintResult, verificationReport } });
});

const rejectCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(404).json({ success: false, message: 'Company not found' });
  }

  company.status = 'rejected';
  company.rejectionReason = req.body.reason || 'Rejected by admin';
  await company.save();

  res.json({ success: true, data: company });
});

const revokeCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(404).json({ success: false, message: 'Company not found' });
  }
  if (!company.tokenId && company.tokenId !== 0) {
    return res.status(400).json({ success: false, message: 'Company does not have a token ID to revoke' });
  }

  const revokeResult = await revokeBadge(company.tokenId);
  const revokedURI = buildTokenURI(company, company.verificationHash || createVerificationHash(company), 'revoked');
  let updateResult = null;
  try {
    updateResult = await updateBadgeURI(company.tokenId, revokedURI);
  } catch (error) {
    updateResult = { warning: error.message };
  }

  company.status = 'revoked';
  company.revocationDate = new Date();
  company.revocationReason = req.body.reason || 'Revoked by admin';
  company.revokeTransactionHash = revokeResult.transactionHash;
  company.tokenURI = revokedURI;
  await company.save();

  res.json({ success: true, data: { company, revoke: revokeResult, update: updateResult } });
});

const listReports = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const reports = await Report.find(filter).populate('companyId').sort({ createdAt: -1 });
  res.json({ success: true, count: reports.length, data: reports });
});

const reviewReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }

  report.status = req.body.status;
  report.reviewNote = req.body.reviewNote;
  report.reviewedBy = req.user?.id || 'omen-admin';
  await report.save();

  res.json({ success: true, data: report });
});

const getStats = asyncHandler(async (req, res) => {
  const [companiesByStatus, reportsByStatus, totalChecks] = await Promise.all([
    Company.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Report.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Check.countDocuments()
  ]);

  res.json({
    success: true,
    data: {
      companiesByStatus,
      reportsByStatus,
      totalChecks
    }
  });
});

module.exports = {
  approveCompany,
  getStats,
  listAdminCompanies,
  listReports,
  login,
  rejectCompany,
  reviewReport,
  revokeCompany
};
