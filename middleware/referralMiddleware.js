const referralService = require("../services/referralService");

// Middleware to handle user registration
async function userRegistrationHandler(req, res, next) {
  try {
    const { refereeEmail, userId } = req.body;
    const result = await referralService.handleUserRegistration(
      refereeEmail,
      userId
    );

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.status(200).json({
      message: "Referral status updated to USER_REGISTER",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in userRegistrationHandler:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Middleware to handle course purchase
async function coursePurchaseHandler(req, res, next) {
  try {
    const { refereeEmail } = req.body;
    const result = await referralService.handleCoursePurchase(refereeEmail);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.status(200).json({
      message: "Referral status updated to COURSE_PURCHASED",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in coursePurchaseHandler:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  userRegistrationHandler,
  coursePurchaseHandler,
};
