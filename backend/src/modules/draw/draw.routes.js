const express = require("express");
const router = express.Router();
const drawController = require("./draw.controller");
const verifyToken = require("../../middleware/auth.middleware");
const isAdmin = require("../../middleware/admin.middleware");

// All draw routes are admin-only
router.use(verifyToken, isAdmin);

router.get("/", drawController.getAllDraws);
router.post("/", drawController.createDraw);
router.post("/:id/run", drawController.runDraw);
router.post("/:id/simulate", drawController.simulateDraw);
router.post("/:id/publish", drawController.publishDraw);

module.exports = router;
