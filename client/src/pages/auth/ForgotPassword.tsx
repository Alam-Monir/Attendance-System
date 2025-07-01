/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  // ⏱ Cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // 📨 Send OTP
  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email.");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      toast.success("OTP sent to your email.");
      setStep("otp");
      setOtp("");
      setCooldown(30);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter the OTP.");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });
      toast.success("OTP verified.");
      setStep("reset");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill both password fields.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        newPassword,
      });
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow space-y-6">
      <h2 className="text-2xl font-semibold text-center">Forgot Password</h2>

      {step === "email" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleSendOtp} disabled={loading} className="w-full">
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
          <div className="text-center pt-4">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:underline"
            >
              ← Return Back to Login
            </Link>
          </div>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <Button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleSendOtp}
            disabled={cooldown > 0}
            className="text-sm text-muted-foreground"
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
          </Button>
        </div>
      )}

      {step === "reset" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter a new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
