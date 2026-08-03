import { useState } from "react";
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
  Dialog,
  Input,
  Label,
  Select,
  ConfirmDialog,
  EmptyState,
  SearchInput,
  toast,
} from "@/components/ui";
import { mockDepartments, mockEmployees } from "@/utils/mockData";
import { Building2, Plus, Edit2, Trash2, Users, ChevronRight } from "lucide-react";
import type { Department } from "@/types";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Department | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", code: "", description: "", head_id: "" });
  const [isLoading, setIsLoading] = useState(false);

  const filtered = departments.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: "", code: "", description: "", head_id: "" });
    setDialogOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditTarget(dept);
    setForm({ name: dept.name, code: dept.code, description: dept.description ?? "", head_id: dept.head_id ?? "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.code) {
      toast("Name and code are required", "error");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    if (editTarget) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editTarget.id
            ? { ...d, ...form, updated_at: new Date().toISOString() }
            : d
        )
      );
      toast("Department updated", "success");
    } else {
      const newDept: Department = {
        id: `d${Date.now()}`,
        ...form,
        employee_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setDepartments((prev) => [...prev, newDept]);
      toast("Department created", "success");
    }
    setIsLoading(false);
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDepartments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast("Department deleted", "success");
  };

  const headOptions = mockEmployees.map((e) => ({
    value: e.id,
    label: `${e.first_name} ${e.last_name}`,
  }));

  const totalEmp = departments.reduce((s, d) => s + d.employee_count, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Departments</h2>
          <p className="text-muted-foreground text-sm">
            {departments.length} departments · {totalEmp} employees
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> New Department
        </Button>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((dept) => {
          const empCount = mockEmployees.filter((e) => e.department_id === dept.id).length;
          const deptEmps = mockEmployees.filter((e) => e.department_id === dept.id).slice(0, 3);
          return (
            <Card key={dept.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {dept.code.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{dept.name}</h3>
                      <p className="text-xs text-muted-foreground">{dept.code}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(dept)}
                      className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-blue-500 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(dept)}
                      className="h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {dept.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{dept.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {deptEmps.map((e) => (
                      <Avatar
                        key={e.id}
                        name={`${e.first_name} ${e.last_name}`}
                        size="sm"
                        className="border-2 border-card"
                      />
                    ))}
                    {empCount > 3 && (
                      <div className="h-8 w-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-semibold">
                        +{empCount - 3}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    {empCount} employees
                  </Badge>
                </div>

                {dept.head_name && (
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Department Head</p>
                      <p className="text-sm font-medium">{dept.head_name}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <EmptyState icon={Building2} title="No departments found" />
      )}

      {/* Table view */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">All Departments</CardTitle>
            <SearchInput value={search} onChange={setSearch} placeholder="Search departments..." className="w-56" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((dept) => {
                const count = mockEmployees.filter((e) => e.department_id === dept.id).length;
                return (
                  <TableRow key={dept.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
                          {dept.code.slice(0, 2)}
                        </div>
                        <span className="font-medium">{dept.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{dept.code}</Badge>
                    </TableCell>
                    <TableCell>{dept.head_name ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{count}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(dept)} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-blue-500 transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(dept)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editTarget ? "Edit Department" : "New Department"}
        description={editTarget ? "Update department details" : "Create a new department"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label required>Department Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Engineering"
              />
            </div>
            <div className="space-y-1.5">
              <Label required>Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="ENG"
                maxLength={6}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Department Head</Label>
            <Select
              value={form.head_id}
              onChange={(e) => setForm((f) => ({ ...f, head_id: e.target.value }))}
              options={headOptions}
              placeholder="Select head"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} isLoading={isLoading}>
              {editTarget ? "Save Changes" : "Create Department"}
            </Button>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? Employees in this department won't be deleted.`}
        confirmText="Delete"
        isDestructive
      />
    </div>
  );
}
