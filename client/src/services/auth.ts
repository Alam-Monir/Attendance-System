import { toast } from "sonner";

export const logout = async (navigate: (path: string) => void) => {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    toast.success("Logged out successfully");
    navigate("/");
  } catch (err) {
    console.error("Logout failed:", err);
    toast.error("Logout failed");
  }
};
