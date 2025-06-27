import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AttendanceEntry = {
  date: string;
  checkInTime: string | null;
  lunchOutTime: string | null;
  lunchInTime: string | null;
  checkOutTime: string | null;
  location: string | null;
};

export function AttendanceHistory() {
  const [data, setData] = useState<AttendanceEntry[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("/attendance/history", {
          withCredentials: true,
        });
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch attendance history", error);
      }
    };

    fetchHistory();
  }, []);

  const formatTime = (time: string | null) => {
    return time
      ? new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";
  };

  const getStatus = (entry: AttendanceEntry) => {
    if (!entry.checkInTime && !entry.checkOutTime) return "Leave";
    return "Present";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Lunch Break</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry, idx) => (
              <TableRow key={idx}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{formatTime(entry.checkInTime)}</TableCell>
                <TableCell>{formatTime(entry.lunchOutTime)}</TableCell>
                <TableCell>{formatTime(entry.checkOutTime)}</TableCell>
                <TableCell>{getStatus(entry)}</TableCell>
                <TableCell>{entry.location || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
