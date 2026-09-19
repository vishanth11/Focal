const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const {
  checkCompanyByDomain,
  checkCompanyByWallet,
  getCompany,
  listCompanies,
  registerCompany
} = require('../controllers/companyController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Company name is required'),
    body('email').isEmail().withMessage('Valid company email is required'),
    body('website').isURL({ require_protocol: true }).withMessage('Valid website URL is required'),
    body('walletAddress').matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Valid wallet address is required')
  ],
  validate,
  registerCompany
);

router.get('/', listCompanies);
router.get('/check', [query('domain').notEmpty().withMessage('domain is required')], validate, checkCompanyByDomain);
router.get('/status/:walletAddress', [param('walletAddress').matches(/^0x[a-fA-F0-9]{40}$/)], validate, checkCompanyByWallet);
router.get('/:id', [param('id').isMongoId().withMessage('Valid company ID is required')], validate, getCompany);

module.exports = router;
