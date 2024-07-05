const app = require("./app");
const prisma = require("./config/prisma-client");
const config = require("./config/envConfig");

console.log("Connecting to database.....");

//connect to Database
prisma
  .$connect()
  .then(() => {
    console.log("Connected to the MySql...");

    //start the server
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the MySql", error.message);
  });
