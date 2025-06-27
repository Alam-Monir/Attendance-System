import { useEffect, useState } from "react";
import SummaryCards from "@/components/admin/SummaryCards";
import axios from "@/lib/axios";
import EmployeeTable from "@/components/admin/EmployeeTable";
import LeaveRequestsTable from "@/components/admin/LeaveRequestsTable";
import { AdminNav } from "@/components/admin/AdminNav";
import TodayAttendanceTable from "@/components/admin/TodayAttendanceTable";

interface SummaryData {
  totalEmployees: number;
  totalLeaves: number;
  pendingLeaves: number;
  todayAttendance: number;
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);

  useEffect(() => {
    axios
      .get("/admin/summary", { withCredentials: true })
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Error fetching summary:", err));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <AdminNav/>
      {summary ? <SummaryCards data={summary} /> : <p>Loading summary...</p>}
      <TodayAttendanceTable />
      <LeaveRequestsTable />
      <EmployeeTable />
      
    </div>
  );
}
