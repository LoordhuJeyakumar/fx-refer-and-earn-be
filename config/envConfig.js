//import dotenv
const dotEnv = require("dotenv");

//config dot env
dotEnv.config();

const PORT = process.env.PORT;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_SECURE = process.env.EMAIL_SECURE;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const FRONTEND_BASEURI = process.env.FRONTEND_BASEURI;

module.exports = {
  PORT,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASSWORD,
  FRONTEND_BASEURI,
};