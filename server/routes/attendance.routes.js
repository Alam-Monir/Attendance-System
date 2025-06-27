const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");
const { authenticate } = require("../middleware");

router.post("/check-in", authenticate, attendanceController.checkIn);
router.post("/lunch-out", authenticate, attendanceController.lunchOut);
router.post("/lunch-in", authenticate, attendanceController.lunchIn);
router.post("/check-out", authenticate, attendanceController.checkOut);
router.get("/history", authenticate, attendanceController.getAttendanceHistory);

module.exports = router;
