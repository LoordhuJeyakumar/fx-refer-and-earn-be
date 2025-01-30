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

const referralMiddleware = {
  userRegistrationHandler: async function (req, res, next) {
    try {
      const { refereeEmail, userId } = req.body;

      // Find pending referral
      const referral = await prisma.referral.findFirst({
        where: {
          refereeEmail,
          status: "PENDING",
          expiresAt: { gt: new Date() },
        },
        include: {
          referrer: true,
        },
      });

      if (!referral) {
        return res.status(404).json({
          message: "No valid referral found",
        });
      }

      // Update referral status
      const updatedReferral = await prisma.referral.update({
        where: { id: referral.id },
        data: {
          status: "USER_REGISTERED",
          refereeId: userId,
          registrationDate: new Date(),
        },
      });

      // Update referral stats
      await prisma.referralStats.update({
        where: { userId: referral.referrerId },
        data: {
          pendingReferrals: { decrement: 1 },
        },
      });

      // Send notification email
      const emailService = new EmailService(req.app.locals.emailConfig);
      await emailService.sendReferralStatusUpdateEmail(referral.referrer, {
        status: "registered",
        refereeName: referral.refereeName,
      });

      return res.status(200).json({
        message: "Referral status updated to USER_REGISTERED",
        data: updatedReferral,
      });
    } catch (error) {
      next(error);
    }
  },

  coursePurchaseHandler: async function (req, res, next) {
    try {
      const { refereeEmail, courseId, purchaseAmount } = req.body;

      const referral = await prisma.referral.findFirst({
        where: {
          refereeEmail,
          status: "USER_REGISTERED",
        },
        include: {
          referrer: true,
        },
      });

      if (!referral) {
        return res.status(404).json({
          message: "No eligible referral found",
        });
      }

      // Calculate rewards
      const referrerReward = calculateReferralReward(purchaseAmount);
      const refereeReward = calculateRefereeReward(purchaseAmount);

      // Update referral
      const updatedReferral = await prisma.referral.update({
        where: { id: referral.id },
        data: {
          status: "COURSE_PURCHASED",
          purchaseDate: new Date(),
          courseId,
          purchaseAmount,
          referrerReward,
          refereeReward,
        },
      });

      // Update referral stats
      await prisma.referralStats.update({
        where: { userId: referral.referrerId },
        data: {
          successfulReferrals: { increment: 1 },
          totalRewards: { increment: referrerReward },
        },
      });

      // Send success emails
      const emailService = new EmailService(req.app.locals.emailConfig);
      await Promise.all([
        emailService.sendReferralSuccessEmail(referral.referrer, {
          refereeName: referral.refereeName,
          reward: referrerReward,
        }),
        emailService.sendRefereeRewardEmail({
          email: refereeEmail,
          name: referral.refereeName,
          reward: refereeReward,
        }),
      ]);

      return res.status(200).json({
        message: "Referral completed successfully",
        data: updatedReferral,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = referralMiddleware;