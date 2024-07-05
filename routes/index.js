const appRouter = require("express").Router();

appRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Accredian Refer & Earn API",
    version: "1.0.0",
    status: "healthy",
  });
});

module.exports = appRouter;
