// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging

  if (err.name === "ValidationError") {
    // Handle validation errors from Express Validator
    return res.status(400).json({ error: err.message });
  }

  if (err.name === "PrismaClientKnownRequestError") {
    // Handle Prisma client known request errors
    return res.status(400).json({ error: "Database request error" });
  }

  if (err.name === "PrismaClientValidationError") {
    // Handle Prisma client validation errors
    return res.status(400).json({ error: "Database validation error" });
  }

  // Default error handling for other types of errors
  return res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
  