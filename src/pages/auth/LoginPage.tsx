import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button, Label } from "@/components/ui";
import { Briefcase, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PayrollPro</h1>
              <p className="text-white/70 text-sm">HRMS v2.0</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Complete HR & Payroll
            <br />
            <span className="text-white/80">Management System</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Manage employees, track attendance, process payroll, and generate
            payslips — all in one powerful platform.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "500+", label: "Companies" },
              { value: "50K+", label: "Employees" },
              { value: "99.9%", label: "Uptime" },
              { value: "₹2B+", label: "Processed" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 rounded-xl p-4 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/50 text-sm">
            © 2024 PayrollPro. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">PayrollPro</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to your HRMS account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" required>
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" required>
                  Password
                </Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base" isLoading={isLoading}>
              {!isLoading && "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">New to PayrollPro? <Link to="/sign-up" className="text-primary hover:underline">Create an account</Link></p>

          <p className="text-center text-xs text-muted-foreground">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
}
