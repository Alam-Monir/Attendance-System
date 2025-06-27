import { Button } from "../ui/button";
import { logout } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { CircleUserRound, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { ChangePasswordDialog } from "./PasswordChangeDialog";
import { RequestedLeavesDialog } from "./RequestedLeavesDialog";

export function EmployeeNav() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openLeavesDialog, setOpenLeavesDialog] = useState(false); // ✅ dialog state

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
            <DropdownMenuItem onClick={() => setOpenLeavesDialog(true)}>
              Requested Leaves
            </DropdownMenuItem>
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

      {/* Dialogs rendered outside */}
      <ChangePasswordDialog
        open={openPasswordDialog}
        onOpenChange={setOpenPasswordDialog}
      />
      <RequestedLeavesDialog
        open={openLeavesDialog}
        onOpenChange={setOpenLeavesDialog}
      />
    </div>
  );
}
