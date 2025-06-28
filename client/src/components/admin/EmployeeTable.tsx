/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [openEmployeeId, setOpenEmployeeId] = useState<string | null>(null);
  const [attendanceDates, setAttendanceDates] = useState<
    Record<string, string[]>
  >({});
  const [leaveRequests, setLeaveRequests] = useState<
    Record<string, LeaveRequest[]>
  >({});

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/admin/employees");
      setEmployees(res.data.employees);
    } catch (err) {
      toast.error("Failed to fetch employees.");
    }
  };

  const fetchEmployeeData = async (id: string) => {
    try {
      const [attendanceRes, leaveRes] = await Promise.all([
        axios.get(`/admin/attendance/${id}`),
        axios.get(`/admin/leaves/${id}`),
      ]);

      setAttendanceDates((prev) => ({
        ...prev,
        [id]: attendanceRes.data.presentDates || [],
      }));
      setLeaveRequests((prev) => ({
        ...prev,
        [id]: leaveRes.data.leaveRequests || [],
      }));
    } catch (err) {
      toast.error("Failed to fetch employee details.");
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;

    try {
      setLoading(true);
      await axios.post("/admin/employees", form);
      setForm({ name: "", email: "", password: "" });
      fetchEmployees();
      toast.success("Employee added successfully.");
    } catch (err) {
      toast.error("Could not add employee.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveAction = async (
    leaveId: string,
    action: "approve" | "reject"
  ) => {
    try {
      await axios.put(`/admin/leaves/${leaveId}/${action}`);
      toast.success(`Leave ${action}d successfully.`);
      if (openEmployeeId) fetchEmployeeData(openEmployeeId);
    } catch (error) {
      toast.error("Failed to update leave status.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Card className="p-4 space-y-4 mt-6">
      <h2 className="text-xl font-semibold">Employees</h2>

      <form
        onSubmit={handleAddEmployee}
        className="flex flex-wrap gap-3 items-end"
      >
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-40"
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-48"
        />
        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-40"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Employee"}
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <React.Fragment key={emp.id}>
              <TableRow
                className="cursor-pointer"
                onClick={() => {
                  const newId = openEmployeeId === emp.id ? null : emp.id;
                  setOpenEmployeeId(newId);
                  if (newId) fetchEmployeeData(newId);
                }}
              >
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell className="capitalize">{emp.role}</TableCell>
              </TableRow>

              {openEmployeeId === emp.id && (
                <TableRow>
                  <TableCell colSpan={3} className="p-4 bg-muted">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Calendar */}
                      <div className="md:w-1/2">
                        <h3 className="font-semibold mb-2">
                          Attendance Calendar
                        </h3>
                        <Calendar
                          className="rounded-md border shadow"
                          mode="single"
                          selected={undefined}
                          modifiers={{
                            present: attendanceDates[emp.id]?.map(
                              (date) => new Date(date)
                            ),
                          }}
                          modifiersClassNames={{
                            present:
                              "bg-green-500 text-white hover:bg-green-600",
                          }}
                        />
                      </div>

                      {/* Leave Requests */}
                      <div className="md:w-1/2">
                        <h3 className="font-semibold mb-2">Leave Requests</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                          {leaveRequests[emp.id]?.length > 0 ? (
                            leaveRequests[emp.id].map((leave) => (
                              <div
                                key={leave.id}
                                className="border rounded-md p-3 shadow-sm space-y-1"
                              >
                                <div className="font-medium">
                                  {leave.reason}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {leave.startDate} → {leave.endDate}
                                </div>
                                <div className="text-xs capitalize text-gray-500">
                                  Status: {leave.status}
                                </div>

                                {leave.status === "pending" && (
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() =>
                                        handleLeaveAction(leave.id, "approve")
                                      }
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() =>
                                        handleLeaveAction(leave.id, "reject")
                                      }
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              No leave requests
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
