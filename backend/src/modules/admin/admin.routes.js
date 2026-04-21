const express = require("express");
const router = express.Router();
const controller = require("./admin.controller");
const verifyToken = require("../../middleware/auth.middleware");
const isAdmin = require("../../middleware/admin.middleware");

router.use(verifyToken, isAdmin);

// USERS
router.get("/users", controller.getUsers);
router.put("/users/:id/role", controller.updateUserRole);

// CHARITY
router.post("/charity", controller.createCharity);
router.put("/charity/:id", controller.updateCharity);
router.delete("/charity/:id", controller.deleteCharity);

// WINNERS
router.get("/winners", controller.getWinners);
router.put("/winners/:id", controller.updateWinner);

// REPORTS
router.get("/reports", controller.getReports);

// SEED — run once to populate sample data
router.post("/seed", controller.seedData);

module.exports = router;
