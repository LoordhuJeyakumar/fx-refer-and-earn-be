const crypto = require("crypto");
const prisma = require("../config/prisma-client");

const generateReferralCode = async () => {
  const code = crypto.randomBytes(4).toString("hex").toUpperCase();

  // Check if code already exists
  const existing = await prisma.referral.findFirst({
    where: { referralCode: code },
  });

  if (existing) {
    return generateReferralCode(); // Try again if code exists
  }

  return code;
};

const calculateReferralReward = (purchaseAmount) => {
  // Example reward calculation logic
  const baseReward = 50;
  const percentageReward = purchaseAmount * 0.1;
  return Math.min(baseReward, percentageReward);
};

const calculateRefereeReward = (purchaseAmount) => {
  // Example referee reward calculation
  return Math.min(25, purchaseAmount * 0.05);
};

module.exports = {
  generateReferralCode,
  calculateReferralReward,
  calculateRefereeReward,
};
