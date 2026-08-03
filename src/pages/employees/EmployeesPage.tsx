import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  SearchInput,
  Badge,
  Avatar,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Select,
  Pagination,
  EmptyState,
  ConfirmDialog,
  toast,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils";
import { useDeleteEmployee, useEmployees } from "@/hooks/useEmployees";
import { useDepartments } from "@/hooks/useDepartments";
import {
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import type { Employee } from "@/types";

const PAGE_SIZE = 8;

const statusBadgeVariant: Record<string, "success" | "secondary" | "destructive" | "warning"> = {
  active: "success",
  inactive: "secondary",
  terminated: "destructive",
  "on-leave": "warning",
};

const typeBadgeVariant: Record<string, "default" | "secondary" | "warning" | "outline"> = {
  "full-time": "default",
  "part-time": "secondary",
  contract: "warning",
  intern: "outline",
};

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const { data: result } = useEmployees({ page, limit: PAGE_SIZE, search, department_id: deptFilter || undefined, status: statusFilter as Employee["status"] || undefined, employment_type: typeFilter as Employee["employment_type"] || undefined });
  const { data: departments = [] } = useDepartments();
  const removeEmployee = useDeleteEmployee();
  const employees = result?.data ?? [];
  const totalPages = result?.total_pages ?? 1;
  const paginated = employees;

  const stats = {
    total: result?.total ?? 0,
    active: employees.filter((e) => e.status === "active").length,
    onLeave: employees.filter((e) => e.status === "on-leave").length,
    inactive: employees.filter((e) => e.status !== "active" && e.status !== "on-leave").length,
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removeEmployee.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
    toast("Employee removed successfully", "success");
  };

  const deptOptions = [
    { value: "", label: "All Departments" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Employees</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {employees.length} total employees in your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast("Employee report downloaded", "success")}
          >
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" onClick={() => navigate("/employees/new")}>
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, icon: Users, color: "text-violet-500 bg-violet-500/10" },
          { label: "Active", value: stats.active, icon: UserCheck, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "On Leave", value: stats.onLeave, icon: Clock, color: "text-amber-500 bg-amber-500/10" },
          { label: "Inactive", value: stats.inactive, icon: UserX, color: "text-rose-500 bg-rose-500/10" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search by name, email, ID..."
              className="flex-1"
            />
            <Select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
              options={deptOptions}
              className="sm:w-44"
            />
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              options={[
                { value: "", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "on-leave", label: "On Leave" },
                { value: "terminated", label: "Terminated" },
              ]}
              className="sm:w-36"
            />
            <Select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              options={[
                { value: "", label: "All Types" },
                { value: "full-time", label: "Full Time" },
                { value: "part-time", label: "Part Time" },
                { value: "contract", label: "Contract" },
                { value: "intern", label: "Intern" },
              ]}
              className="sm:w-36"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {filtered.length} {filtered.length === 1 ? "Employee" : "Employees"} Found
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages || 1}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          {paginated.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No employees found"
              description="Try adjusting your search or filter criteria."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((emp) => (
                  <TableRow
                    key={emp.id}
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm" />
                        <div>
                          <p className="font-semibold text-sm">
                            {emp.first_name} {emp.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {emp.employee_id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{emp.department_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {emp.designation_title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{emp.phone}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(emp.joining_date)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={typeBadgeVariant[emp.employment_type] ?? "outline"}>
                        {emp.employment_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {formatCurrency(emp.basic_salary)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant[emp.status] ?? "secondary"}>
                        {emp.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-1 justify-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => navigate(`/employees/${emp.id}`)}
                          className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/employees/${emp.id}/edit`)}
                          className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        description={`Are you sure you want to remove ${deleteTarget?.first_name} ${deleteTarget?.last_name}? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive
      />
    </div>
  );
}
