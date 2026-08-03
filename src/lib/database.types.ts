// Mirrors supabase/migrations/001_schema.sql. Regenerate with `supabase gen types typescript` when the schema changes.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
type Row<T> = T & { id: string; created_at: string; updated_at?: string };
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Row<{ email: string; full_name: string; role: "admin" | "hr" | "employee"; avatar_url: string | null; organization_id: string | null; employee_id: string | null }>; Insert: Partial<any>; Update: Partial<any> };
      organizations: { Row: Row<{ name: string; slug: string; logo_url: string | null }>; Insert: Partial<any>; Update: Partial<any> };
      departments: { Row: Row<{ organization_id: string; name: string; code: string; description: string | null; head_id: string | null }>; Insert: Partial<any>; Update: Partial<any> };
      designations: { Row: Row<{ organization_id: string; department_id: string | null; title: string; level: number }>; Insert: Partial<any>; Update: Partial<any> };
      employees: { Row: Row<Record<string, any> & { organization_id: string; employee_id: string; first_name: string; last_name: string; email: string; department_id: string | null; designation_id: string | null; status: string; basic_salary: number }>; Insert: Partial<any>; Update: Partial<any> };
      attendance: { Row: Row<{ organization_id: string; employee_id: string; date: string; status: string; check_in: string | null; check_out: string | null; working_hours: number | null; remarks: string | null }>; Insert: Partial<any>; Update: Partial<any> };
      leave_types: { Row: Row<{ organization_id: string; name: string; code: string; annual_allowance: number; is_paid: boolean }>; Insert: Partial<any>; Update: Partial<any> };
      leave_balances: { Row: Row<{ employee_id: string; leave_type_id: string; year: number; allocated: number; used: number }>; Insert: Partial<any>; Update: Partial<any> };
      leave_requests: { Row: Row<{ organization_id: string; employee_id: string; leave_type_id: string; from_date: string; to_date: string; days: number; reason: string; status: string; rejection_reason: string | null; approved_by: string | null; approved_at: string | null }>; Insert: Partial<any>; Update: Partial<any> };
      payroll_runs: { Row: Row<{ organization_id: string; month: number; year: number; status: string; processed_at: string | null; paid_at: string | null }>; Insert: Partial<any>; Update: Partial<any> };
      payslips: { Row: Row<{ payroll_run_id: string; employee_id: string; gross_salary: number; total_deductions: number; net_salary: number; components: Json }>; Insert: Partial<any>; Update: Partial<any> };
      notifications: { Row: Row<{ user_id: string; title: string; message: string; type: string; read: boolean }>; Insert: Partial<any>; Update: Partial<any> };
      audit_logs: { Row: Row<{ organization_id: string; user_id: string | null; action: string; entity: string; entity_id: string | null; changes: Json | null }>; Insert: Partial<any>; Update: Partial<any> };
    }; Views: Record<string, never>; Functions: Record<string, never>; Enums: Record<string, never>; CompositeTypes: Record<string, never>;
  };
}
