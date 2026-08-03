import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency formatter (Indian Rupees)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(dateStr: string, fmt = "dd MMM yyyy"): string {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

// Format date time
export function formatDateTime(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "dd MMM yyyy, hh:mm a");
  } catch {
    return dateStr;
  }
}

// Relative time
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Generate employee ID
export function generateEmployeeId(count: number): string {
  return `EMP${String(count + 1).padStart(4, "0")}`;
}

// Get status color
export function getStatusColor(
  status: string
): "default" | "destructive" | "outline" | "secondary" {
  switch (status.toLowerCase()) {
    case "active":
    case "present":
    case "approved":
    case "paid":
    case "processed":
      return "default";
    case "inactive":
    case "absent":
    case "rejected":
    case "terminated":
    case "cancelled":
      return "destructive";
    case "pending":
    case "half-day":
    case "draft":
    case "on-leave":
      return "secondary";
    default:
      return "outline";
  }
}

// Payroll calculation
export interface PayrollInput {
  basic_salary: number;
  overtime_hours?: number;
  bonus?: number;
  incentive?: number;
  loan_deduction?: number;
}

export function calculatePayroll(input: PayrollInput) {
  const basic = input.basic_salary;
  const hra = basic * 0.4; // 40% of basic
  const da = basic * 0.1; // 10% of basic
  const medical = 1500;
  const travel = 1600;
  const bonus = input.bonus ?? 0;
  const incentive = input.incentive ?? 0;
  const overtime_pay = (input.overtime_hours ?? 0) * (basic / (26 * 8));

  const gross =
    basic + hra + da + medical + travel + bonus + incentive + overtime_pay;

  // Deductions
  const pf_employee = Math.min(basic * 0.12, 1800); // 12% of basic, max 1800
  const pf_employer = pf_employee;
  const esi_employee = gross > 21000 ? 0 : gross * 0.0075; // 0.75% if gross < 21000
  const esi_employer = gross > 21000 ? 0 : gross * 0.0325;
  const professional_tax = getProfessionalTax(gross);
  const income_tax = estimateIncomeTax(gross * 12) / 12;
  const loan_deduction = input.loan_deduction ?? 0;

  const total_deductions =
    pf_employee +
    esi_employee +
    professional_tax +
    income_tax +
    loan_deduction;

  const net = gross - total_deductions;

  return {
    basic,
    hra: Math.round(hra),
    da: Math.round(da),
    medical_allowance: medical,
    travel_allowance: travel,
    bonus,
    incentive,
    overtime_pay: Math.round(overtime_pay),
    gross_salary: Math.round(gross),
    pf_employee: Math.round(pf_employee),
    pf_employer: Math.round(pf_employer),
    esi_employee: Math.round(esi_employee),
    esi_employer: Math.round(esi_employer),
    professional_tax: Math.round(professional_tax),
    income_tax: Math.round(income_tax),
    loan_deduction: Math.round(loan_deduction),
    total_deductions: Math.round(total_deductions),
    net_salary: Math.round(net),
  };
}

function getProfessionalTax(gross: number): number {
  if (gross <= 10000) return 0;
  if (gross <= 15000) return 110;
  if (gross <= 20000) return 130;
  if (gross <= 25000) return 150;
  return 200;
}

function estimateIncomeTax(annualGross: number): number {
  // New tax regime FY 2024-25 simplified
  if (annualGross <= 300000) return 0;
  if (annualGross <= 700000) return (annualGross - 300000) * 0.05;
  if (annualGross <= 1000000)
    return 20000 + (annualGross - 700000) * 0.1;
  if (annualGross <= 1200000)
    return 50000 + (annualGross - 1000000) * 0.15;
  if (annualGross <= 1500000)
    return 80000 + (annualGross - 1200000) * 0.2;
  return 140000 + (annualGross - 1500000) * 0.3;
}

// Truncate text
export function truncate(text: string, length = 50): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Month name
export function getMonthName(month: number): string {
  return new Date(2024, month - 1).toLocaleString("default", { month: "long" });
}

// Download file
export function downloadFile(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
