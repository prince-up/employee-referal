import type {
  Employee,
  Department,
  Designation,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  Payroll,
  DashboardStats,
  RecentActivity,
  Notification,
  AuditLog,
} from "@/types";

// =============================================
// DEPARTMENTS
// =============================================
export const mockDepartments: Department[] = [
  { id: "d1", name: "Engineering", code: "ENG", description: "Software development team", employee_count: 28, head_id: "e1", head_name: "Rahul Verma", created_at: "2023-01-15T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "d2", name: "Human Resources", code: "HR", description: "People & culture team", employee_count: 8, head_id: "e2", head_name: "Priya Sharma", created_at: "2023-01-15T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "d3", name: "Finance", code: "FIN", description: "Finance & accounting team", employee_count: 12, head_id: "e3", head_name: "Anita Gupta", created_at: "2023-01-15T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "d4", name: "Marketing", code: "MKT", description: "Marketing & branding team", employee_count: 10, head_id: "e4", head_name: "Vikram Nair", created_at: "2023-01-15T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "d5", name: "Sales", code: "SLS", description: "Business development & sales", employee_count: 18, head_id: "e5", head_name: "Deepak Joshi", created_at: "2023-01-15T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "d6", name: "Operations", code: "OPS", description: "Operations & logistics", employee_count: 14, head_id: "e6", head_name: "Meena Pillai", created_at: "2023-01-15T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "d7", name: "Design", code: "DES", description: "UI/UX & graphic design", employee_count: 6, head_id: "e7", head_name: "Sneha Iyer", created_at: "2023-01-15T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
];

// =============================================
// DESIGNATIONS
// =============================================
export const mockDesignations: Designation[] = [
  { id: "des1", title: "Software Engineer", department_id: "d1", department_name: "Engineering", level: 2, created_at: "2023-01-15T00:00:00Z" },
  { id: "des2", title: "Senior Software Engineer", department_id: "d1", department_name: "Engineering", level: 3, created_at: "2023-01-15T00:00:00Z" },
  { id: "des3", title: "Tech Lead", department_id: "d1", department_name: "Engineering", level: 4, created_at: "2023-01-15T00:00:00Z" },
  { id: "des4", title: "HR Executive", department_id: "d2", department_name: "Human Resources", level: 2, created_at: "2023-01-15T00:00:00Z" },
  { id: "des5", title: "HR Manager", department_id: "d2", department_name: "Human Resources", level: 4, created_at: "2023-01-15T00:00:00Z" },
  { id: "des6", title: "Accountant", department_id: "d3", department_name: "Finance", level: 2, created_at: "2023-01-15T00:00:00Z" },
  { id: "des7", title: "Finance Manager", department_id: "d3", department_name: "Finance", level: 4, created_at: "2023-01-15T00:00:00Z" },
  { id: "des8", title: "Marketing Executive", department_id: "d4", department_name: "Marketing", level: 2, created_at: "2023-01-15T00:00:00Z" },
  { id: "des9", title: "Sales Executive", department_id: "d5", department_name: "Sales", level: 2, created_at: "2023-01-15T00:00:00Z" },
  { id: "des10", title: "UI/UX Designer", department_id: "d7", department_name: "Design", level: 2, created_at: "2023-01-15T00:00:00Z" },
];

// =============================================
// EMPLOYEES
// =============================================
export const mockEmployees: Employee[] = [
  {
    id: "e1", employee_id: "EMP0001", first_name: "Rahul", last_name: "Verma",
    email: "rahul.verma@company.com", phone: "9876543210", gender: "male",
    dob: "1990-05-15", address: "123 MG Road", city: "Bangalore", state: "Karnataka", pincode: "560001",
    department_id: "d1", department_name: "Engineering", designation_id: "des3", designation_title: "Tech Lead",
    joining_date: "2021-03-01", employment_type: "full-time", status: "active",
    bank_name: "HDFC Bank", bank_account: "12345678901234", ifsc_code: "HDFC0001234",
    pan_number: "ABCDE1234F", aadhar_number: "123456789012", pf_number: "PF001234", esi_number: "ESI001234", uan_number: "UAN001234",
    basic_salary: 80000, created_at: "2021-03-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "e2", employee_id: "EMP0002", first_name: "Priya", last_name: "Sharma",
    email: "priya.sharma@company.com", phone: "9876543211", gender: "female",
    dob: "1992-08-22", address: "456 Koramangala", city: "Bangalore", state: "Karnataka", pincode: "560034",
    department_id: "d2", department_name: "Human Resources", designation_id: "des5", designation_title: "HR Manager",
    joining_date: "2020-06-15", employment_type: "full-time", status: "active",
    bank_name: "ICICI Bank", bank_account: "98765432101234", ifsc_code: "ICIC0001234",
    pan_number: "BCDEF2345G", aadhar_number: "234567890123", pf_number: "PF002345", esi_number: "ESI002345", uan_number: "UAN002345",
    basic_salary: 70000, created_at: "2020-06-15T00:00:00Z", updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "e3", employee_id: "EMP0003", first_name: "Anita", last_name: "Gupta",
    email: "anita.gupta@company.com", phone: "9876543212", gender: "female",
    dob: "1988-11-10", address: "789 Indiranagar", city: "Bangalore", state: "Karnataka", pincode: "560038",
    department_id: "d3", department_name: "Finance", designation_id: "des7", designation_title: "Finance Manager",
    joining_date: "2019-09-01", employment_type: "full-time", status: "active",
    bank_name: "SBI", bank_account: "11111222223333", ifsc_code: "SBIN0001234",
    pan_number: "CDEFG3456H", aadhar_number: "345678901234", pf_number: "PF003456", esi_number: "ESI003456", uan_number: "UAN003456",
    basic_salary: 75000, created_at: "2019-09-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "e4", employee_id: "EMP0004", first_name: "Vikram", last_name: "Nair",
    email: "vikram.nair@company.com", phone: "9876543213", gender: "male",
    dob: "1991-03-25", address: "234 HSR Layout", city: "Bangalore", state: "Karnataka", pincode: "560102",
    department_id: "d4", department_name: "Marketing", designation_id: "des8", designation_title: "Marketing Executive",
    joining_date: "2022-01-10", employment_type: "full-time", status: "active",
    bank_name: "Axis Bank", bank_account: "44444555556666", ifsc_code: "UTIB0001234",
    pan_number: "DEFGH4567I", aadhar_number: "456789012345", pf_number: "PF004567",
    basic_salary: 55000, created_at: "2022-01-10T00:00:00Z", updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "e5", employee_id: "EMP0005", first_name: "Deepak", last_name: "Joshi",
    email: "deepak.joshi@company.com", phone: "9876543214", gender: "male",
    dob: "1987-07-18", address: "567 Whitefield", city: "Bangalore", state: "Karnataka", pincode: "560066",
    department_id: "d5", department_name: "Sales", designation_id: "des9", designation_title: "Sales Executive",
    joining_date: "2020-11-05", employment_type: "full-time", status: "active",
    bank_name: "Kotak Mahindra", bank_account: "77777888889999", ifsc_code: "KKBK0001234",
    pan_number: "EFGHI5678J", aadhar_number: "567890123456",
    basic_salary: 60000, created_at: "2020-11-05T00:00:00Z", updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "e6", employee_id: "EMP0006", first_name: "Meena", last_name: "Pillai",
    email: "meena.pillai@company.com", phone: "9876543215", gender: "female",
    dob: "1993-12-05", address: "890 Electronic City", city: "Bangalore", state: "Karnataka", pincode: "560100",
    department_id: "d6", department_name: "Operations", designation_id: "des3", designation_title: "Tech Lead",
    joining_date: "2021-07-20", employment_type: "full-time", status: "active",
    bank_name: "Yes Bank", bank_account: "10101010101010", ifsc_code: "YESB0001234",
    pan_number: "FGHIJ6789K", aadhar_number: "678901234567",
    basic_salary: 65000, created_at: "2021-07-20T00:00:00Z", updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "e7", employee_id: "EMP0007", first_name: "Sneha", last_name: "Iyer",
    email: "sneha.iyer@company.com", phone: "9876543216", gender: "female",
    dob: "1995-04-30", address: "111 JP Nagar", city: "Bangalore", state: "Karnataka", pincode: "560078",
    department_id: "d7", department_name: "Design", designation_id: "des10", designation_title: "UI/UX Designer",
    joining_date: "2023-02-14", employment_type: "full-time", status: "active",
    bank_name: "HDFC Bank", bank_account: "12121212121212", ifsc_code: "HDFC0005678",
    pan_number: "GHIJK7890L", aadhar_number: "789012345678",
    basic_salary: 50000, created_at: "2023-02-14T00:00:00Z", updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "e8", employee_id: "EMP0008", first_name: "Amit", last_name: "Singh",
    email: "emp@hrms.com", phone: "9876543217", gender: "male",
    dob: "1994-09-12", address: "222 Bellandur", city: "Bangalore", state: "Karnataka", pincode: "560103",
    department_id: "d1", department_name: "Engineering", designation_id: "des2", designation_title: "Senior Software Engineer",
    joining_date: "2022-05-01", employment_type: "full-time", status: "active",
    bank_name: "SBI", bank_account: "13131313131313", ifsc_code: "SBIN0005678",
    pan_number: "HIJKL8901M", aadhar_number: "890123456789",
    basic_salary: 65000, created_at: "2022-05-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "e9", employee_id: "EMP0009", first_name: "Ravi", last_name: "Kumar",
    email: "ravi.kumar@company.com", phone: "9876543218", gender: "male",
    dob: "1989-02-28", address: "333 BTM Layout", city: "Bangalore", state: "Karnataka", pincode: "560076",
    department_id: "d1", department_name: "Engineering", designation_id: "des1", designation_title: "Software Engineer",
    joining_date: "2023-08-01", employment_type: "full-time", status: "active",
    bank_name: "ICICI Bank", bank_account: "14141414141414", ifsc_code: "ICIC0005678",
    pan_number: "IJKLM9012N", aadhar_number: "901234567890",
    basic_salary: 45000, created_at: "2023-08-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "e10", employee_id: "EMP0010", first_name: "Pooja", last_name: "Mehta",
    email: "pooja.mehta@company.com", phone: "9876543219", gender: "female",
    dob: "1996-06-15", address: "444 Sarjapur Road", city: "Bangalore", state: "Karnataka", pincode: "560035",
    department_id: "d4", department_name: "Marketing", designation_id: "des8", designation_title: "Marketing Executive",
    joining_date: "2023-11-01", employment_type: "contract", status: "active",
    bank_name: "Axis Bank", bank_account: "15151515151515", ifsc_code: "UTIB0005678",
    pan_number: "JKLMN0123O", aadhar_number: "012345678901",
    basic_salary: 35000, created_at: "2023-11-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z",
  },
];

// =============================================
// ATTENDANCE
// =============================================
const today = new Date().toISOString().split("T")[0];
export const mockAttendance: AttendanceRecord[] = mockEmployees.slice(0, 8).map((e, i) => ({
  id: `att${i + 1}`,
  employee_id: e.id,
  employee_name: `${e.first_name} ${e.last_name}`,
  date: today,
  status: i === 2 ? "absent" : i === 4 ? "half-day" : i === 6 ? "late" : "present",
  check_in: i === 2 ? undefined : "09:05",
  check_out: i === 2 ? undefined : i === 4 ? "13:00" : "18:30",
  working_hours: i === 2 ? 0 : i === 4 ? 4 : 9.5,
  created_at: new Date().toISOString(),
}));

// =============================================
// LEAVE REQUESTS
// =============================================
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "lr1", employee_id: "e4", employee_name: "Vikram Nair", department_name: "Marketing",
    leave_type: "casual", from_date: "2024-08-10", to_date: "2024-08-12", days: 3,
    reason: "Family function", status: "pending", created_at: "2024-08-05T09:00:00Z",
  },
  {
    id: "lr2", employee_id: "e7", employee_name: "Sneha Iyer", department_name: "Design",
    leave_type: "medical", from_date: "2024-08-08", to_date: "2024-08-09", days: 2,
    reason: "Doctor appointment and recovery", status: "approved", approved_by: "Priya Sharma",
    approved_at: "2024-08-07T14:00:00Z", created_at: "2024-08-06T11:00:00Z",
  },
  {
    id: "lr3", employee_id: "e9", employee_name: "Ravi Kumar", department_name: "Engineering",
    leave_type: "earned", from_date: "2024-08-15", to_date: "2024-08-20", days: 6,
    reason: "Annual vacation", status: "pending", created_at: "2024-08-03T10:00:00Z",
  },
  {
    id: "lr4", employee_id: "e5", employee_name: "Deepak Joshi", department_name: "Sales",
    leave_type: "casual", from_date: "2024-07-25", to_date: "2024-07-25", days: 1,
    reason: "Personal work", status: "rejected", rejection_reason: "Critical deadline",
    created_at: "2024-07-22T09:00:00Z",
  },
  {
    id: "lr5", employee_id: "e10", employee_name: "Pooja Mehta", department_name: "Marketing",
    leave_type: "unpaid", from_date: "2024-08-22", to_date: "2024-08-23", days: 2,
    reason: "Personal emergency", status: "pending", created_at: "2024-08-07T16:00:00Z",
  },
];

