import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  StatCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  toast,
} from "@/components/ui";
import { mockEmployees, mockPayroll, mockDepartments, departmentData, monthlyPayrollData } from "@/utils/mockData";
import { formatCurrency, formatDate, getMonthName } from "@/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  FileText,
  Download,
  Users,
  DollarSign,
  Building2,
  TrendingUp,
  FileSpreadsheet,
  FilePdf,
} from "lucide-react";

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<"payroll" | "employee" | "department" | "attendance">("payroll");

  const totalPayroll = mockPayroll.reduce((s, p) => s + p.salary.net_salary, 0);
  const totalEmployees = mockEmployees.length;
  const activeEmps = mockEmployees.filter((e) => e.status === "active").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground text-sm">
            Comprehensive insights across all HR modules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast("CSV exported", "success")}>
            <FileSpreadsheet className="h-4 w-4" /> CSV
          </Button>
          <Button size="sm" onClick={() => toast("PDF report downloaded", "success")}>
            <Download className="h-4 w-4" /> PDF Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={totalEmployees} icon={Users} color="primary" />
        <StatCard title="Active Employees" value={activeEmps} icon={Users} color="success" />
        <StatCard title="Monthly Payroll" value={formatCurrency(mockPayroll.reduce((s, p) => s + p.salary.gross_salary, 0))} icon={DollarSign} color="info" />
        <StatCard title="Departments" value={mockDepartments.length} icon={Building2} color="warning" />
      </div>

      {/* Report Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([
          { key: "payroll", label: "Payroll Report" },
          { key: "employee", label: "Employee Report" },
          { key: "department", label: "Department Report" },
          { key: "attendance", label: "Salary Report" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveReport(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeReport === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Payroll Report */}
      {activeReport === "payroll" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Payroll Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={monthlyPayrollData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => [formatCurrency(v), "Payroll"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="expense" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Employee Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={monthlyPayrollData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="employees" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Payroll Summary — July 2024</CardTitle>
                <Button size="sm" variant="outline" onClick={() => toast("Table exported", "success")}>
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>PF</TableHead>
                    <TableHead>ESI</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayroll.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-sm">{p.employee_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.department_name}</TableCell>
                      <TableCell className="text-sm">{formatCurrency(p.salary.gross_salary)}</TableCell>
                      <TableCell className="text-sm">{formatCurrency(p.salary.pf_employee + p.salary.pf_employer)}</TableCell>
                      <TableCell className="text-sm">{formatCurrency(p.salary.esi_employee + p.salary.esi_employer)}</TableCell>
                      <TableCell className="text-sm">{formatCurrency(p.salary.income_tax)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(p.salary.net_salary)}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === "paid" ? "success" : "secondary"}>{p.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Employee Report */}
      {activeReport === "employee" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Department Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={departmentData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {departmentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Employment Type Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4 pt-4">
                  {(["full-time", "part-time", "contract", "intern"] as const).map((type) => {
                    const count = mockEmployees.filter((e) => e.employment_type === type).length;
                    const pct = Math.round((count / mockEmployees.length) * 100);
                    const colors: Record<string, string> = { "full-time": "bg-violet-500", "part-time": "bg-blue-500", contract: "bg-amber-500", intern: "bg-emerald-500" };
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize font-medium">{type}</span>
                          <span className="text-muted-foreground">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colors[type]} transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-base">Employee Directory</CardTitle>
                <Button size="sm" variant="outline" onClick={() => toast("Exported", "success")}><Download className="h-4 w-4" /> Export</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Joining Date</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEmployees.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium text-sm">{e.first_name} {e.last_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.department_name}</TableCell>
                      <TableCell className="text-sm">{e.designation_title}</TableCell>
                      <TableCell><Badge variant="secondary">{e.employment_type}</Badge></TableCell>
                      <TableCell className="text-sm">{formatDate(e.joining_date)}</TableCell>
                      <TableCell className="text-sm font-medium">{formatCurrency(e.basic_salary)}</TableCell>
                      <TableCell><Badge variant={e.status === "active" ? "success" : "secondary"}>{e.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Department Report */}
      {activeReport === "department" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-base">Department Report</CardTitle>
              <Button size="sm" variant="outline" onClick={() => toast("Exported", "success")}><Download className="h-4 w-4" /> Export</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Head</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Avg Salary</TableHead>
                  <TableHead>Total Payroll</TableHead>
                  <TableHead>% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDepartments.map((d) => {
                  const emps = mockEmployees.filter((e) => e.department_id === d.id);
                  const avg = emps.length > 0 ? emps.reduce((s, e) => s + e.basic_salary, 0) / emps.length : 0;
                  const total = emps.reduce((s, e) => s + e.basic_salary, 0);
                  const allTotal = mockEmployees.reduce((s, e) => s + e.basic_salary, 0);
                  const pct = allTotal > 0 ? ((total / allTotal) * 100).toFixed(1) : "0";
                  return (
                    <TableRow key={d.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">{d.code.slice(0, 2)}</div>
                          <span className="font-medium text-sm">{d.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{d.head_name ?? "—"}</TableCell>
                      <TableCell className="text-sm font-semibold">{emps.length}</TableCell>
                      <TableCell className="text-sm">{formatCurrency(avg)}</TableCell>
                      <TableCell className="text-sm font-semibold">{formatCurrency(total)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{pct}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Salary Report */}
      {activeReport === "attendance" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-base">Salary Range Report</CardTitle>
              <Button size="sm" variant="outline" onClick={() => toast("Exported", "success")}><Download className="h-4 w-4" /> Export</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { range: "< ₹40,000", color: "bg-blue-500" },
                { range: "₹40,000 – ₹60,000", color: "bg-violet-500" },
                { range: "₹60,000 – ₹80,000", color: "bg-emerald-500" },
                { range: "> ₹80,000", color: "bg-amber-500" },
              ].map((r, i) => {
                const counts = [
                  mockEmployees.filter((e) => e.basic_salary < 40000).length,
                  mockEmployees.filter((e) => e.basic_salary >= 40000 && e.basic_salary < 60000).length,
                  mockEmployees.filter((e) => e.basic_salary >= 60000 && e.basic_salary < 80000).length,
                  mockEmployees.filter((e) => e.basic_salary >= 80000).length,
                ];
                const pct = Math.round((counts[i] / mockEmployees.length) * 100);
                return (
                  <div key={r.range} className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full ${r.color}`} />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{r.range}</span>
                        <span className="text-muted-foreground">{counts[i]} employees ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${r.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
