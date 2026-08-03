import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Avatar,
  Separator,
} from "@/components/ui";
import {
  mockEmployees,
  mockLeaveBalances,
  mockPayroll,
} from "@/utils/mockData";
import { formatCurrency, formatDate, calculatePayroll } from "@/utils";
import {
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  CreditCard,
  FileText,
  Download,
  User,
  Banknote,
  Shield,
} from "lucide-react";

type Tab = "personal" | "employment" | "bank" | "salary" | "leave";

const mask = (s: string, keep = 4) =>
  s ? "*".repeat(Math.max(0, s.length - keep)) + s.slice(-keep) : "—";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  const employee = mockEmployees.find((e) => e.id === id);
  const leaveBalance = mockLeaveBalances.find((l) => l.employee_id === id);
  const payrolls = mockPayroll.filter((p) => p.employee_id === id).slice(0, 3);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Employee Not Found</h2>
        <p className="text-muted-foreground">The employee you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/employees")}>
          <ArrowLeft className="h-4 w-4" /> Back to Employees
        </Button>
      </div>
    );
  }

  const salary = calculatePayroll({ basic_salary: employee.basic_salary });
  const fullName = `${employee.first_name} ${employee.last_name}`;

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "personal", label: "Personal", icon: User },
    { key: "employment", label: "Employment", icon: Building2 },
    { key: "bank", label: "Bank & Compliance", icon: CreditCard },
    { key: "salary", label: "Salary", icon: Banknote },
    { key: "leave", label: "Leave Balance", icon: Calendar },
  ];

  const statusColors: Record<string, "success" | "secondary" | "destructive" | "warning"> = {
    active: "success",
    inactive: "secondary",
    terminated: "destructive",
    "on-leave": "warning",
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Employees
        </button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Download Profile
          </Button>
          <Button size="sm" onClick={() => navigate(`/employees/${id}/edit`)}>
            <Edit2 className="h-4 w-4" /> Edit Employee
          </Button>
        </div>
      </div>

      {/* Hero Card */}
      <Card className="overflow-hidden">
        <div className="h-24 gradient-primary" />
        <CardContent className="pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10">
            <Avatar name={fullName} size="xl" className="border-4 border-card shadow-lg" />
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <Badge variant={statusColors[employee.status] ?? "secondary"}>
                  {employee.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {employee.designation_title} · {employee.department_name}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {employee.employee_id}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:text-right">
              {[
                { label: "Basic Salary", value: formatCurrency(employee.basic_salary) },
                { label: "Joining Date", value: formatDate(employee.joining_date) },
                { label: "Type", value: employee.employment_type },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className="font-semibold text-sm capitalize">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-thin pb-0">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Personal */}
      {activeTab === "personal" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Full Name", value: fullName, icon: User },
                { label: "Date of Birth", value: formatDate(employee.dob), icon: Calendar },
                { label: "Gender", value: employee.gender, icon: User },
                { label: "Email", value: employee.email, icon: Mail },
                { label: "Phone", value: employee.phone, icon: Phone },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{f.label}</p>
                      <p className="text-sm font-medium capitalize">{f.value}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{employee.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {employee.city}, {employee.state} - {employee.pincode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Employment */}
      {activeTab === "employment" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Employment Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Employee ID", value: employee.employee_id },
                { label: "Department", value: employee.department_name ?? "—" },
                { label: "Designation", value: employee.designation_title ?? "—" },
                { label: "Joining Date", value: formatDate(employee.joining_date) },
                { label: "Employment Type", value: employee.employment_type },
                { label: "Status", value: employee.status },
              ].map((f) => (
                <div key={f.label} className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{f.label}</p>
                  <p className="font-semibold capitalize">{f.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Bank & Compliance */}
      {activeTab === "bank" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> Bank Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Bank Name", value: employee.bank_name },
                { label: "Account Number", value: mask(employee.bank_account) },
                { label: "IFSC Code", value: employee.ifsc_code },
              ].map((f) => (
                <div key={f.label} className="flex justify-between py-2 border-b border-border last:border-0">
                  <p className="text-sm text-muted-foreground">{f.label}</p>
                  <p className="text-sm font-medium font-mono">{f.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Compliance Numbers</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "PAN Number", value: mask(employee.pan_number, 4) },
                { label: "Aadhar Number", value: mask(employee.aadhar_number, 4) },
                { label: "PF Number", value: employee.pf_number ?? "Not assigned" },
                { label: "ESI Number", value: employee.esi_number ?? "Not assigned" },
                { label: "UAN Number", value: employee.uan_number ?? "Not assigned" },
              ].map((f) => (
                <div key={f.label} className="flex justify-between py-2 border-b border-border last:border-0">
                  <p className="text-sm text-muted-foreground">{f.label}</p>
                  <p className="text-sm font-medium font-mono">{f.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Salary */}
      {activeTab === "salary" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base text-emerald-600 dark:text-emerald-400">Earnings</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Basic Salary", value: salary.basic },
                  { label: "HRA (40%)", value: salary.hra },
                  { label: "DA (10%)", value: salary.da },
                  { label: "Medical Allowance", value: salary.medical_allowance },
                  { label: "Travel Allowance", value: salary.travel_allowance },
                  { label: "Bonus", value: salary.bonus },
                  { label: "Incentive", value: salary.incentive },
                  { label: "Overtime Pay", value: salary.overtime_pay },
                ].map((e) => (
                  <div key={e.label} className="flex justify-between py-1.5 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{e.label}</span>
                    <span className="text-sm font-medium">{formatCurrency(e.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 font-bold">
                  <span>Gross Salary</span>
                  <span className="text-emerald-600">{formatCurrency(salary.gross_salary)}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base text-rose-600 dark:text-rose-400">Deductions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "PF (Employee 12%)", value: salary.pf_employee },
                  { label: "ESI (Employee 0.75%)", value: salary.esi_employee },
                  { label: "Professional Tax", value: salary.professional_tax },
                  { label: "Income Tax (TDS)", value: salary.income_tax },
                  { label: "Loan Deduction", value: salary.loan_deduction },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between py-1.5 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{d.label}</span>
                    <span className="text-sm font-medium text-rose-600">- {formatCurrency(d.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 font-bold">
                  <span>Total Deductions</span>
                  <span className="text-rose-600">- {formatCurrency(salary.total_deductions)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Net Salary */}
          <Card className="gradient-primary">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Net Take-Home Salary</p>
                <p className="text-3xl font-bold text-white mt-1">{formatCurrency(salary.net_salary)}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs">Annual CTC</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency((salary.gross_salary + salary.pf_employer + salary.esi_employer) * 12)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Payroll */}
          {payrolls.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Recent Payroll History</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month/Year</TableHead>
                      <TableHead>Gross</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrolls.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{new Date(p.year, p.month - 1).toLocaleString("default", { month: "long", year: "numeric" })}</TableCell>
                        <TableCell>{formatCurrency(p.salary.gross_salary)}</TableCell>
                        <TableCell className="text-rose-600">- {formatCurrency(p.salary.total_deductions)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(p.salary.net_salary)}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === "paid" ? "success" : p.status === "processed" ? "default" : "secondary"}>{p.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <button className="text-primary text-xs hover:underline flex items-center gap-1">
                            <FileText className="h-3 w-3" /> Payslip
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tab: Leave Balance */}
      {activeTab === "leave" && leaveBalance && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Casual Leave", used: leaveBalance.casual_used, total: leaveBalance.casual_total, remaining: leaveBalance.casual_remaining, color: "text-blue-500 bg-blue-500" },
              { label: "Medical Leave", used: leaveBalance.medical_used, total: leaveBalance.medical_total, remaining: leaveBalance.medical_remaining, color: "text-emerald-500 bg-emerald-500" },
              { label: "Earned Leave", used: leaveBalance.earned_used, total: leaveBalance.earned_total, remaining: leaveBalance.earned_remaining, color: "text-violet-500 bg-violet-500" },
              { label: "Unpaid Leave", used: leaveBalance.unpaid_used, total: 0, remaining: 0, color: "text-rose-500 bg-rose-500" },
            ].map((l) => (
              <Card key={l.label}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">{l.label}</p>
                    <span className={`text-xs font-bold ${l.color.split(" ")[0]}`}>
                      {l.remaining} left
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${l.color.split(" ")[1]}`}
                      style={{ width: l.total > 0 ? `${(l.used / l.total) * 100}%` : "0%" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{l.used} used</span>
                    <span>{l.total > 0 ? `${l.total} total` : "Unlimited"}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
