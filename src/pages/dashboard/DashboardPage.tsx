import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  StatCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Avatar,
} from "@/components/ui";
import {
  mockDashboardStats,
  mockRecentActivities,
  monthlyPayrollData,
  departmentData,
  attendanceTrendData,
} from "@/utils/mockData";
import { formatCurrency, timeAgo } from "@/utils";
import {
  Users,
  Building2,
  DollarSign,
  CalendarCheck,
  ClipboardList,
  TrendingUp,
  UserCheck,
  Plus,
  Play,
  CheckCircle,
  Clock,
  FileBarChart,
  Send,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const ACTIVITY_ICONS: Record<string, string> = {
  employee_added: "👤",
  leave_approved: "✅",
  payroll_generated: "💰",
  leave_applied: "📋",
  attendance_marked: "🕐",
};

const ACTIVITY_COLORS: Record<string, string> = {
  employee_added: "bg-violet-500",
  leave_approved: "bg-emerald-500",
  payroll_generated: "bg-amber-500",
  leave_applied: "bg-blue-500",
  attendance_marked: "bg-cyan-500",
};

const quickActions = [
  { label: "Add Employee", icon: Plus, color: "from-violet-500 to-indigo-600", path: "/employees/new" },
  { label: "Run Payroll", icon: Play, color: "from-emerald-500 to-teal-600", path: "/payroll" },
  { label: "Approve Leaves", icon: CheckCircle, color: "from-amber-500 to-orange-600", path: "/leave" },
  { label: "Mark Attendance", icon: Clock, color: "from-blue-500 to-cyan-600", path: "/attendance" },
  { label: "Generate Report", icon: FileBarChart, color: "from-rose-500 to-pink-600", path: "/reports" },
  { label: "Send Payslips", icon: Send, color: "from-fuchsia-500 to-purple-600", path: "/payslips" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Good morning, Rajesh 👋</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Here's what's happening across your organization today.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={stats.total_employees}
          subtitle={`${stats.active_employees} active`}
          icon={Users}
          color="primary"
          trend={{ value: 4.2, label: "vs last month" }}
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(stats.monthly_payroll)}
          subtitle="July 2024"
          icon={DollarSign}
          color="success"
          trend={{ value: 2.1, label: "vs last month" }}
        />
        <StatCard
          title="Today's Attendance"
          value={`${stats.today_present}/${stats.total_employees}`}
          subtitle={`${stats.today_absent} absent`}
          icon={CalendarCheck}
          color="info"
          trend={{ value: 1.5, label: "vs yesterday" }}
        />
        <StatCard
          title="Pending Leaves"
          value={stats.pending_leaves}
          subtitle="Awaiting approval"
          icon={ClipboardList}
          color="warning"
          trend={{ value: -12, label: "vs last week" }}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Departments"
          value={stats.total_departments}
          subtitle="Active departments"
          icon={Building2}
          color="primary"
        />
        <StatCard
          title="Active Employees"
          value={stats.active_employees}
          subtitle={`${stats.total_employees - stats.active_employees} inactive`}
          icon={UserCheck}
          color="success"
        />
        <StatCard
          title="YTD Salary Expense"
          value={formatCurrency(stats.total_salary_expense)}
          subtitle="Jan – Jul 2024"
          icon={TrendingUp}
          color="danger"
          trend={{ value: 8.5, label: "vs last year" }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Area Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Payroll Expense</CardTitle>
            <p className="text-sm text-muted-foreground">Jan – Jul 2024 trend</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyPayrollData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), "Payroll"]}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#payrollGrad)"
                  dot={{ fill: "#6366f1", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Headcount by Department</CardTitle>
            <p className="text-sm text-muted-foreground">Distribution overview</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {departmentData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => [v, "Employees"]}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {departmentData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance Trend</CardTitle>
          <p className="text-sm text-muted-foreground">This week's attendance breakdown</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" name="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leave" name="On Leave" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <p className="text-sm text-muted-foreground">Latest actions across your organization</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-base ${ACTIVITY_COLORS[activity.type] ?? "bg-gray-500"}`}
                >
                  {ACTIVITY_ICONS[activity.type] ?? "📌"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{activity.user}</span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-xs text-muted-foreground">{timeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground">Common tasks at your fingertips</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-transparent bg-muted/30 hover:bg-gradient-to-br hover:text-white transition-all duration-200 active:scale-95"
                    style={{}}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${action.color.replace("from-", "").replace(" to-", ", ").split(",")[0]?.trim() ?? "#6366f1"})`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "";
                    }}
                  >
                    <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-left leading-tight">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
