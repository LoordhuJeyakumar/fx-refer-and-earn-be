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

      // Check if the user already exists
      let user = await prisma.user.findUnique({
        where: {
          email: referrerEmail,
        },
      });

      // If the user does not exist, create a new user
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: referrerName,
            email: referrerEmail,
          },
        });
      }

      // Create a new referral in the database
      const newReferral = await prisma.referral.create({
        data: {
          referrerId: user.id,
          refereeName: refereeName,
          refereeEmail: refereeEmail,
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
