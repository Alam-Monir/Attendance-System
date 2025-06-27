import { EmployeeNav } from "@/components/employee/EmployeeNav";
import { LeaveSummary } from "@/components/employee/LeaveSummary";
import { LeaveRequestForm } from "@/components/employee/LeaveRequestForm";
import { AttendanceStatus } from "@/components/employee/AttendanceStatus";
import { AttendanceHistory } from "@/components/employee/AttendanceHistory";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <EmployeeNav />
      <AttendanceStatus />
      <LeaveSummary />
      <LeaveRequestForm />
      <AttendanceHistory />
    </div>
  );
}
