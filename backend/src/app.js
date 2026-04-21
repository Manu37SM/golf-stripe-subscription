const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("../config/db");
const authRoutes = require("./modules/auth/auth.routes");
const scoreRoutes = require("./modules/scores/score.routes");
const drawRoutes = require("./modules/draw/draw.routes");
const subscriptionRoutes = require("./modules/subscription/subscription.routes");
const charityRoutes = require("./modules/charity/charity.routes");
const winnerRoutes = require("./modules/winners/winner.routes");
const userRoutes = require("./modules/users/user.routes");
const initDb = require("./utils/initDB");

const app = express();
app.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
  require("./modules/subscription/stripe.webhook"),
);

// Now safe to apply JSON parsing for all other routes
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "API is running 🚀" });
});

initDb();
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/charity", charityRoutes);
app.use("/api/winners", winnerRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));

module.exports = app;
