import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useMarkNotificationRead, useNotifications } from "@/hooks/useNotifications";
import { timeAgo, cn } from "@/utils";
import {
  Bell,
  Sun,
  Moon,
  Search,
  LogOut,
  Settings,
  User,
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  ClipboardList,
  DollarSign,
  FileText,
  BarChart3,
  Shield,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import { Avatar, Badge } from "@/components/ui";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Employees", icon: Users, path: "/employees", roles: ["admin", "hr"] },
  { label: "Departments", icon: Building2, path: "/departments", roles: ["admin", "hr"] },
  { label: "Attendance", icon: CalendarDays, path: "/attendance", roles: ["admin", "hr", "employee"] },
  { label: "Leave", icon: ClipboardList, path: "/leave" },
  { label: "Payroll", icon: DollarSign, path: "/payroll", roles: ["admin", "hr"] },
  { label: "Payslips", icon: FileText, path: "/payslips" },
  { label: "Reports", icon: BarChart3, path: "/reports", roles: ["admin", "hr"] },
  { label: "Admin", icon: Shield, path: "/admin", roles: ["admin"] },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role ?? "")
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 flex-1 lg:flex-initial">
          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-glow">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-bold text-foreground text-sm leading-tight">
                PayrollPro
              </p>
              <p className="text-[10px] text-muted-foreground">HRMS v2.0</p>
            </div>
          </NavLink>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {visibleItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-indigo-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/55"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Tools & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Search bar (desktop only) */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-40 lg:w-48 rounded-lg border border-input bg-background/50 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all focus:w-60"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-lg border border-border/80 hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="h-9 w-9 rounded-lg border border-border/80 hover:bg-muted flex items-center justify-center transition-colors relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
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
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">{unreadCount} New</Badge>
                    </div>
                  </div>
                  <div className="divide-y divide-border max-h-80 overflow-y-auto scrollbar-thin">
                    {notifications.length === 0 && <p className="p-6 text-center text-xs text-muted-foreground">You’re all caught up.</p>}
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (!n.read) markRead.mutate(n.id);
                        }}
                        className={cn(
                          "p-4 hover:bg-muted/50 transition-colors cursor-pointer text-left",
                          !n.read && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-1.5 h-1.5 w-1.5 rounded-full shrink-0",
                              !n.read ? "bg-primary" : "bg-muted-foreground/30"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold">{n.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                              {n.message}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                              {timeAgo(n.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-lg hover:bg-muted/80 transition-colors border border-transparent hover:border-border/60"
            >
              <Avatar name={user?.name ?? "User"} size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold leading-none">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{user?.role}</p>
              </div>
            </button>

            {showProfile && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowProfile(false)}
                />
                <div className="absolute right-0 top-12 w-52 bg-card border border-border rounded-xl shadow-2xl z-40 animate-fade-in">
                  <div className="p-4 border-b border-border text-left">
                    <p className="font-semibold text-xs text-foreground">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-muted text-xs transition-colors text-left font-medium text-muted-foreground hover:text-foreground">
                      <User className="h-3.5 w-3.5" /> My Profile
                    </button>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-muted text-xs transition-colors text-left font-medium text-muted-foreground hover:text-foreground">
                      <Settings className="h-3.5 w-3.5" /> Settings
                    </button>
                    <div className="my-1 h-px bg-border/60" />
                    <button
                      onClick={logout}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-destructive/10 text-xs text-destructive hover:text-destructive transition-colors text-left font-semibold"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 rounded-lg border border-border/80 hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 w-full bg-card border-b border-border shadow-xl z-40 lg:hidden animate-slide-in-top p-4 max-h-[80vh] overflow-y-auto">
            {/* Search Input for Mobile */}
            <div className="relative mb-4 md:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background/50 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"
              />
            </div>

            <div className="space-y-1">
              {visibleItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
