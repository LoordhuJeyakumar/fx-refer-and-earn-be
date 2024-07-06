const prisma = require("../config/prisma-client"); // Import Prisma client for interacting with the database

const referralService = {
  // Function to update referral status
  updateReferralStatus: async function (refereeEmail, status) {
    try {
      // Update the referral with the provided email address to the new status using Prisma
      const updatedReferral = await prisma.referral.update({
        where: { refereeEmail }, // Find the referral by refereeEmail
        data: { status }, // Update the status property of the referral
      });

      if (!updatedReferral) {
        // If no referral is found, return an error message
        return { error: "Referral not found or already updated" };
      }

      // Return a success message and the updated referral data
      return {
        message: "Referral status updated successfully",
        data: updatedReferral,
      };
    } catch (error) {
      console.error("Error updating referral status:", error.message); // Log the error message
      return { error: "Failed to update referral status" }; // Return a generic error response
    }
  },

  // Function to handle referral logic when a user registers
  handleUserRegistration: async function (refereeEmail, userId) {
    try {
      // Update the referral status to "USER_REGISTERED" for the given email
      const result = await updateReferralStatus(
        refereeEmail,
        "USER_REGISTERED"
      );

      if (result.error) {
        // If there's an error updating the referral status, return the error
        return result;
      }

      // Award points to the referrer using their ID from the updated referral
      await prisma.user.update({
        where: { id: result.data.referrerId }, // Find user by referrerId
        data: { referralsPoints: { increment: 10 } }, // Increment their points by 10
      });

      return result; // Return the successful update result
    } catch (error) {
      console.error("Error handling user registration:", error.message); // Log the error message
      return { error: "Failed to handle user registration" }; // Return a generic error response
    }
  },

  // Function to handle referral logic when a course is purchased
  handleCoursePurchase: async function (refereeEmail) {
    try {
      // Update the referral status to "COURSE_PURCHASED" for the given email
      const result = await updateReferralStatus(
        refereeEmail,
        "COURSE_PURCHASED"
      );

      if (result.error) {
        // If there's an error updating the referral status, return the error
        return result;
      }

      // Award points to the referrer using their ID from the updated referral
      await prisma.user.update({
        where: { id: result.data.referrerId }, // Find user by referrerId
        data: { referralsPoints: { increment: 20 } }, // Increment their points by 20
      });

      return result; // Return the successful update result
    } catch (error) {
      console.error("Error handling course purchase:", error.message); // Log the error message
      return { error: "Failed to handle course purchase" }; // Return a generic error response
    }
  },
};

module.exports = referralService;
