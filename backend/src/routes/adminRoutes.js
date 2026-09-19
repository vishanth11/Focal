const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  approveCompany,
  getStats,
  listAdminCompanies,
  listReports,
  login,
  rejectCompany,
  reviewReport,
  revokeCompany
} = require('../controllers/adminController');

const router = express.Router();
const adminOnly = [verifyToken, isAdmin];

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  login
);

router.get('/companies', adminOnly, listAdminCompanies);
router.post('/companies/:id/approve', adminOnly, [param('id').isMongoId()], validate, approveCompany);
router.post('/companies/:id/reject', adminOnly, [param('id').isMongoId(), body('reason').optional().isString()], validate, rejectCompany);
router.post('/companies/:id/revoke', adminOnly, [param('id').isMongoId(), body('reason').optional().isString()], validate, revokeCompany);
router.get('/reports', adminOnly, listReports);
router.post(
  '/reports/:id/review',
  adminOnly,
  [
    param('id').isMongoId(),
    body('status').isIn(['reviewed', 'accepted', 'rejected']),
    body('reviewNote').optional().isString()
  ],
  validate,
  reviewReport
);
router.get('/stats', adminOnly, getStats);

module.exports = router;
