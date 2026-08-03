import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastContainer } from "@/components/ui";
import { ProtectedRoute, PublicRoute } from "@/routes/ProtectedRoute";

// Layouts
import MainLayout from "@/layouts/MainLayout";

// Pages — Auth
import LoginPage from "@/pages/auth/LoginPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import SignUpPage from "@/pages/auth/SignUpPage";

// Pages — Main
import DashboardPage from "@/pages/dashboard/DashboardPage";
import EmployeesPage from "@/pages/employees/EmployeesPage";
import EmployeeDetailPage from "@/pages/employees/EmployeeDetailPage";
import EmployeeFormPage from "@/pages/employees/EmployeeFormPage";
import DepartmentsPage from "@/pages/departments/DepartmentsPage";
import AttendancePage from "@/pages/attendance/AttendancePage";
import LeavePage from "@/pages/leave/LeavePage";
import PayrollPage from "@/pages/payroll/PayrollPage";
import PayslipsPage from "@/pages/payslips/PayslipsPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import AdminPage from "@/pages/admin/AdminPage";
import SettingsPage from "@/pages/settings/SettingsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
              </Route>

              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/employees" element={<EmployeesPage />} />
                  <Route path="/employees/new" element={<EmployeeFormPage />} />
                  <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                  <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
                  <Route path="/departments" element={<DepartmentsPage />} />
                  <Route path="/attendance" element={<AttendancePage />} />
                  <Route path="/leave" element={<LeavePage />} />
                  <Route path="/payroll" element={<PayrollPage />} />
                  <Route path="/payslips" element={<PayslipsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  {/* Admin only */}
                  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin" element={<AdminPage />} />
                  </Route>
                </Route>
              </Route>

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
