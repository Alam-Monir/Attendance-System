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
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/admin/employees");
      setEmployees(res.data.employees);
    } catch (err) {
      toast.error("Failed to fetch employees.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

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

  return (
    <Card className="p-4 space-y-4 mt-6">
      <h2 className="text-xl font-semibold">Employees</h2>

      {/* Add Employee Form */}
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

      {/* Employee Table */}
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
            <TableRow key={emp.id}>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell className="capitalize">{emp.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
