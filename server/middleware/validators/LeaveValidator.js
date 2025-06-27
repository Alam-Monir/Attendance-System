const { body, validationResult } = require("express-validator");
const moment = require("moment");

exports.validateLeaveRequest = [
    body("startDate")
        .notEmpty().withMessage("Start date is required")
        .isISO8601().withMessage("Start date must be a valid date"),

    body("endDate")
        .notEmpty().withMessage("End date is required")
        .isISO8601().withMessage("End date must be a valid date")
        .custom((value, { req }) => {
            if (moment(value).isBefore(moment(req.body.startDate))) {
                throw new Error("End date cannot be before start date");
            }
            return true;
        }),

    body("reason")
        .notEmpty().withMessage("Reason is required")
        .isLength({ min: 5 }).withMessage("Reason must be at least 5 characters long"),

    // Final check
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];
