const integrationRouter = require("./integrationRouter");
const referralRouter = require("./referralRouter");

const appRouter = require("express").Router();

// Welcome message and API status route
appRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Francis Xavier Refer & Earn API",
    version: "1.0.0",
    status: "healthy",
  });
});

// Mount referralRouter under /referral path
appRouter.use("/referral", referralRouter);
appRouter.use("/integration", integrationRouter);

module.exports = appRouter;
