const express = require("express");
const router = express.Router();
const controller = require("./subscription.controller");
const verifyToken = require("../../middleware/auth.middleware");

router.post("/create-session", verifyToken, controller.createSession);
router.get("/status", verifyToken, controller.getStatus);
router.post("/activate-session", verifyToken, controller.activateSession);
router.post("/cancel", verifyToken, controller.cancelSubscription);

module.exports = router;
