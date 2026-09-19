const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { checkOpportunity, getHistory } = require('../controllers/checkController');

const router = express.Router();

router.post(
  '/',
  [body('input').isLength({ min: 2 }).withMessage('Input must be at least 2 characters')],
  validate,
  checkOpportunity
);

router.get('/history', getHistory);

module.exports = router;
