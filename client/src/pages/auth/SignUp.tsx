/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "@/lib/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee";
}

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully!");
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Register</h2>
      <input
        type="text"
        className="w-full mb-2 border p-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        className="w-full mb-2 border p-2"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        className="w-full mb-2 border p-2"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <select
        className="w-full mb-4 border p-2"
        value={form.role}
        onChange={(e) =>
          setForm({ ...form, role: e.target.value as "admin" | "employee" })
        }
      >
        <option value="employee">Employee</option>
        <option value="admin">Admin</option>
      </select>
      <button className="bg-green-500 text-white py-2 px-4 rounded">
        Register
      </button>
    </form>
  );
};

export default Register;
