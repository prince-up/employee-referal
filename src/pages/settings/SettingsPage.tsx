import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  Avatar,
  Badge,
  Separator,
  toast,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Save, Sun, Moon, Bell, Shield, User, Palette } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "notifications" | "security">("profile");

  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    timezone: "Asia/Kolkata",
  });

  const [notifSettings, setNotifSettings] = useState({
    leave_approved: true,
    payroll_generated: true,
    new_employee: true,
    holiday_reminder: true,
    email_notifications: true,
  });

  const handleSaveProfile = () => {
    toast("Profile updated successfully", "success");
  };

  const handleSaveNotifications = () => {
    toast("Notification preferences saved", "success");
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "appearance", label: "Appearance", icon: Palette },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "security", label: "Security", icon: Shield },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Profile Information</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <Avatar name={user?.name ?? "U"} size="xl" />
              <div>
                <Button size="sm" variant="outline">Change Photo</Button>
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG up to 2MB</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} type="email" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} placeholder="+91 9876543210" />
              </div>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Select
                  value={profile.timezone}
                  onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                  options={[
                    { value: "Asia/Kolkata", label: "India (IST, +5:30)" },
                    { value: "UTC", label: "UTC" },
                    { value: "America/New_York", label: "Eastern Time" },
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="capitalize">{user?.role}</Badge>
              <span className="text-sm text-muted-foreground">Your system role</span>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4" /> Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">Theme</p>
              <div className="grid grid-cols-2 gap-3">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => t !== theme && toggleTheme()}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      theme === t ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    {t === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="font-medium capitalize">{t} Mode</span>
                    {theme === t && <span className="ml-auto text-primary text-xs font-semibold">Active</span>}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-3">Language</p>
              <Select
                value="en"
                onChange={() => {}}
                options={[
                  { value: "en", label: "English (US)" },
                  { value: "hi", label: "Hindi" },
                ]}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "leave_approved", label: "Leave Approved/Rejected", desc: "Get notified when your leave status changes" },
              { key: "payroll_generated", label: "Payroll Generated", desc: "Get notified when monthly payroll is processed" },
              { key: "new_employee", label: "New Employee Added", desc: "Get notified when a new employee joins" },
              { key: "holiday_reminder", label: "Holiday Reminders", desc: "Get notified about upcoming holidays" },
              { key: "email_notifications", label: "Email Notifications", desc: "Receive notifications via email" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-sm">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <button
                  onClick={() => setNotifSettings((prev) => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    notifSettings[n.key as keyof typeof notifSettings] ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform ${
                      notifSettings[n.key as keyof typeof notifSettings] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveNotifications}>
                <Save className="h-4 w-4" /> Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Security Settings</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Change Password</h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-1.5">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button onClick={() => toast("Password updated successfully", "success")}>
                  Update Password
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-sm mb-3">Active Sessions</h3>
              <div className="p-4 rounded-xl border border-border space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Current Session</p>
                    <p className="text-xs text-muted-foreground">Windows · Chrome · Bangalore, IN</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
