import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Avatar,
  StatCard,
  toast,
} from "@/components/ui";
import { mockAuditLogs, mockNotifications } from "@/utils/mockData";
import { formatDateTime, timeAgo } from "@/utils";
import { Shield, Users, Key, ClipboardList, Database, RefreshCw, Download, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ACTION_COLORS: Record<string, "success" | "warning" | "destructive" | "default"> = {
  CREATE: "success",
  UPDATE: "warning",
  DELETE: "destructive",
  APPROVE: "success",
  REJECT: "destructive",
  PROCESS: "default",
};

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "audit" | "roles" | "notifications">("overview");
  const [notifications, setNotifications] = useState(mockNotifications);

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <Shield className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
      </div>
    );
  }

  const roles = [
    { name: "Admin", description: "Full system access", permissions: ["Manage employees", "Run payroll", "Manage roles", "View audit logs", "Database backup"], users: 1, color: "text-violet-500 bg-violet-500/10" },
    { name: "HR Manager", description: "HR module access", permissions: ["Manage employees", "Approve leaves", "View reports", "Mark attendance"], users: 2, color: "text-blue-500 bg-blue-500/10" },
    { name: "Employee", description: "Self-service access", permissions: ["View own profile", "Apply leave", "View payslip", "View attendance"], users: 93, color: "text-emerald-500 bg-emerald-500/10" },
  ];

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast("All notifications marked as read", "success");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold">Administration</h2>
        <p className="text-muted-foreground text-sm">System management and configuration</p>
      </div>

      {/* Quick Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={96} icon={Users} color="primary" />
        <StatCard title="Roles" value={3} icon={Key} color="success" />
        <StatCard title="Audit Logs" value={mockAuditLogs.length} icon={ClipboardList} color="warning" />
        <StatCard title="Notifications" value={notifications.filter((n) => !n.read).length} subtitle="Unread" icon={Bell} color="info" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(["overview", "audit", "roles", "notifications"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Database Backup",
              desc: "Create a full backup of the database",
              icon: Database,
              action: "Create Backup",
              color: "from-violet-500 to-indigo-600",
              onClick: () => toast("Database backup initiated", "info"),
            },
            {
              title: "Restore Database",
              desc: "Restore from a previous backup",
              icon: RefreshCw,
              action: "Restore",
              color: "from-amber-500 to-orange-600",
              onClick: () => toast("Restore process started", "warning"),
            },
            {
              title: "Export All Data",
              desc: "Export all system data as CSV",
              icon: Download,
              action: "Export",
              color: "from-emerald-500 to-teal-600",
              onClick: () => toast("Export started", "success"),
            },
            {
              title: "System Logs",
              desc: "View system error and activity logs",
              icon: ClipboardList,
              action: "View Logs",
              color: "from-blue-500 to-cyan-600",
              onClick: () => setActiveTab("audit"),
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={item.onClick}>{item.action}</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "audit" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Audit Logs</CardTitle>
              <Button size="sm" variant="outline" onClick={() => toast("Logs exported", "success")}>
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAuditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar name={log.user_name ?? "U"} size="sm" />
                        <span className="text-sm font-medium">{log.user_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ACTION_COLORS[log.action] ?? "default"}>{log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.entity}</TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">{log.entity_id ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{timeAgo(log.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <div className="space-y-4">
          {roles.map((role) => (
            <Card key={role.name}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${role.color} font-bold text-lg`}>
                      {role.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{role.name}</h3>
                        <Badge variant="secondary">{role.users} users</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{role.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {role.permissions.map((p) => (
                          <span key={p} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                            ✓ {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Edit Role</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={handleMarkAllRead}>
              Mark All Read
            </Button>
          </div>
          {notifications.map((n) => {
            const colors = {
              success: "border-emerald-500/30 bg-emerald-500/5",
              error: "border-red-500/30 bg-red-500/5",
              warning: "border-amber-500/30 bg-amber-500/5",
              info: "border-blue-500/30 bg-blue-500/5",
            };
            return (
              <Card key={n.id} className={!n.read ? colors[n.type] : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${!n.read ? "bg-primary" : "bg-muted-foreground/30"}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{n.title}</p>
                        <Badge variant={n.type === "success" ? "success" : n.type === "warning" ? "warning" : n.type === "error" ? "destructive" : "secondary"}>
                          {n.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.read && (
                      <button
                        onClick={() => setNotifications((prev) => prev.map((notif) => notif.id === n.id ? { ...notif, read: true } : notif))}
                        className="text-xs text-primary hover:underline shrink-0"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
