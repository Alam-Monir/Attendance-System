/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface Attendance {
  id: number;
  checkInTime: string | null;
  lunchOutTime: string | null;
  lunchInTime: string | null;
  checkOutTime: string | null;
  location: string | null;
  User: {
    name: string;
    email: string;
  };
}

export default function TodayAttendanceTable() {
  const [records, setRecords] = useState<Attendance[]>([]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("/admin/attendance/today");
      setRecords(res.data.attendances);
    } catch (err) {
      toast.error("Failed to load today's attendance.");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <Card className="p-4 space-y-4 mt-6">
      <h2 className="text-xl font-semibold">Today’s Attendance</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Lunch Out</TableHead>
            <TableHead>Lunch In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No attendance records found.</TableCell>
            </TableRow>
          ) : (
            records.map((rec) => (
              <TableRow key={rec.id}>
                <TableCell>
                  <div className="font-medium">{rec.User.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {rec.User.email}
                  </div>
                </TableCell>
                <TableCell>{rec.checkInTime || "-"}</TableCell>
                <TableCell>{rec.lunchOutTime || "-"}</TableCell>
                <TableCell>{rec.lunchInTime || "-"}</TableCell>
                <TableCell>{rec.checkOutTime || "-"}</TableCell>
                <TableCell>{rec.location || "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
