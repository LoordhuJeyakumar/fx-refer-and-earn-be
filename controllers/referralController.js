const prisma = require("../config/prisma-client");

const referralController = {
  // Controller method to create a new referral
  createReferral: async function (req, res, next) {
    try {
      const {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        message,
      } = req.body;

      // Create a new referral in the database
      const newReferral = await prisma.referral.create({
        data: {
          referrerName,
          referrerEmail,
          refereeName,
          refereeEmail,
          status: "PENDING",
          reward: null,
        },
      });

      // Return the created referral with a 201 status
      return res.status(201).json({
        message: "New Referral created successfully",
        data: newReferral,
      });
    } catch (error) {
      next(error); // Pass error to error handling middleware
    }
  },
};

module.exports = referralController;
