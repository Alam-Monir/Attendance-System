const jwt = require("jsonwebtoken");
const { user } = require("../../models");
require("dotenv").config();

const authenticate = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Optionally fetch full user details from DB
        const foundUser = await user.findByPk(decoded.id);
        if (!foundUser) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = foundUser; // Attach full user object to request
        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticate;
