const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const passwordController = require("../controllers/password.Controller");

// Middlewares
const { authenticate } = require("../middleware"); // assumes you have middleware/index.js
const validatePasswordChange = require("../middleware/validators/ValidatePasswordChange");


// Auth Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
});

// Forgot Password Routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);

// Password Change Route with validation
router.post("/change-password", authenticate, validatePasswordChange, passwordController.changePassword);

module.exports = router;