export const mockLeaveBalances: LeaveBalance[] = mockEmployees.map((e, i) => ({
  id: `lb${i + 1}`,
  employee_id: e.id,
  year: 2024,
  casual_total: 12, casual_used: Math.floor(Math.random() * 5), casual_remaining: 0,
  medical_total: 10, medical_used: Math.floor(Math.random() * 3), medical_remaining: 0,
  earned_total: 15, earned_used: Math.floor(Math.random() * 8), earned_remaining: 0,
  unpaid_used: Math.floor(Math.random() * 2),
})).map(b => ({
  ...b,
  casual_remaining: b.casual_total - b.casual_used,
  medical_remaining: b.medical_total - b.medical_used,
  earned_remaining: b.earned_total - b.earned_used,
}));

// =============================================
// PAYROLL
// =============================================
import { calculatePayroll } from "@/utils";

export const mockPayroll: Payroll[] = mockEmployees.slice(0, 8).map((e, i) => {
  const salary = calculatePayroll({ basic_salary: e.basic_salary, bonus: i % 3 === 0 ? 5000 : 0 });
  return {
    id: `pay${i + 1}`,
    employee_id: e.id,
    employee_name: `${e.first_name} ${e.last_name}`,
    department_name: e.department_name,
    month: 7,
    year: 2024,
    status: i < 5 ? "paid" : i === 5 ? "processed" : "draft",
    salary,
    paid_on: i < 5 ? "2024-07-31T00:00:00Z" : undefined,
    created_at: "2024-07-25T00:00:00Z",
    updated_at: "2024-07-31T00:00:00Z",
  };
});

