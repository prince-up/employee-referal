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
  Label,
  toast,
  EmptyState,
} from "@/components/ui";
import { mockEmployees, mockDepartments } from "@/utils/mockData";
import { formatDate } from "@/utils";
import { CalendarDays, CheckCircle, XCircle, Clock, AlertCircle, Users, Download } from "lucide-react";
import type { AttendanceStatus } from "@/types";

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: "success" | "destructive" | "warning" | "secondary" | "default" | "outline"; icon: React.ElementType }> = {
  present: { label: "Present", color: "success", icon: CheckCircle },
  absent: { label: "Absent", color: "destructive", icon: XCircle },
  "half-day": { label: "Half Day", color: "warning", icon: Clock },
  leave: { label: "On Leave", color: "secondary", icon: CalendarDays },
  holiday: { label: "Holiday", color: "outline", icon: CalendarDays },
  late: { label: "Late", color: "warning", icon: Clock },
  overtime: { label: "Overtime", color: "default", icon: CheckCircle },
};

interface AttendanceEntry {
  employee_id: string;
  status: AttendanceStatus;
  check_in: string;
  check_out: string;
  remarks: string;
}

export default function AttendancePage() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [deptFilter, setDeptFilter] = useState("");
  const [viewMode, setViewMode] = useState<"today" | "history">("today");

  // Initialize attendance for all employees
  const [attendance, setAttendance] = useState<Record<string, AttendanceEntry>>(() => {
    const init: Record<string, AttendanceEntry> = {};
    mockEmployees.forEach((e, i) => {
      init[e.id] = {
        employee_id: e.id,
        status: i === 2 ? "absent" : i === 4 ? "half-day" : i === 6 ? "late" : "present",
        check_in: i === 2 ? "" : "09:00",
        check_out: i === 2 ? "" : i === 4 ? "13:00" : "18:30",
        remarks: "",
      };
    });
    return init;
  });

  const [bulkStatus, setBulkStatus] = useState<AttendanceStatus>("present");
  const [isSaving, setIsSaving] = useState(false);

  const filteredEmps = useMemo(() =>
    mockEmployees.filter((e) => !deptFilter || e.department_id === deptFilter),
    [deptFilter]
  );

  const summary = useMemo(() => {
    const vals = Object.values(attendance);
    return {
      present: vals.filter((v) => v.status === "present").length,
      absent: vals.filter((v) => v.status === "absent").length,
      halfDay: vals.filter((v) => v.status === "half-day").length,
      late: vals.filter((v) => v.status === "late").length,
      leave: vals.filter((v) => v.status === "leave").length,
    };
  }, [attendance]);

  const handleStatusChange = (empId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [empId]: { ...prev[empId], status },
    }));
  };

  const handleBulkMark = () => {
    const updated = { ...attendance };
    filteredEmps.forEach((e) => {
      updated[e.id] = { ...updated[e.id], status: bulkStatus };
    });
    setAttendance(updated);
    toast(`All employees marked as ${bulkStatus}`, "success");
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast("Attendance saved successfully", "success");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Attendance Management</h2>
          <p className="text-muted-foreground text-sm">
            {formatDate(selectedDate)} · {mockEmployees.length} employees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast("Report exported", "success")}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" onClick={handleSave} isLoading={isSaving}>
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Present", count: summary.present, color: "text-emerald-500 bg-emerald-500/10", icon: CheckCircle },
          { label: "Absent", count: summary.absent, color: "text-rose-500 bg-rose-500/10", icon: XCircle },
          { label: "Half Day", count: summary.halfDay, color: "text-amber-500 bg-amber-500/10", icon: Clock },
          { label: "Late", count: summary.late, color: "text-orange-500 bg-orange-500/10", icon: AlertCircle },
          { label: "On Leave", count: summary.leave, color: "text-blue-500 bg-blue-500/10", icon: CalendarDays },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${s.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{s.count}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={today}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              options={[
                { value: "", label: "All Departments" },
                ...mockDepartments.map((d) => ({ value: d.id, label: d.name })),
              ]}
              className="sm:w-48"
            />
            <div className="flex gap-2 items-end">
              <Select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as AttendanceStatus)}
                options={[
                  { value: "present", label: "Present" },
                  { value: "absent", label: "Absent" },
                  { value: "half-day", label: "Half Day" },
                  { value: "leave", label: "On Leave" },
                  { value: "holiday", label: "Holiday" },
                ]}
                className="w-36"
              />
              <Button variant="outline" size="sm" onClick={handleBulkMark}>
                <Users className="h-4 w-4" /> Bulk Mark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmps.map((emp) => {
                const att = attendance[emp.id];
                if (!att) return null;
                const cfg = STATUS_CONFIG[att.status];
                const Icon = cfg.icon;
                const hours =
                  att.check_in && att.check_out
                    ? (() => {
                        const [h1, m1] = att.check_in.split(":").map(Number);
                        const [h2, m2] = att.check_out.split(":").map(Number);
                        return ((h2 * 60 + m2 - (h1 * 60 + m1)) / 60).toFixed(1);
                      })()
                    : "—";

                return (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm" />
                        <div>
                          <p className="font-medium text-sm">{emp.first_name} {emp.last_name}</p>
                          <p className="text-xs text-muted-foreground">{emp.employee_id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{emp.department_name}</TableCell>
                    <TableCell>
                      <input
                        type="time"
                        value={att.check_in}
                        onChange={(e) =>
                          setAttendance((prev) => ({
                            ...prev,
                            [emp.id]: { ...prev[emp.id], check_in: e.target.value },
                          }))
                        }
                        disabled={att.status === "absent" || att.status === "holiday" || att.status === "leave"}
                        className="h-8 rounded border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="time"
                        value={att.check_out}
                        onChange={(e) =>
                          setAttendance((prev) => ({
                            ...prev,
                            [emp.id]: { ...prev[emp.id], check_out: e.target.value },
                          }))
                        }
                        disabled={att.status === "absent" || att.status === "holiday" || att.status === "leave"}
                        className="h-8 rounded border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40"
                      />
                    </TableCell>
                    <TableCell className="text-sm font-medium">{hours}h</TableCell>
                    <TableCell>
                      <select
                        value={att.status}
                        onChange={(e) => handleStatusChange(emp.id, e.target.value as AttendanceStatus)}
                        className="h-8 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                          <option key={val} value={val}>{cfg.label}</option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
