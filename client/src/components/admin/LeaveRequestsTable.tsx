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
import { Button } from "@/components/ui/button";

interface Leave {
  id: string;
  User: {
    id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export default function LeaveRequestsTable() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("/admin/leaves");
      setLeaves(res.data.leaves);
    } catch (err) {
      toast.error("Failed to load leave requests.");
    }
  };

  const updateLeaveStatus = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    try {
      setLoading(true);
      await axios.put(`/admin/leaves/${id}/${action}`);
      toast.success(`Leave ${action}d successfully`);
      fetchLeaves();
    } catch (err) {
      toast.error(`Failed to ${action} leave.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <Card className="p-4 space-y-4 mt-6">
      <h2 className="text-xl font-semibold">Leave Requests</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>
                <div className="font-medium">{leave.User.name}</div>
                <div className="text-sm text-muted-foreground">
                  {leave.User.email}
                </div>
              </TableCell>
              <TableCell>
                {leave.startDate} → {leave.endDate}
              </TableCell>
              <TableCell>{leave.reason}</TableCell>
              <TableCell className="capitalize">{leave.status}</TableCell>
              <TableCell className="text-right space-x-2">
                {leave.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateLeaveStatus(leave.id, "approve")}
                      disabled={loading}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateLeaveStatus(leave.id, "reject")}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
