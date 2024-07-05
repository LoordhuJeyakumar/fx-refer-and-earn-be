const { check, validationResult } = require("express-validator");

// Define validation rules for referral data
const validateReferralData = [
  check("referrerName")
    .exists()
    .withMessage("Referrer name is required")
    .isLength({ min: 2 })
    .withMessage("Referrer name cannot be empty"),
  check("referrerEmail")
    .exists()
    .withMessage("Referrer email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("refereeName")
    .exists()
    .withMessage("Referee name is required")
    .isLength({ min: 2 })
    .withMessage("Referee name cannot be empty"),
  check("refereeEmail")
    .exists()
    .withMessage("Referee email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("message")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Message cannot be longer than 500 characters"),
];

// Middleware to handle validation results
const validateReferral = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If validation errors exist, return a 400 response with the errors
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = { validateReferralData, validateReferral };