// =============================================
// DASHBOARD STATS
// =============================================
export const mockDashboardStats: DashboardStats = {
  total_employees: 96,
  total_departments: 7,
  monthly_payroll: 5840000,
  today_present: 84,
  today_absent: 6,
  pending_leaves: 5,
  total_salary_expense: 68200000,
  active_employees: 91,
};

// =============================================
// RECENT ACTIVITIES
// =============================================
export const mockRecentActivities: RecentActivity[] = [
  { id: "a1", type: "employee_added", message: "New employee Ravi Kumar joined Engineering team", timestamp: "2024-08-03T09:30:00Z", user: "Priya Sharma" },
  { id: "a2", type: "leave_approved", message: "Sneha Iyer's medical leave (2 days) approved", timestamp: "2024-08-03T08:45:00Z", user: "Priya Sharma" },
  { id: "a3", type: "payroll_generated", message: "July 2024 payroll processed for 96 employees", timestamp: "2024-07-31T18:00:00Z", user: "System" },
  { id: "a4", type: "leave_applied", message: "Vikram Nair applied for 3-day casual leave", timestamp: "2024-08-03T07:00:00Z", user: "Vikram Nair" },
  { id: "a5", type: "attendance_marked", message: "Bulk attendance marked for today", timestamp: "2024-08-03T10:00:00Z", user: "System" },
  { id: "a6", type: "employee_added", message: "Pooja Mehta joined Marketing as Contract employee", timestamp: "2023-11-01T09:00:00Z", user: "Priya Sharma" },
];

