import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Briefcase, Sparkles, Database, CheckCircle2, AlertCircle } from "lucide-react";

export default function OnboardingWidget() {
  const [orgName, setOrgName] = useState("Acme Corporation");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      // Call our seed postgres RPC
      const { data, error } = await supabase.rpc("seed_demo_data", {
        org_name: orgName.trim(),
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error("Initialization failed without error description.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message ||
          "Could not initialize database. Please ensure you have run the migrations in your Supabase SQL Editor first."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <Card className="w-full max-w-xl shadow-2xl border border-border/80 overflow-hidden bg-card/60 backdrop-blur-md relative stat-card-glow transition-all duration-300">
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 animate-pulse" />
        
        <CardHeader className="pb-4 pt-6 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20 shadow-glow">
            <Briefcase className="h-8 w-8 text-indigo-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Initialize your HRMS Workspace
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            It looks like your database is not yet configured. Let's create your organization profile and seed default payroll, departments, and employees data.
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-4">
          {success ? (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Workspace Initialized!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Seeding completed. Reloading your workspace dashboard...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInitialize} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orgName" className="text-sm font-bold flex items-center gap-1.5 text-foreground/95">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  Your Organization Name
                </Label>
                <Input
                  id="orgName"
                  required
                  placeholder="e.g. Acme Corporation, Delta Inc"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  disabled={loading}
                  className="h-11 border-border/80 focus-visible:ring-indigo-500/50 bg-background/50"
                />
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2.5 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-xs text-destructive leading-relaxed">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Setup Error</span>
                    {errorMsg}
                    <div className="mt-2 font-mono bg-background/40 p-2 rounded border border-destructive/10 leading-normal">
                      Note: You must execute the SQL scripts in <span className="underline">supabase/migrations/001_schema.sql</span> using the Supabase SQL editor to create the required tables and permissions.
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                isLoading={loading}
                className="w-full h-11 gradient-primary text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-glow"
              >
                <Database className="h-4 w-4" />
                Configure Organization & Seed Demo Data
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
