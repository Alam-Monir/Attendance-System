require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./models");

const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const leaveRoutes = require("./routes/leave.routes");
const cookieParser = require("cookie-parser");

const app = express();

// CORS: Allow frontend origin
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Employee API Routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);

// Admin API Routes
app.use("/api/admin", adminRoutes);

// Sequelize Sync
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced successfully.");
  })
  .catch((err) => {
    console.error("❌ Error syncing database:", err.message);
  });

module.exports = app;
