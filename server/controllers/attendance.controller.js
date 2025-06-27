const { attendance, Leave } = require("../models");
const moment = require("moment");

exports.checkIn = async (req, res) => {
  const userId = req.user.id;
  const { location } = req.body;
  const today = moment().format("YYYY-MM-DD");

  try {
    const existing = await attendance.findOne({ where: { userId, date: today } });
    if (existing) {
      return res.status(400).json({ message: "Already checked in for today" });
    }

    await attendance.create({
      userId,
      date: today,
      checkInTime: moment().format("HH:mm:ss"),
      location,
    });

    res.status(201).json({ message: "Checked in successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.lunchOut = async (req, res) => {
  const userId = req.user.id;
  const today = moment().format("YYYY-MM-DD");

  try {
    const record = await attendance.findOne({
      where: { userId, date: today }
    });

    if (!record) {
      return res
        .status(400)
        .json({ message: "Check-in required before lunch out" });
    }

    if (!record.checkInTime) {
      return res
        .status(400)
        .json({ message: "You must check in before lunch out" });
    }

    if (record.lunchOutTime) {
      return res
        .status(400)
        .json({ message: "Lunch out already recorded" });
    }

    record.lunchOutTime = moment().format("HH:mm:ss");
    await record.save();

    res.status(200).json({ message: "Lunch out recorded successfully" });
  } catch (err) {
    console.error("Lunch out error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.lunchIn = async (req, res) => {
  const userId = req.user.id;
  const today = moment().format("YYYY-MM-DD");

  try {
    const record = await attendance.findOne({ where: { userId, date: today } });
    if (!record || !record.lunchOutTime) {
      return res.status(400).json({ message: "Lunch out must be marked before lunch in" });
    }

    await record.update({ lunchInTime: moment().format("HH:mm:ss") });

    res.status(200).json({ message: "Lunch in recorded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.checkOut = async (req, res) => {
  const userId = req.user.id;
  const today = moment().format("YYYY-MM-DD");

  try {
    const record = await attendance.findOne({ where: { userId, date: today } });
    if (!record) return res.status(400).json({ message: "Check-in required before check-out" });

    await record.update({ checkOutTime: moment().format("HH:mm:ss") });

    res.status(200).json({ message: "Checked out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Fetch attendance records
    const attendanceRecords = await attendance.findAll({
      where: { userId },
      raw: true,
    });

    // Step 2: Fetch approved leave records
    const leaveRecords = await Leave.findAll({
      where: {
        userId,
        status: "approved", // or 1 if you're using booleans
      },
      raw: true,
    });

    // Step 3: Expand leave dates into individual dates
    const expandedLeaveDates = [];
    for (const leave of leaveRecords) {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);

      for (
        let d = new Date(start);
        d <= end;
        d.setDate(d.getDate() + 1)
      ) {
        expandedLeaveDates.push({
          date: new Date(d).toISOString().slice(0, 10),
          status: "Leave",
        });
      }
    }

    // Step 4: Combine both into one map
    const map = new Map();

    // Attendance first
    for (const record of attendanceRecords) {
      map.set(record.date, {
        date: record.date,
        checkInTime: record.checkInTime,
        lunchOutTime: record.lunchOutTime,
        lunchInTime: record.lunchInTime,
        checkOutTime: record.checkOutTime,
        location: record.location,
        status: "Present",
      });
    }

    // Leave second (don’t override existing attendance)
    for (const leave of expandedLeaveDates) {
      if (!map.has(leave.date)) {
        map.set(leave.date, {
          date: leave.date,
          checkInTime: null,
          lunchOutTime: null,
          lunchInTime: null,
          checkOutTime: null,
          location: null,
          status: "Leave",
        });
      }
    }

    // Step 5: Sort by date (desc)
    const result = Array.from(map.values()).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json(result);
  } catch (error) {
    console.error("Failed to fetch attendance history:", error);
    res.status(500).json({ message: "Failed to fetch attendance history" });
  }
};
