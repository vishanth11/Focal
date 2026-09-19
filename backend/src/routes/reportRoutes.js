const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { getReportsForCompany, submitReport } = require('../controllers/reportController');

const router = express.Router();

router.post(
  '/',
  [
    body('companyName').if(body('companyId').not().exists()).notEmpty().withMessage('companyName is required when companyId is absent'),
    body('companyId').optional().isMongoId(),
    body('reporterEmail').isEmail(),
    body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('evidenceUrl').optional({ checkFalsy: true }).isURL({ require_protocol: true })
  ],
  validate,
  submitReport
);

router.get('/company/:companyId', [param('companyId').isMongoId()], validate, getReportsForCompany);

module.exports = router;
