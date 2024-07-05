//import dotenv
const dotEnv = require("dotenv");

//config dot env
dotEnv.config();

const PORT = process.env.PORT;

module.exports = {
  PORT,
};
