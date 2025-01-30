const emailConfig = require("../config/emailConfig");
const { FRONTEND_BASEURI } = require("../config/envConfig");
const prisma = require("../config/prisma-client");
const EmailService = require("../services/EmailService");

const { generateReferralCode } = require("../utils/referralUtils");

/* const referralController = {
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
}; */

const referralController = {
  // Create a new referral
  createReferral: async function (req, res, next) {
    try {
      const {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        message,
      } = req.body;

      // Check for existing referral
      const existingReferral = await prisma.referral.findFirst({
        where: {
          refereeEmail,
          status: {
            in: ["PENDING", "USER_REGISTERED", "COURSE_PURCHASED"],
          },
        },
      });

      if (existingReferral) {
        return res.status(400).json({
          message: "A referral already exists for this email",
          data: existingReferral,
        });
      }

      // Check if referrer and referee are the same
      if (referrerEmail === refereeEmail) {
        return res.status(400).json({
          message: "You cannot refer yourself",
        });
      }

      // Get or create referrer
      let user = await prisma.user.findUnique({
        where: { email: referrerEmail },
        include: { referralStats: true },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: referrerName,
            email: referrerEmail,
            referralStats: {
              create: {
                totalReferrals: 0,
                successfulReferrals: 0,
                pendingReferrals: 0,
                totalRewards: 0,
              },
            },
          },
          include: { referralStats: true },
        });
      }

      // Generate unique referral code
      const referralCode = await generateReferralCode();

      // Create referral
      const newReferral = await prisma.referral.create({
        data: {
          referrerId: user.id,
          refereeName,
          refereeEmail,
          status: "PENDING",
          referralCode,
          message,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
        },
      });

      // Update referral stats
      await prisma.referralStats.update({
        where: { userId: user.id },
        data: {
          totalReferrals: { increment: 1 },
          pendingReferrals: { increment: 1 },
        },
      });

      // Send referral email
      const emailService = new EmailService(emailConfig);
      await emailService.sendReferralEmail(
        {
          referralCode,
          referrerName,
          referrerEmail,
          refereeName,
          refereeEmail,
          message,
        },
        FRONTEND_BASEURI
      );

      return res.status(201).json({
        message: "Referral created successfully",
        data: newReferral,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get referral stats for a user
  getReferralStats: async function (req, res, next) {
    try {
      const { userId } = req.params;

      const stats = await prisma.referralStats.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!stats) {
        return res.status(404).json({
          message: "Referral stats not found",
        });
      }

      return res.status(200).json({
        message: "Referral stats retrieved successfully",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },

  // List referrals for a user
  listReferrals: async function (req, res, next) {
    try {
      const { userId } = req.params;
      const { status, page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * limit;
      const where = { referrerId: userId };

      if (status) {
        where.status = status;
      }

      const [referrals, total] = await Promise.all([
        prisma.referral.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { createdAt: "desc" },
        }),
        prisma.referral.count({ where }),
      ]);

      return res.status(200).json({
        message: "Referrals retrieved successfully",
        data: {
          referrals,
          pagination: {
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            limit: Number(limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = referralController;
