const app = require("./app");
const prisma = require("./config/prisma-client");
const config = require("./config/envConfig");

console.log("Connecting to database.....");
const port = config.PORT || 3000;
let retryCount = 0;

// Function to connect to database with retry logic
async function connectToDatabase() {
  try {
    // Disconnect from any previous connections (optional but recommended)
    await prisma.$disconnect();

    // Attempt to connect
    await prisma.$connect();
    console.log("Connected to the MySql...");

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.log("Error connecting to the MySql", error.message);

    // Retry connection after a delay (e.g., 5 seconds)
    if (retryCount < 3) {
      retryCount++;
      console.log(
        `Retrying connection (attempt ${retryCount}) in 5 seconds...`
      );
      setTimeout(connectToDatabase, 5000);
    } else {
      console.log("Max retry attempts reached. Exiting...");
      process.exit(1); // Exit the process with an error code
    }
  }
}

// Initial attempt to connect
connectToDatabase();
