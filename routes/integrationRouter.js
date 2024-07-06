const referralMiddleware = require("../middleware/referralMiddleware");

const integrationRouter = require("express").Router();

// Route to handle user registration
integrationRouter.post(
  "/userRegistration",
  referralMiddleware.userRegistrationHandler
);

// Route to handle course purchase
integrationRouter.post(
  "/coursePurchase",
  referralMiddleware.coursePurchaseHandler
);

module.exports = integrationRouter;
