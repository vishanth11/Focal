const Company = require('../models/Company');
const Report = require('../models/Report');
const { asyncHandler } = require('../utils/helpers');

const submitReport = asyncHandler(async (req, res) => {
  let company = null;
  if (req.body.companyId) {
    company = await Company.findById(req.body.companyId);
  }

  const report = await Report.create({
    companyId: company?._id,
    companyName: req.body.companyName || company?.name,
    reporterEmail: req.body.reporterEmail,
    reporterName: req.body.reporterName,
    evidenceUrl: req.body.evidenceUrl,
    description: req.body.description
  });

  res.status(201).json({ success: true, data: report });
});

const getReportsForCompany = asyncHandler(async (req, res) => {
  const reports = await Report.find({ companyId: req.params.companyId }).sort({ createdAt: -1 });
  res.json({ success: true, count: reports.length, data: reports });
});

module.exports = {
  getReportsForCompany,
  submitReport
};
