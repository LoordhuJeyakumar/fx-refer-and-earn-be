const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

class EmailService {
  constructor(config) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    // Enhanced email templates with referral template
    this.emailTemplates = {
      verification: fs.readFileSync(
        path.join(__dirname, "../templates/emailVerification.html"),
        "utf8"
      ),
      passwordReset: fs.readFileSync(
        path.join(__dirname, "../templates/passwordReset.html"),
        "utf8"
      ),
      referral: fs.readFileSync(
        path.join(__dirname, "../templates/referral.html"),
        "utf8"
      ),
    };

    // Default configuration
    this.defaultConfig = {
      companyName: "Francis Xavier",
      emailFrom: "noreply@francisxavier.com",
      rewardAmount: "5000", // Configurable reward amount
    };
  }

  _replacePlaceholders(template, replacements) {
    return template.replace(
      /\{\{(\w+)\}\}/g,
      (match, key) => replacements[key] || match
    );
  }

  // Enhanced error handling
  async _sendEmail(options) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${this.defaultConfig.companyName}" <${this.defaultConfig.emailFrom}>`,
        ...options,
      });
      console.log(`Email sent successfully: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendVerificationEmail(user, frontEndURL) {
    const verificationLink = `${frontEndURL}/verify-email/${user.emailVerificationToken}/${user._id}`;

    const emailBody = this._replacePlaceholders(
      this.emailTemplates.verification,
      {
        userName: user.name,
        verificationLink,
        companyName: this.defaultConfig.companyName,
      }
    );

    return this._sendEmail({
      to: user.email,
      subject: `Verify Your ${this.defaultConfig.companyName} Account`,
      html: emailBody,
    });
  }

  async sendPasswordResetEmail(user, frontEndURL) {
    const resetLink = `${frontEndURL}/reset-password/${user.passwordResetToken}/${user._id}`;

    const emailBody = this._replacePlaceholders(
      this.emailTemplates.passwordReset,
      {
        userName: user.name,
        resetLink,
        companyName: this.defaultConfig.companyName,
      }
    );

    return this._sendEmail({
      to: user.email,
      subject: `Password Reset for ${this.defaultConfig.companyName}`,
      html: emailBody,
    });
  }

  // New method for sending referral emails
  async sendReferralEmail(referralData, frontEndURL) {
    const {
      referrerName,
      referrerEmail,
      refereeName,
      refereeEmail,
      message,
      referralCode,
    } = referralData;

    const signupLink = `${frontEndURL}/signup?ref=${referralCode}`;

    const emailBody = this._replacePlaceholders(this.emailTemplates.referral, {
      referrerName,
      refereeName,
      signupLink,
      customMessage: message || "",
      companyName: this.defaultConfig.companyName,
      rewardAmount: this.defaultConfig.rewardAmount,
    });

    return this._sendEmail({
      to: refereeEmail,
      subject: `${referrerName} invited you to join ${this.defaultConfig.companyName}`,
      html: emailBody,
      replyTo: referrerEmail,
    });
  }

  // New method for sending referral success notifications
  async sendReferralSuccessEmail(referrer, referee) {
    const emailBody = this._replacePlaceholders(
      this.emailTemplates.referralSuccess,
      {
        referrerName: referrer.name,
        refereeName: referee.name,
        rewardAmount: this.defaultConfig.rewardAmount,
        companyName: this.defaultConfig.companyName,
      }
    );

    return this._sendEmail({
      to: referrer.email,
      subject: `Congratulations! Your referral was successful`,
      html: emailBody,
    });
  }
}

module.exports = EmailService;