// =============================================
// CHART DATA
// =============================================
export const monthlyPayrollData = [
  { month: "Jan", expense: 5200000, employees: 88 },
  { month: "Feb", expense: 5350000, employees: 90 },
  { month: "Mar", expense: 5420000, employees: 91 },
  { month: "Apr", expense: 5500000, employees: 92 },
  { month: "May", expense: 5600000, employees: 93 },
  { month: "Jun", expense: 5720000, employees: 94 },
  { month: "Jul", expense: 5840000, employees: 96 },
];

export const departmentData = [
  { name: "Engineering", value: 28, color: "#6366f1" },
  { name: "Sales", value: 18, color: "#8b5cf6" },
  { name: "Operations", value: 14, color: "#06b6d4" },
  { name: "Finance", value: 12, color: "#f59e0b" },
  { name: "Marketing", value: 10, color: "#10b981" },
  { name: "HR", value: 8, color: "#f43f5e" },
  { name: "Design", value: 6, color: "#ec4899" },
];

export const attendanceTrendData = [
  { day: "Mon", present: 88, absent: 5, leave: 3 },
  { day: "Tue", present: 90, absent: 4, leave: 2 },
  { day: "Wed", present: 85, absent: 7, leave: 4 },
  { day: "Thu", present: 91, absent: 3, leave: 2 },
  { day: "Fri", present: 84, absent: 6, leave: 6 },
];

