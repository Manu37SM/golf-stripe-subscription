const express = require("express");
const router = express.Router();

const controller = require("./winner.controller");
const verifyToken = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

// Get logged-in user winners
router.get("/my", verifyToken, controller.getMyWinners);

// Upload proof
router.post(
  "/:id/upload-proof",
  verifyToken,
  upload.single("proof"),
  controller.uploadProof,
);

module.exports = router;
