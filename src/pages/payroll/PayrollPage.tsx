import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Avatar,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Select,
  Dialog,
  StatCard,
  EmptyState,
  toast,
} from "@/components/ui";
import { mockPayroll, mockEmployees, mockDepartments } from "@/utils/mockData";
import { formatCurrency, calculatePayroll, getMonthName } from "@/utils";
import {
  DollarSign,
  Play,
  Download,
  Eye,
  CheckCircle,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import type { Payroll } from "@/types";

const STATUS_VARIANT: Record<string, "success" | "default" | "secondary" | "destructive"> = {
  paid: "success",
  processed: "default",
  draft: "secondary",
  cancelled: "destructive",
};

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>(mockPayroll);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [deptFilter, setDeptFilter] = useState("");
  const [viewPayslip, setViewPayslip] = useState<Payroll | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: getMonthName(i + 1),
  }));

  const years = [2024, 2023, 2022].map((y) => ({ value: String(y), label: String(y) }));

  const filtered = useMemo(() =>
    payrolls.filter((p) => {
      const emp = mockEmployees.find((e) => e.id === p.employee_id);
      return (
        p.month === selectedMonth &&
        p.year === selectedYear &&
        (!deptFilter || emp?.department_id === deptFilter)
      );
    }),
    [payrolls, selectedMonth, selectedYear, deptFilter]
  );

  const summary = useMemo(() => ({
    totalGross: filtered.reduce((s, p) => s + p.salary.gross_salary, 0),
    totalNet: filtered.reduce((s, p) => s + p.salary.net_salary, 0),
    totalDeductions: filtered.reduce((s, p) => s + p.salary.total_deductions, 0),
    totalPF: filtered.reduce((s, p) => s + p.salary.pf_employee + p.salary.pf_employer, 0),
    paid: filtered.filter((p) => p.status === "paid").length,
    pending: filtered.filter((p) => p.status !== "paid").length,
  }), [filtered]);

  const handleRunPayroll = async () => {
    setIsRunning(true);
    await new Promise((r) => setTimeout(r, 1500));
    // Generate payroll for employees not yet in payroll
    const newPayrolls: Payroll[] = mockEmployees
      .filter((e) => !payrolls.find((p) => p.employee_id === e.id && p.month === selectedMonth && p.year === selectedYear))
      .map((e) => {
        const salary = calculatePayroll({ basic_salary: e.basic_salary });
        return {
          id: `pay-${Date.now()}-${e.id}`,
          employee_id: e.id,
          employee_name: `${e.first_name} ${e.last_name}`,
          department_name: e.department_name,
          month: selectedMonth,
          year: selectedYear,
          status: "processed" as const,
          salary,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });
    setPayrolls((prev) => [...prev, ...newPayrolls]);
    setIsRunning(false);
    toast(`Payroll generated for ${getMonthName(selectedMonth)} ${selectedYear}`, "success");
  };

  const handleMarkPaid = (id: string) => {
    setPayrolls((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "paid", paid_on: new Date().toISOString() } : p
      )
    );
    toast("Marked as paid", "success");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payroll</h2>
          <p className="text-muted-foreground text-sm">
            {getMonthName(selectedMonth)} {selectedYear} payroll
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast("Payroll report downloaded", "success")}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" onClick={handleRunPayroll} isLoading={isRunning}>
            <Play className="h-4 w-4" /> Run Payroll
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Gross" value={formatCurrency(summary.totalGross)} icon={DollarSign} color="primary" />
        <StatCard title="Net Payout" value={formatCurrency(summary.totalNet)} icon={TrendingUp} color="success" />
        <StatCard title="Total Deductions" value={formatCurrency(summary.totalDeductions)} icon={AlertCircle} color="danger" />
        <StatCard title="PF Contribution" value={formatCurrency(summary.totalPF)} subtitle="Employee + Employer" icon={Users} color="info" />
      </div>

      {/* Paid/Pending Indicators */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-emerald-600">{summary.paid}</p>
              <p className="text-sm text-muted-foreground">Paid</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-amber-600">{summary.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3">
          <Select
            value={String(selectedMonth)}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            options={months}
            className="w-36"
          />
          <Select
            value={String(selectedYear)}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            options={years}
            className="w-28"
          />
          <Select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            options={[
              { value: "", label: "All Departments" },
              ...mockDepartments.map((d) => ({ value: d.id, label: d.name })),
            ]}
            className="w-48"
          />
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">{filtered.length} Employees</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No payroll generated"
              description="Click 'Run Payroll' to generate payroll for this month."
              action={
                <Button size="sm" onClick={handleRunPayroll} isLoading={isRunning}>
                  <Play className="h-4 w-4" /> Run Payroll
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Basic</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={p.employee_name ?? "E"} size="sm" />
                        <div>
                          <p className="font-medium text-sm">{p.employee_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {mockEmployees.find((e) => e.id === p.employee_id)?.employee_id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.department_name}</TableCell>
                    <TableCell className="text-sm">{formatCurrency(p.salary.basic)}</TableCell>
                    <TableCell className="text-sm font-medium text-emerald-600">{formatCurrency(p.salary.gross_salary)}</TableCell>
                    <TableCell className="text-sm text-rose-600">- {formatCurrency(p.salary.total_deductions)}</TableCell>
                    <TableCell className="font-bold">{formatCurrency(p.salary.net_salary)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[p.status] ?? "secondary"}>{p.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => setViewPayslip(p)}
                          className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          title="View Payslip"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toast("Payslip downloaded", "success")}
                          className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        {p.status !== "paid" && (
                          <button
                            onClick={() => handleMarkPaid(p.id)}
                            className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 flex items-center justify-center text-muted-foreground hover:text-emerald-500 transition-colors"
                            title="Mark Paid"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payslip Preview Dialog */}
      {viewPayslip && (
        <Dialog
          open
          onClose={() => setViewPayslip(null)}
          title="Payslip Preview"
          description={`${viewPayslip.employee_name} · ${getMonthName(viewPayslip.month)} ${viewPayslip.year}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Company Header */}
            <div className="flex justify-between items-start p-4 gradient-primary rounded-xl text-white">
              <div>
                <h3 className="font-bold text-lg">PayrollPro HRMS</h3>
                <p className="text-white/80 text-sm">123 Tech Park, Bangalore - 560001</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Payslip</p>
                <p className="text-white/80 text-sm">{getMonthName(viewPayslip.month)} {viewPayslip.year}</p>
              </div>
            </div>

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Employee Name", value: viewPayslip.employee_name },
                { label: "Department", value: viewPayslip.department_name },
                { label: "Employee ID", value: mockEmployees.find((e) => e.id === viewPayslip.employee_id)?.employee_id },
                { label: "Designation", value: mockEmployees.find((e) => e.id === viewPayslip.employee_id)?.designation_title },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-muted-foreground text-xs">{f.label}</p>
                  <p className="font-semibold">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Earnings & Deductions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-emerald-600 mb-2 text-sm">Earnings</p>
                {[
                  ["Basic Salary", viewPayslip.salary.basic],
                  ["HRA", viewPayslip.salary.hra],
                  ["DA", viewPayslip.salary.da],
                  ["Medical", viewPayslip.salary.medical_allowance],
                  ["Travel", viewPayslip.salary.travel_allowance],
                  ["Bonus", viewPayslip.salary.bonus],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between text-xs py-1 border-b border-border">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{formatCurrency(val as number)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2">
                  <span>Gross</span>
                  <span className="text-emerald-600">{formatCurrency(viewPayslip.salary.gross_salary)}</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-rose-600 mb-2 text-sm">Deductions</p>
                {[
                  ["PF (Employee)", viewPayslip.salary.pf_employee],
                  ["ESI (Employee)", viewPayslip.salary.esi_employee],
                  ["Professional Tax", viewPayslip.salary.professional_tax],
                  ["Income Tax", viewPayslip.salary.income_tax],
                  ["Loan Deduction", viewPayslip.salary.loan_deduction],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between text-xs py-1 border-b border-border">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-rose-600">- {formatCurrency(val as number)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2">
                  <span>Total Deductions</span>
                  <span className="text-rose-600">- {formatCurrency(viewPayslip.salary.total_deductions)}</span>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="p-4 gradient-primary rounded-xl text-white flex justify-between items-center">
              <span className="font-semibold">Net Take-Home Salary</span>
              <span className="text-2xl font-bold">{formatCurrency(viewPayslip.salary.net_salary)}</span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => toast("Payslip emailed", "success")}>
                📧 Email Payslip
              </Button>
              <Button className="flex-1" onClick={() => toast("Payslip downloaded", "success")}>
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
