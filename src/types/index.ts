// =============================================
// Core Types for Employee Payroll System
// =============================================

export type UserRole = "admin" | "hr" | "employee";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  employee_id?: string;
  organization_id?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// =============================================
// Department
// =============================================
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  head_id?: string;
  head_name?: string;
  employee_count: number;
  created_at: string;
  updated_at: string;
}

// =============================================
// Designation
// =============================================
export interface Designation {
  id: string;
  title: string;
  department_id: string;
  department_name?: string;
  level: number;
  created_at: string;
}

// =============================================
// Employee
// =============================================
export type EmploymentType = "full-time" | "part-time" | "contract" | "intern";
export type EmployeeStatus = "active" | "inactive" | "terminated" | "on-leave";
export type Gender = "male" | "female" | "other";

export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: Gender;
  dob: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  photo?: string;
  department_id: string;
  department_name?: string;
  designation_id: string;
  designation_title?: string;
  joining_date: string;
  employment_type: EmploymentType;
  status: EmployeeStatus;
  // Bank
  bank_name: string;
  bank_account: string;
  ifsc_code: string;
  // Compliance
  pan_number: string;
  aadhar_number: string;
  pf_number?: string;
  esi_number?: string;
  uan_number?: string;
  // Salary
  basic_salary: number;
  created_at: string;
  updated_at: string;
}

// =============================================
// Attendance
// =============================================
export type AttendanceStatus =
  | "present"
  | "absent"
  | "half-day"
  | "leave"
  | "holiday"
  | "late"
  | "overtime";

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  date: string;
  status: AttendanceStatus;
  check_in?: string;
  check_out?: string;
  working_hours?: number;
  overtime_hours?: number;
  remarks?: string;
  created_at: string;
}

// =============================================
// Leave
// =============================================
export type LeaveType = "casual" | "medical" | "earned" | "unpaid";
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name?: string;
  employee_photo?: string;
  department_name?: string;
  leave_type: LeaveType;
  from_date: string;
  to_date: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface LeaveBalance {
  id: string;
  employee_id: string;
  year: number;
  casual_total: number;
  casual_used: number;
  casual_remaining: number;
  medical_total: number;
  medical_used: number;
  medical_remaining: number;
  earned_total: number;
  earned_used: number;
  earned_remaining: number;
  unpaid_used: number;
}

// =============================================
// Payroll
// =============================================
export interface SalaryComponent {
  basic: number;
  hra: number;
  da: number;
  medical_allowance: number;
  travel_allowance: number;
  bonus: number;
  incentive: number;
  overtime_pay: number;
  gross_salary: number;
  // Deductions
  pf_employee: number;
  pf_employer: number;
  esi_employee: number;
  esi_employer: number;
  professional_tax: number;
  income_tax: number;
  loan_deduction: number;
  total_deductions: number;
  net_salary: number;
}

export interface Payroll {
  id: string;
  employee_id: string;
  employee_name?: string;
  department_name?: string;
  month: number;
  year: number;
  status: "draft" | "processed" | "paid" | "cancelled";
  salary: SalaryComponent;
  paid_on?: string;
  payslip_url?: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// Dashboard
// =============================================
export interface DashboardStats {
  total_employees: number;
  total_departments: number;
  monthly_payroll: number;
  today_present: number;
  today_absent: number;
  pending_leaves: number;
  total_salary_expense: number;
  active_employees: number;
}

export interface RecentActivity {
  id: string;
  type: "employee_added" | "leave_approved" | "payroll_generated" | "attendance_marked" | "leave_applied";
  message: string;
  timestamp: string;
  user?: string;
  avatar?: string;
}

// =============================================
// Notification
// =============================================
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}

// =============================================
// API Response
// =============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// =============================================
// Filters & Pagination
// =============================================
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface EmployeeFilters extends PaginationParams {
  department_id?: string;
  status?: EmployeeStatus;
  employment_type?: EmploymentType;
  gender?: Gender;
}

export interface AttendanceFilters extends PaginationParams {
  employee_id?: string;
  month?: number;
  year?: number;
  status?: AttendanceStatus;
}

// =============================================
// Audit Log
// =============================================
export interface AuditLog {
  id: string;
  user_id: string;
  user_name?: string;
  action: string;
  entity: string;
  entity_id?: string;
  changes?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}