// =============================================
// NOTIFICATIONS
// =============================================
export const mockNotifications: Notification[] = [
  { id: "n1", title: "Leave Request", message: "Vikram Nair has applied for 3 days casual leave", type: "info", read: false, created_at: "2024-08-03T09:00:00Z" },
  { id: "n2", title: "Payroll Processed", message: "July 2024 payroll has been successfully processed", type: "success", read: false, created_at: "2024-07-31T18:00:00Z" },
  { id: "n3", title: "Holiday Reminder", message: "Independence Day holiday on August 15th", type: "warning", read: true, created_at: "2024-08-01T09:00:00Z" },
  { id: "n4", title: "New Employee", message: "Pooja Mehta has been added to the system", type: "info", read: true, created_at: "2023-11-01T09:00:00Z" },
];

// =============================================
// AUDIT LOGS
// =============================================
export const mockAuditLogs: AuditLog[] = [
  { id: "al1", user_id: "1", user_name: "Rajesh Kumar", action: "CREATE", entity: "Employee", entity_id: "EMP0009", created_at: "2024-08-03T09:30:00Z" },
  { id: "al2", user_id: "2", user_name: "Priya Sharma", action: "APPROVE", entity: "LeaveRequest", entity_id: "lr2", created_at: "2024-08-03T08:45:00Z" },
  { id: "al3", user_id: "1", user_name: "Rajesh Kumar", action: "PROCESS", entity: "Payroll", created_at: "2024-07-31T18:00:00Z" },
  { id: "al4", user_id: "2", user_name: "Priya Sharma", action: "UPDATE", entity: "Employee", entity_id: "EMP0002", created_at: "2024-07-28T14:00:00Z" },
];
