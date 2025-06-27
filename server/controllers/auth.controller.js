const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = db.user;

// ✅ Register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "employee",
        });

        res.status(201).json({
            message: "User registered",
            user: {
                id: user.id,
                name,
                email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // ✅ Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // change to true in production with HTTPS
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Logout (Add this to your auth.routes.js, not here)
exports.logout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
};
