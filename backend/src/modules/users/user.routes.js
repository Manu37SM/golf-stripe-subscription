const express = require("express");
const router = express.Router();

const controller = require("./user.controller");
const verifyToken = require("../../middleware/auth.middleware");

router.get("/me", verifyToken, controller.getProfile);

module.exports = router;
