import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { mockNotifications } from "@/utils/mockData";
import { timeAgo } from "@/utils";
import {
  Bell,
  Sun,
  Moon,
  Search,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Avatar, Badge } from "@/components/ui";
import { cn } from "@/utils";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/employees": "Employees",
  "/employees/new": "Add Employee",
  "/departments": "Departments",
  "/attendance": "Attendance",
  "/leave": "Leave Management",
  "/payroll": "Payroll",
  "/payslips": "Payslips",
  "/reports": "Reports",
  "/admin": "Administration",
  "/settings": "Settings",
};

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([path]) =>
      location.pathname.startsWith(path)
    )?.[1] ?? "HRMS";

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const notifColors = {
    success: "text-emerald-500",
    error: "text-red-500",
    warning: "text-amber-500",
    info: "text-blue-500",
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-6 gap-4 sticky top-0 z-10 shrink-0">
      {/* Page Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Search */}
      <div className="hidden md:flex relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search employees, payroll..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-60 rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all focus:w-80"
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="h-9 w-9 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors"
        title={theme === "dark" ? "Light mode" : "Dark mode"}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowProfile(false);
          }}
          className="h-9 w-9 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors relative"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowNotifications(false)}
            />
            <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-2xl z-40 animate-fade-in">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <Badge variant="destructive">{unreadCount} New</Badge>
                </div>
              </div>
              <div className="divide-y divide-border max-h-80 overflow-y-auto scrollbar-thin">
                {mockNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 h-2 w-2 rounded-full shrink-0",
                          !n.read ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {timeAgo(n.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border">
                <button className="text-xs text-primary hover:underline w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => {
            setShowProfile(!showProfile);
            setShowNotifications(false);
          }}
          className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Avatar name={user?.name ?? "User"} size="sm" />
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium leading-tight">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </button>

        {showProfile && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowProfile(false)}
            />
            <div className="absolute right-0 top-12 w-52 bg-card border border-border rounded-xl shadow-2xl z-40 animate-fade-in">
              <div className="p-4 border-b border-border">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="p-2">
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-muted text-sm transition-colors">
                  <User className="h-4 w-4 text-muted-foreground" /> My Profile
                </button>
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-muted text-sm transition-colors">
                  <Settings className="h-4 w-4 text-muted-foreground" /> Settings
                </button>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-destructive/10 text-sm text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
