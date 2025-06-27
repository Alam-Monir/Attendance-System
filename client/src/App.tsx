import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/Dashboard";
import EmployeeDashboard from "@/pages/employee/Dashboard";
import { Login } from "@/pages/auth/Login";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/routes/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster richColors />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/auth/login" element={<Login />} />
          {/* <Route path="/auth/register" element={<Register />} /> */}

          {/* Protected admin routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Protected employee routes */}
          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route path="/employee" element={<EmployeeDashboard />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
