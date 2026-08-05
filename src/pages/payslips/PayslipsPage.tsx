import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Avatar,
  Select,
  Dialog,
  toast,
} from "@/components/ui";
import { mockPayroll, mockEmployees } from "@/utils/mockData";
import { formatCurrency, getMonthName } from "@/utils";
import { FileText, Download, Mail, Eye, Search } from "lucide-react";
import type { Payroll } from "@/types";

export default function PayslipsPage() {
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [viewPayslip, setViewPayslip] = useState<Payroll | null>(null);

  const filtered = mockPayroll.filter((p) => {
    const emp = mockEmployees.find((e) => e.id === p.employee_id);
    const name = `${emp?.first_name} ${emp?.last_name}`.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || emp?.employee_id?.toLowerCase().includes(search.toLowerCase());
    const matchMonth = !selectedMonth || p.month === Number(selectedMonth);
    return matchSearch && matchMonth;
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: getMonthName(i + 1),
  }));

  const sendEmail = (p: Payroll) => {
    toast(`Payslip emailed to ${p.employee_name}`, "success");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payslips</h2>
          <p className="text-muted-foreground text-sm">
            Generate, view, and email payslips to employees
          </p>
        </div>
        <Button onClick={() => toast("All payslips emailed", "success")}>
          <Mail className="h-4 w-4" /> Email All Payslips
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or employee ID..."
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={months}
            placeholder="All Months"
            className="w-40"
          />
        </CardContent>
      </Card>

      {/* Payslip Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const emp = mockEmployees.find((e) => e.id === p.employee_id);
          const statusColor = p.status === "paid" ? "success" : p.status === "processed" ? "default" : "secondary";
          return (
            <Card key={p.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.employee_name ?? "E"} size="md" />
                    <div>
                      <p className="font-semibold text-sm">{p.employee_name}</p>
                      <p className="text-xs text-muted-foreground">{emp?.employee_id}</p>
                    </div>
                  </div>
                  <Badge variant={statusColor as "success" | "default" | "secondary"}>{p.status}</Badge>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Month</span>
                    <span className="font-medium">{getMonthName(p.month)} {p.year}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gross Salary</span>
                    <span className="font-medium text-emerald-600">{formatCurrency(p.salary.gross_salary)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deductions</span>
                    <span className="font-medium text-rose-600">- {formatCurrency(p.salary.total_deductions)}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-sm">Net Salary</span>
                    <span className="font-bold text-primary">{formatCurrency(p.salary.net_salary)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => setViewPayslip(p)}
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => toast("Payslip downloaded", "success")}
                  >
                    <Download className="h-3.5 w-3.5" /> PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => sendEmail(p)}
                  >
                    <Mail className="h-3.5 w-3.5" /> Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold">No payslips found</h3>
          <p className="text-muted-foreground text-sm mt-1">Try changing the filter criteria</p>
        </div>
      )}

      {/* Payslip View Dialog */}
      {viewPayslip && (
        <Dialog
          open
          onClose={() => setViewPayslip(null)}
          title="Payslip"
          description={`${viewPayslip.employee_name} · ${getMonthName(viewPayslip.month)} ${viewPayslip.year}`}
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex justify-between items-start p-4 gradient-primary rounded-xl text-white">
              <div>
                <p className="font-bold text-lg">PayrollPro HRMS</p>
                <p className="text-white/70 text-sm">Confidential - Salary Slip</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{getMonthName(viewPayslip.month)} {viewPayslip.year}</p>
                <Badge variant="secondary" className="mt-1">{viewPayslip.status}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm border rounded-lg p-4">
              {[
                ["Name", viewPayslip.employee_name],
                ["Department", viewPayslip.department_name],
                ["ID", mockEmployees.find((e) => e.id === viewPayslip.employee_id)?.employee_id],
                ["Designation", mockEmployees.find((e) => e.id === viewPayslip.employee_id)?.designation_title],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">{k}</p>
                  <p className="font-medium mt-0.5">{v}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="font-semibold text-emerald-600 text-sm mb-3">Earnings</p>
                <div className="space-y-1.5 text-xs">
                  {[
                    ["Basic", viewPayslip.salary.basic],
                    ["HRA", viewPayslip.salary.hra],
                    ["DA", viewPayslip.salary.da],
                    ["Medical", viewPayslip.salary.medical_allowance],
                    ["Travel", viewPayslip.salary.travel_allowance],
                    ["Bonus", viewPayslip.salary.bonus],
                  ].map(([l, v]) => (
                    <div key={l as string} className="flex justify-between">
                      <span className="text-muted-foreground">{l}</span>
                      <span>{formatCurrency(v as number)}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 border-t flex justify-between font-bold text-sm">
                    <span>Gross</span>
                    <span className="text-emerald-600">{formatCurrency(viewPayslip.salary.gross_salary)}</span>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <p className="font-semibold text-rose-600 text-sm mb-3">Deductions</p>
                <div className="space-y-1.5 text-xs">
                  {[
                    ["PF", viewPayslip.salary.pf_employee],
                    ["ESI", viewPayslip.salary.esi_employee],
                    ["Prof. Tax", viewPayslip.salary.professional_tax],
                    ["Income Tax", viewPayslip.salary.income_tax],
                    ["Loan", viewPayslip.salary.loan_deduction],
                  ].map(([l, v]) => (
                    <div key={l as string} className="flex justify-between">
                      <span className="text-muted-foreground">{l}</span>
                      <span className="text-rose-600">- {formatCurrency(v as number)}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 border-t flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span className="text-rose-600">- {formatCurrency(viewPayslip.salary.total_deductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 gradient-primary rounded-xl flex justify-between text-white">
              <span className="font-semibold">Net Take-Home</span>
              <span className="text-xl font-bold">{formatCurrency(viewPayslip.salary.net_salary)}</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => sendEmail(viewPayslip)}>
                <Mail className="h-4 w-4" /> Email
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
