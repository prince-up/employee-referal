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
  Label,
  Input,
  Select,
  Textarea,
  EmptyState,
  ConfirmDialog,
  toast,
} from "@/components/ui";
import {
  mockLeaveRequests,
  mockLeaveBalances,
  mockEmployees,
} from "@/utils/mockData";
import { formatDate, formatCurrency } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import {
  ClipboardList,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
} from "lucide-react";
import type { LeaveRequest, LeaveStatus, LeaveType } from "@/types";

const TYPE_COLORS: Record<LeaveType, "default" | "success" | "warning" | "secondary"> = {
  casual: "default",
  medical: "success",
  earned: "warning",
  unpaid: "secondary",
};

const STATUS_COLORS: Record<LeaveStatus, "success" | "destructive" | "secondary" | "warning"> = {
  approved: "success",
  rejected: "destructive",
  pending: "warning",
  cancelled: "secondary",
};

export default function LeavePage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [applyOpen, setApplyOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState<LeaveRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [form, setForm] = useState({
    employee_id: "",
    leave_type: "casual" as LeaveType,
    from_date: "",
    to_date: "",
    reason: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const isHR = user?.role === "admin" || user?.role === "hr";

  const filtered = requests.filter((r) => {
    if (activeTab === "all") return true;
    return r.status === activeTab;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const handleApply = async () => {
    if (!form.employee_id || !form.from_date || !form.to_date || !form.reason) {
      toast("Please fill all required fields", "error");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const emp = mockEmployees.find((e) => e.id === form.employee_id);
    const from = new Date(form.from_date);
    const to = new Date(form.to_date);
    const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const newReq: LeaveRequest = {
      id: `lr${Date.now()}`,
      employee_id: form.employee_id,
      employee_name: emp ? `${emp.first_name} ${emp.last_name}` : "",
      department_name: emp?.department_name,
      leave_type: form.leave_type,
      from_date: form.from_date,
      to_date: form.to_date,
      days,
      reason: form.reason,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    setRequests((prev) => [newReq, ...prev]);
    setIsLoading(false);
    setApplyOpen(false);
    toast("Leave application submitted", "success");
  };

  const handleApprove = () => {
    if (!approveTarget) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === approveTarget.id
          ? { ...r, status: "approved", approved_by: user?.name, approved_at: new Date().toISOString() }
          : r
      )
    );
    setApproveTarget(null);
    toast("Leave approved successfully", "success");
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === rejectTarget.id
          ? { ...r, status: "rejected", rejection_reason: rejectionReason }
          : r
      )
    );
    setRejectTarget(null);
    setRejectionReason("");
    toast("Leave rejected", "info");
  };

  const leaveBalance = mockLeaveBalances[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <p className="text-muted-foreground text-sm">
            {pendingCount} pending request{pendingCount !== 1 ? "s" : ""} awaiting approval
          </p>
        </div>
        <Button onClick={() => setApplyOpen(true)}>
          <Plus className="h-4 w-4" /> Apply Leave
        </Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Casual Leave", used: leaveBalance.casual_used, total: leaveBalance.casual_total, remaining: leaveBalance.casual_remaining, color: "bg-blue-500/10 text-blue-600" },
          { label: "Medical Leave", used: leaveBalance.medical_used, total: leaveBalance.medical_total, remaining: leaveBalance.medical_remaining, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Earned Leave", used: leaveBalance.earned_used, total: leaveBalance.earned_total, remaining: leaveBalance.earned_remaining, color: "bg-violet-500/10 text-violet-600" },
          { label: "Unpaid Leave", used: leaveBalance.unpaid_used, total: 999, remaining: 999 - leaveBalance.unpaid_used, color: "bg-rose-500/10 text-rose-600" },
        ].map((b) => (
          <Card key={b.label}>
            <CardContent className="p-4">
              <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${b.color} mb-3`}>
                {b.label}
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold">{b.remaining === 999 ? "∞" : b.remaining}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{b.used} used</p>
                  <p className="text-xs text-muted-foreground">{b.total === 999 ? "Unlimited" : `of ${b.total}`}</p>
                </div>
              </div>
              {b.total !== 999 && (
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-current opacity-60 transition-all"
                    style={{ width: `${(b.used / b.total) * 100}%`, color: b.color.split(" ")[1] }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {tab === "pending" && pendingCount > 0 && (
              <span className="ml-2 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Leave Requests */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <EmptyState icon={ClipboardList} title="No leave requests" description="No requests match the selected filter." />
        )}
        {filtered.map((req) => (
          <Card key={req.id} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar name={req.employee_name ?? "E"} size="md" />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{req.employee_name}</p>
                      <Badge variant="secondary">{req.department_name}</Badge>
                      <Badge variant={TYPE_COLORS[req.leave_type]}>{req.leave_type}</Badge>
                      <Badge variant={STATUS_COLORS[req.status]}>{req.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{req.reason}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(req.from_date)} – {formatDate(req.to_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {req.days} day{req.days !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {req.rejection_reason && (
                      <p className="text-xs text-destructive">Reason: {req.rejection_reason}</p>
                    )}
                  </div>
                </div>
                {isHR && req.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-emerald-600 border-emerald-500/50 hover:bg-emerald-500/10"
                      onClick={() => setApproveTarget(req)}
                    >
                      <CheckCircle className="h-4 w-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/50 hover:bg-destructive/10"
                      onClick={() => { setRejectTarget(req); setRejectionReason(""); }}
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Apply Leave Dialog */}
      <Dialog open={applyOpen} onClose={() => setApplyOpen(false)} title="Apply for Leave" size="md">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label required>Employee</Label>
            <Select
              value={form.employee_id}
              onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
              options={mockEmployees.map((e) => ({ value: e.id, label: `${e.first_name} ${e.last_name}` }))}
              placeholder="Select employee"
            />
          </div>
          <div className="space-y-1.5">
            <Label required>Leave Type</Label>
            <Select
              value={form.leave_type}
              onChange={(e) => setForm((f) => ({ ...f, leave_type: e.target.value as LeaveType }))}
              options={[
                { value: "casual", label: "Casual Leave" },
                { value: "medical", label: "Medical Leave" },
                { value: "earned", label: "Earned Leave" },
                { value: "unpaid", label: "Unpaid Leave" },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label required>From Date</Label>
              <Input type="date" value={form.from_date} onChange={(e) => setForm((f) => ({ ...f, from_date: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label required>To Date</Label>
              <Input type="date" value={form.to_date} onChange={(e) => setForm((f) => ({ ...f, to_date: e.target.value }))} min={form.from_date} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label required>Reason</Label>
            <Textarea
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              placeholder="Provide reason for leave..."
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setApplyOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleApply} isLoading={isLoading}>Submit Application</Button>
          </div>
        </div>
      </Dialog>

      {/* Approve Confirm */}
      <ConfirmDialog
        open={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={handleApprove}
        title="Approve Leave"
        description={`Approve ${approveTarget?.days}-day ${approveTarget?.leave_type} leave for ${approveTarget?.employee_name}?`}
        confirmText="Approve"
      />

      {/* Reject Dialog */}
      <Dialog open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Leave" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Rejecting {rejectTarget?.employee_name}'s leave request. Please provide a reason.
          </p>
          <div className="space-y-1.5">
            <Label>Rejection Reason</Label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Provide reason for rejection..."
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={handleReject}>Reject Leave</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
