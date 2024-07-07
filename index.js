const app = require("./app");
const prisma = require("./config/prisma-client");
const config = require("./config/envConfig");

console.log("Connecting to database.....");

// Function to connect to database with retry logic
async function connectToDatabase() {
  try {
    // Disconnect from any previous connections (optional but recommended)
    await prisma.$disconnect();

    // Attempt to connect
    await prisma.$connect();
    console.log("Connected to the MySql...");

    // Start the server
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.log("Error connecting to the MySql", error.message);

    // Retry connection after a delay (e.g., 5 seconds)
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectToDatabase, 5000);
  }
}
console.log(process.env.DATABASE_URL);

// Initial attempt to connect
connectToDatabase();
