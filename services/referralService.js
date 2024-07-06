const prisma = require("../config/prisma-client");

// Function to update referral status
async function updateReferralStatus(refereeEmail, status) {
  try {
    const updatedReferral = await prisma.referral.update({
      where: { refereeEmail },
      data: { status },
    });

    return { message: "Referral status updated successfully", data: updatedReferral };
  } catch (error) {
    if (error.code === 'P2025') { // Prisma error code for record not found
      return { error: "Referral not found or already updated" };
    }
    console.error("Error updating referral status:", error.message);
    return { error: "Failed to update referral status" };
  }
}

// Function to handle referral logic when a user registers
async function handleUserRegistration(refereeEmail, userId) {
  try {
    const result = await updateReferralStatus(refereeEmail, "USER_REGISTER");

    if (result.error) {
      return result;
    }

    // Optionally, you can add additional logic here, such as awarding points to the referrer
    const referral = await prisma.referral.findUnique({
      where: { refereeEmail },
    });

    await prisma.user.update({
      where: { id: referral.referrerId },
      data: { referralsPoints: { increment: 10 } },
    });

    return result;
  } catch (error) {
    console.error("Error handling user registration:", error.message);
    return { error: "Failed to handle user registration" };
  }
}

// Function to handle referral logic when a course is purchased
async function handleCoursePurchase(refereeEmail) {
  try {
    const result = await updateReferralStatus(refereeEmail, "COURSE_PURCHASED");

    if (result.error) {
      return result;
    }

    // Optionally, you can add additional logic here, such as awarding points to the referrer
    const referral = await prisma.referral.findUnique({
      where: { refereeEmail },
    });

    await prisma.user.update({
      where: { id: referral.referrerId },
      data: { referralsPoints: { increment: 20 } },
    });

    return result;
  } catch (error) {
    console.error("Error handling course purchase:", error.message);
    return { error: "Failed to handle course purchase" };
  }
}

module.exports = {
  updateReferralStatus,
  handleUserRegistration,
  handleCoursePurchase,
};
