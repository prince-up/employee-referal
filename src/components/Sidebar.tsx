import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  CalendarDays,
  DollarSign,
  FileText,
  BarChart3,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Briefcase,
} from "lucide-react";
import { Avatar } from "@/components/ui";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles?: string[];
  badge?: number;
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

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role ?? "")
  );

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out relative z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-glow">
          <Briefcase className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <p className="font-bold text-sidebar-foreground text-sm leading-tight">
              PayrollPro
            </p>
            <p className="text-xs text-sidebar-foreground/60">HRMS v2.0</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2 space-y-1">
        {!collapsed && (
          <p className="px-2 mb-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-widest">
            Main Menu
          </p>
        )}
        {visibleItems.slice(0, 8).map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}

        {!collapsed && (
          <p className="px-2 mt-4 mb-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-widest">
            System
          </p>
        )}
        {visibleItems.slice(8).map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User Profile */}
      <div className={cn("border-t border-sidebar-border p-3 shrink-0", collapsed && "p-2")}>
        <div className={cn("flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors", collapsed && "justify-center")}>
          <Avatar name={user?.name ?? "User"} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">
                {user?.role}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              title="Logout"
              className="h-8 w-8 rounded-lg hover:bg-sidebar-border flex items-center justify-center transition-colors text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors z-30"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
}

function NavItem({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(item.path);
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={cn(
        "sidebar-item",
        isActive ? "active" : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-white")} />
      {!collapsed && (
        <span className={cn("truncate", isActive && "text-white")}>
          {item.label}
        </span>
      )}
      {!collapsed && item.badge && (
        <span className="ml-auto bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}
