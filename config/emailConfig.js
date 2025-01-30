const {
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_HOST,
  EMAIL_USER,
  EMAIL_SECURE,
} = require("./envConfig");

const emailConfig = {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  user: EMAIL_USER,
  pass: EMAIL_PASSWORD,
};

module.exports = emailConfig;
