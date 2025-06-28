const moment = require("moment");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { Leave, user, attendance } = require("../models");

// GET /api/admin/employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await user.findAll({
            where: { role: "employee" },
            attributes: { exclude: ["password"] }, // Don't send password
        });

        res.status(200).json({ employees });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Server error while fetching employees." });
    }
};

// GET /api/admin/attendance
exports.getAttendanceLogs = async (req, res) => {
    const { userId, from, to } = req.query;

    const where = {};

    if (userId) {
        where.userId = userId;
    }

    if (from && to) {
        where.date = {
            [Op.between]: [from, to],
        };
    } else if (from) {
        where.date = {
            [Op.gte]: from,
        };
    } else if (to) {
        where.date = {
            [Op.lte]: to,
        };
    }

    try {
        const records = await attendance.findAll({
            where,
            include: {
                model: user,
                attributes: ["id", "name", "email"],
            },
            order: [["date", "DESC"]],
        });

        res.status(200).json({ records });
    } catch (error) {
        console.error("Error fetching attendance logs:", error);
        res.status(500).json({ message: "Server error while fetching attendance." });
    }
};

// GET /api/admin/attendance/:id
exports.getAttendanceByEmployee = async (req, res) => {
    const { id } = req.params;
    const { from, to } = req.query;

    const where = {
        userId: id,
    };

    if (from && to) {
        where.date = {
            [Op.between]: [from, to],
        };
    } else if (from) {
        where.date = {
            [Op.gte]: from,
        };
    } else if (to) {
        where.date = {
            [Op.lte]: to,
        };
    }

    try {
        const records = await attendance.findAll({
            where,
            include: {
                model: user,
                attributes: ["id", "name", "email"],
            },
            order: [["date", "DESC"]],
        });

        // Extract only present dates
        const presentDates = records
            .filter((r) => r.checkInTime)
            .map((r) => r.date);

        res.status(200).json({ presentDates, records });
    } catch (error) {
        console.error("Error fetching attendance for employee:", error);
        res.status(500).json({ message: "Server error while fetching attendance." });
    }
};


// GET /api/admin/attendance/today
exports.getTodayAttendance = async (req, res) => {
  const today = moment().format("YYYY-MM-DD");

  try {
    const attendances = await attendance.findAll({
      where: {
        date: today,
      },
      include: {
        model: user,
        attributes: ["id", "name", "email"],
      },
      order: [["checkInTime", "ASC"]],
    });

    res.status(200).json({ attendances });
  } catch (error) {
    console.error("Error fetching today’s attendance:", error);
    res.status(500).json({ message: "Server error while fetching today’s attendance." });
  }
};


// GET /api/admin/leaves
exports.getAllLeaveRequests = async (req, res) => {
    try {
        const leaves = await Leave.findAll({
            include: [
                {
                    model: user,
                    attributes: ["id", "name", "email"], // only necessary fields
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({ leaves });
    } catch (error) {
        console.error("Error fetching leave requests:", error);
        res.status(500).json({ message: "Server error while fetching leave requests." });
    }
};

// GET /api/admin/leaves/:id
exports.getLeaveRequestsByEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const leaves = await Leave.findAll({
            where: {
                userId: id,
            },
            include: [
                {
                    model: user,
                    attributes: ["id", "name", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({ leaveRequests: leaves });
    } catch (error) {
        console.error("Error fetching leaves for employee:", error);
        res.status(500).json({ message: "Server error while fetching leave requests." });
    }
};
;


// PUT /api/admin/leaves/:id/approve
exports.approveLeaveRequest = async (req, res) => {
    try {
        const leave = await Leave.findByPk(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: "Leave request not found." });
        }

        leave.status = "approved";
        await leave.save();

        res.status(200).json({ message: "Leave request approved.", leave });
    } catch (error) {
        console.error("Error approving leave:", error);
        res.status(500).json({ message: "Server error while approving leave." });
    }
};

// PUT /api/admin/leaves/:id/reject
exports.rejectLeaveRequest = async (req, res) => {
    try {
        const leave = await Leave.findByPk(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: "Leave request not found." });
        }

        leave.status = "rejected";
        await leave.save();

        res.status(200).json({ message: "Leave request rejected.", leave });
    } catch (error) {
        console.error("Error rejecting leave:", error);
        res.status(500).json({ message: "Server error while rejecting leave." });
    }
};

// POST /api/admin/employees
exports.addEmployee = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }

    try {
        // Check for existing email
        const existing = await user.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await user.create({
            name,
            email,
            password: hashedPassword,
            role: "employee", // fixed role
        });

        res.status(201).json({
            message: "Employee created successfully.",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Server error while adding employee." });
    }
};

// GET /api/admin/summary
exports.getAdminSummary = async (req, res) => {
    const today = moment().format("YYYY-MM-DD");

    try {
        const [totalEmployees, totalLeaves, pendingLeaves, todayAttendance] = await Promise.all([
            user.count({ where: { role: "employee" } }),

            Leave.count(),

            Leave.count({ where: { status: "pending" } }),

            attendance.count({ where: { date: today } }),
        ]);

        res.status(200).json({
            totalEmployees,
            totalLeaves,
            pendingLeaves,
            todayAttendance,
        });
    } catch (error) {
        console.error("Error fetching admin summary:", error);
        res.status(500).json({ message: "Server error while fetching summary." });
    }
};