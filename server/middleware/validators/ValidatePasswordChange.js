module.exports = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Both old and new passwords are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters long." });
  }

  if (oldPassword === newPassword) {
    return res.status(400).json({ message: "New password must be different from the old one." });
  }

  next(); // Pass control to controller
};
