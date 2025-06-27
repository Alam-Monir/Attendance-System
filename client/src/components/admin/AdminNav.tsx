import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { logout } from "@/services/auth";
import { CircleUserRound, LogOut } from "lucide-react";
import { ChangePasswordDialog } from "../employee/PasswordChangeDialog";
import { Button } from "../ui/button";

export function AdminNav() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.name || "Employee"} 👋
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <CircleUserRound className="size-8" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>

            <DropdownMenuItem onClick={() => setOpenPasswordDialog(true)}>
              Change Password
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout(navigate)}>
            Log out <LogOut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePasswordDialog
        open={openPasswordDialog}
        onOpenChange={setOpenPasswordDialog}
      />
    </div>
  );
}
