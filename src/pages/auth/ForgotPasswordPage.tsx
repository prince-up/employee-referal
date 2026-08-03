import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { Button, Label } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false); const [error, setError] = useState("");
  async function submit(e: React.FormEvent) { e.preventDefault(); setError(""); try { await authService.resetPassword(email); setSent(true); } catch (err) { setError(err instanceof Error ? err.message : "Unable to send reset link"); } }
  return <main className="min-h-screen grid place-items-center p-6 bg-muted/30"><form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-2xl border bg-background p-8 shadow-sm"><div><h1 className="text-2xl font-bold">Reset your password</h1><p className="mt-2 text-sm text-muted-foreground">We’ll send a secure reset link to your inbox.</p></div>{sent ? <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700">Check your email for a password reset link.</p> : <><div className="space-y-2"><Label htmlFor="email">Email address</Label><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm" /></div>{error && <p className="text-sm text-destructive">{error}</p>}<Button className="w-full">Send reset link</Button></>}<Link to="/login" className="block text-center text-sm text-primary hover:underline">Back to sign in</Link></form></main>;
}
