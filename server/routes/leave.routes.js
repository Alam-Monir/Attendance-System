const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leave.controller");
const authenticate = require("../middleware/auth/authenticate");
const authorizeRole = require("../middleware/auth/authorizeRole");
const { validateLeaveRequest } = require("../middleware/validators/LeaveValidator");

// Employee
router.post("/request", authenticate, validateLeaveRequest, leaveController.requestLeave);
router.get("/myLeaves", authenticate, leaveController.getMyLeaves);
router.delete("/:id", authenticate, leaveController.cancelLeaveRequest);

// Admin
router.get("/", authenticate, authorizeRole("admin"), leaveController.getAllLeaves);
router.patch("/:id/status", authenticate, authorizeRole("admin"), leaveController.updateLeaveStatus);

module.exports = router;
