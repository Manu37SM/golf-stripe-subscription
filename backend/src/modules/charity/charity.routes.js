const express = require("express");
const router = express.Router();
const controller = require("./charity.controller");
const verifyToken = require("../../middleware/auth.middleware");

router.get("/", controller.getCharities);
router.post("/select", verifyToken, controller.selectCharity);
router.get("/me", verifyToken, controller.getUserCharity);

module.exports = router;
