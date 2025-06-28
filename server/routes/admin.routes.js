const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authenticate = require("../middleware/auth/authenticate");
const authorizeRole = require("../middleware/auth/authorizeRole");

// All admin routes protected with authenticate + authorizeRole("admin")
router.use(authenticate, authorizeRole("admin"));

// Attendance API routes
router.get("/employees", adminController.getAllEmployees);
router.get("/attendance", adminController.getAttendanceLogs);
router.get("/attendance/today", adminController.getTodayAttendance);
router.get("/attendance/:id", adminController.getAttendanceByEmployee);

// Leave request management
router.get("/leaves", adminController.getAllLeaveRequests);
router.get("/leaves/:id", adminController.getLeaveRequestsByEmployee);
router.put("/leaves/:id/approve", adminController.approveLeaveRequest);
router.put("/leaves/:id/reject", adminController.rejectLeaveRequest);

// Add Employee routes
router.post("/employees", adminController.addEmployee);

// Admin Summary
router.get("/summary", adminController.getAdminSummary);

module.exports = router;
