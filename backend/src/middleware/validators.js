const { body, param, validationResult } = require('express-validator');

const idParam = (name) => param(name).isMongoId().withMessage(`Invalid ${name}`);

const hasSkillInput = (value) => {
  if (Array.isArray(value)) {
    return value.some((item) => String(item || '').trim().length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .some(Boolean);
  }

  return false;
};

const registerValidation = [
  body('username').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const jobPayloadValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('requiredSkills')
    .custom(hasSkillInput)
    .withMessage('At least one required skill is required'),
];

const shortlistValidation = [
  body('shortlisted')
    .optional()
    .isBoolean()
    .withMessage('shortlisted must be a boolean')
    .toBoolean(),
];

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    message: 'Validation failed',
    errors: errors.array().map((item) => ({
      field: item.path,
      message: item.msg,
    })),
  });
};

module.exports = {
  idParam,
  registerValidation,
  loginValidation,
  jobPayloadValidation,
  shortlistValidation,
  runValidation,
};
