const { Leave } = require("../models");
const { Op } = require("sequelize");

exports.requestLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const userId = req.user.id;

        const existingLeave = await Leave.findOne({
            where: {
                userId,
                status: { [Op.in]: ["pending", "approved"] },
                [Op.or]: [
                    { startDate: { [Op.between]: [startDate, endDate] } },
                    { endDate: { [Op.between]: [startDate, endDate] } },
                    {
                        [Op.and]: [
                            { startDate: { [Op.lte]: startDate } },
                            { endDate: { [Op.gte]: endDate } }
                        ]
                    }
                ]
            }
        });

        if (existingLeave) {
            let message = existingLeave.status === "pending"
                ? "You have a pending leave request that overlaps with these dates."
                : "You already have an approved leave that overlaps with these dates.";

            return res.status(409).json({
                message,
            });
        }

        const newLeave = await Leave.create({
            userId,
            startDate,
            endDate,
            reason,
            status: "pending"
        });

        res.status(201).json({ message: "Leave requested successfully", data: newLeave });

    } catch (error) {
        console.error("Error in requestLeave:", error);
        res.status(500).json({ message: "Error requesting leave", error: error.message });
    }
};



exports.getMyLeaves = async (req, res) => {
    try {
        const myLeaves = await Leave.findAll({ where: { userId: req.user.id } });
        res.json({ data: myLeaves });
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaves", error });
    }
};

exports.cancelLeaveRequest = async (req, res) => {
    const leaveId = req.params.id;

    try {
        // Find the leave for this user and leave ID
        const leave = await Leave.findOne({
            where: {
                id: leaveId,
                userId: req.user.id,
                status: "pending", // Only allow deletion if pending
            },
        });

        if (!leave) {
            return res.status(404).json({
                message: "Leave not found or cannot be cancelled",
            });
        }

        await leave.destroy(); // Delete the leave
        res.json({ message: "Leave request cancelled successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error cancelling leave request",
            error,
        });
    }
};


exports.getAllLeaves = async (req, res) => {
    try {
        const allLeaves = await Leave.findAll({ include: ["user"] });
        res.json({ data: allLeaves });
    } catch (error) {
        res.status(500).json({ message: "Error fetching all leaves", error });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    try {
        const leaveRequest = await Leave.findByPk(id);
        if (!leaveRequest) return res.status(404).json({ message: "Leave not found" });

        leaveRequest.status = status;
        await leaveRequest.save();

        res.json({ message: `Leave ${status}` });
    } catch (error) {
        res.status(500).json({ message: "Error updating leave status", error });
    }
};
