// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err.name === "ValidationError") {
    // Handle validation errors
    return res.status(400).json({ error: err.message });
  }
  // Handle other errors
  res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
