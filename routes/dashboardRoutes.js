const express = require("express");
const { protect } = require('../middleware/authMiddleware')
const dashboardController = require("../controllers/dashboardController")

const router = express.Router();

router.get("/", protect, dashboardController.getDashboardData)

module.exports = router;