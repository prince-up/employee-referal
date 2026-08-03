import { supabase } from "@/lib/supabase";
import type { DashboardStats } from "@/types";

const fail = (error: Error | null) => { if (error) throw error; };

export interface DashboardData { stats: DashboardStats; departments: { name: string; value: number; color: string }[]; attendance: { day: string; present: number; absent: number; leave: number }[]; activities: { id: string; message: string; timestamp: string }[]; }
const colors = ["#6366f1", "#14b8a6", "#f59e0b", "#ec4899", "#0ea5e9", "#8b5cf6"];

export const dashboardService = {
  async get(): Promise<DashboardData> {
    const today = new Date().toISOString().slice(0, 10);
    const [employeesResult, departmentsResult, attendanceResult, leavesResult, payslipsResult, activityResult] = await Promise.all([
      supabase.from("employees").select("id, status, department_id, departments(name)"),
      supabase.from("departments").select("id, name"),
      supabase.from("attendance").select("date, status").eq("date", today),
      supabase.from("leave_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("payslips").select("net_salary, created_at"),
      supabase.from("audit_logs").select("id, action, entity, created_at").order("created_at", { ascending: false }).limit(6),
    ]);
    fail(employeesResult.error); fail(departmentsResult.error); fail(attendanceResult.error); fail(leavesResult.error); fail(payslipsResult.error); fail(activityResult.error);
    const employees = employeesResult.data ?? [], attendance = attendanceResult.data ?? [], departments = departmentsResult.data ?? [];
    const departmentMap = new Map<string, number>(); employees.forEach((employee: any) => { if (employee.department_id) departmentMap.set(employee.department_id, (departmentMap.get(employee.department_id) ?? 0) + 1); });
    const month = new Date().getMonth(), year = new Date().getFullYear();
    const monthlyPayroll = (payslipsResult.data ?? []).filter((p: any) => { const date = new Date(p.created_at); return date.getMonth() === month && date.getFullYear() === year; }).reduce((sum: number, p: any) => sum + Number(p.net_salary ?? 0), 0);
    return {
      stats: { total_employees: employees.length, active_employees: employees.filter((e: any) => e.status === "active").length, total_departments: departments.length, monthly_payroll: monthlyPayroll, total_salary_expense: (payslipsResult.data ?? []).reduce((sum: number, p: any) => sum + Number(p.net_salary ?? 0), 0), today_present: attendance.filter((a: any) => a.status === "present").length, today_absent: attendance.filter((a: any) => a.status === "absent").length, pending_leaves: leavesResult.count ?? 0 },
      departments: departments.map((department: any, index: number) => ({ name: department.name, value: departmentMap.get(department.id) ?? 0, color: colors[index % colors.length] })),
      attendance: [{ day: "Today", present: attendance.filter((a: any) => a.status === "present").length, absent: attendance.filter((a: any) => a.status === "absent").length, leave: attendance.filter((a: any) => a.status === "leave").length }],
      activities: (activityResult.data ?? []).map((activity: any) => ({ id: activity.id, message: `${activity.action} ${activity.entity}`, timestamp: activity.created_at })),
    };
  },
};
