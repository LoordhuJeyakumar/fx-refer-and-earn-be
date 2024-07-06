const referralController = require("../controllers/referralController");
const {
  validateReferralData,
  validateReferral,
} = require("../middleware/validate_referral");

const referralRouter = require("express").Router();

// Route to create a new referral
referralRouter.post(
  "/createReferral",
  validateReferralData, // Middleware to validate referral data
  validateReferral, // Middleware to check validation results
  referralController.createReferral // Controller method to handle referral creatio
);

module.exports = referralRouter;
