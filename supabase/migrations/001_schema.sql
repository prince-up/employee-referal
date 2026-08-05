-- PayrollPro multi-tenant schema. Run in the Supabase SQL editor before deploying the app.
create extension if not exists pgcrypto;
create type public.app_role as enum ('admin', 'hr', 'employee');
create type public.employee_status as enum ('active', 'inactive', 'terminated', 'on-leave');
create type public.request_status as enum ('pending', 'approved', 'rejected', 'cancelled');

create table public.organizations (id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, logo_url text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, organization_id uuid references public.organizations(id), email text not null, full_name text not null, role public.app_role not null default 'employee', avatar_url text, employee_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.departments (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, name text not null, code text not null, description text, head_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id, code));
create table public.designations (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, department_id uuid references public.departments(id) on delete set null, title text not null, level integer not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.employees (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, user_id uuid unique references auth.users(id) on delete set null, employee_id text not null, first_name text not null, last_name text not null, email text not null, phone text, department_id uuid references public.departments(id) on delete set null, designation_id uuid references public.designations(id) on delete set null, joining_date date, employment_type text default 'full-time', status public.employee_status not null default 'active', basic_salary numeric(12,2) not null default 0, photo_url text, bank_details jsonb not null default '{}'::jsonb, compliance_details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id, employee_id), unique(organization_id, email));
alter table public.profiles add constraint profiles_employee_id_fkey foreign key (employee_id) references public.employees(id) on delete set null;
create table public.attendance (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, employee_id uuid not null references public.employees(id) on delete cascade, date date not null, status text not null default 'present', check_in timestamptz, check_out timestamptz, working_hours numeric(5,2), remarks text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(employee_id, date));
create table public.leave_types (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, name text not null, code text not null, annual_allowance numeric(6,2) not null default 0, is_paid boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id, code));
create table public.leave_balances (id uuid primary key default gen_random_uuid(), employee_id uuid not null references public.employees(id) on delete cascade, leave_type_id uuid not null references public.leave_types(id) on delete cascade, year integer not null, allocated numeric(6,2) not null default 0, used numeric(6,2) not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(employee_id, leave_type_id, year));
create table public.leave_requests (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, employee_id uuid not null references public.employees(id) on delete cascade, leave_type_id uuid not null references public.leave_types(id), from_date date not null, to_date date not null, days numeric(6,2) not null, reason text not null, status public.request_status not null default 'pending', rejection_reason text, approved_by uuid references auth.users(id), approved_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check(to_date >= from_date));
create table public.payroll_runs (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, month integer not null check(month between 1 and 12), year integer not null, status text not null default 'draft', processed_at timestamptz, paid_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id, month, year));
create table public.payslips (id uuid primary key default gen_random_uuid(), payroll_run_id uuid not null references public.payroll_runs(id) on delete cascade, employee_id uuid not null references public.employees(id), gross_salary numeric(12,2) not null default 0, total_deductions numeric(12,2) not null default 0, net_salary numeric(12,2) not null default 0, components jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(payroll_run_id, employee_id));
create table public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, title text not null, message text not null, type text not null default 'info', read boolean not null default false, created_at timestamptz not null default now());
create table public.audit_logs (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, user_id uuid references auth.users(id), action text not null, entity text not null, entity_id uuid, changes jsonb, created_at timestamptz not null default now());
create index on public.employees(organization_id, status); create index on public.attendance(employee_id, date); create index on public.leave_requests(organization_id, status); create index on public.notifications(user_id, read);

create or replace function public.current_org_id() returns uuid language sql stable security definer set search_path = public as $$ select organization_id from public.profiles where id = auth.uid() $$;
create or replace function public.is_hr() returns boolean language sql stable security definer set search_path = public as $$ select role in ('admin','hr') from public.profiles where id = auth.uid() $$;
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles(id,email,full_name) values (new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1))); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create trigger organizations_updated before update on public.organizations for each row execute procedure public.set_updated_at();
create trigger employees_updated before update on public.employees for each row execute procedure public.set_updated_at();
create trigger departments_updated before update on public.departments for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security; alter table public.organizations enable row level security; alter table public.departments enable row level security; alter table public.designations enable row level security; alter table public.employees enable row level security; alter table public.attendance enable row level security; alter table public.leave_types enable row level security; alter table public.leave_balances enable row level security; alter table public.leave_requests enable row level security; alter table public.payroll_runs enable row level security; alter table public.payslips enable row level security; alter table public.notifications enable row level security; alter table public.audit_logs enable row level security;
-- Organization data is isolated by profile organization. Employees get only their own personnel records.
create policy "profiles self or HR" on public.profiles for select using (id = auth.uid() or (organization_id = current_org_id() and is_hr()));
create policy "profiles self update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "organization members" on public.organizations for select using (id = current_org_id());
create policy "org read" on public.departments for select using (organization_id = current_org_id()); create policy "hr write departments" on public.departments for all using (organization_id = current_org_id() and is_hr()) with check (organization_id = current_org_id() and is_hr());
create policy "org read designations" on public.designations for select using (organization_id = current_org_id()); create policy "hr write designations" on public.designations for all using (organization_id = current_org_id() and is_hr()) with check (organization_id = current_org_id() and is_hr());
create policy "employees scoped read" on public.employees for select using (organization_id = current_org_id() and (is_hr() or user_id = auth.uid())); create policy "hr write employees" on public.employees for all using (organization_id = current_org_id() and is_hr()) with check (organization_id = current_org_id() and is_hr());
create policy "attendance scoped" on public.attendance for select using (organization_id = current_org_id() and (is_hr() or employee_id in (select id from public.employees where user_id = auth.uid()))); create policy "attendance write" on public.attendance for all using (organization_id = current_org_id() and is_hr()) with check (organization_id = current_org_id() and is_hr());
create policy "leave types org" on public.leave_types for select using (organization_id = current_org_id()); create policy "leave types write" on public.leave_types for all using (organization_id = current_org_id() and is_hr()) with check (organization_id = current_org_id() and is_hr());
create policy "balances scoped" on public.leave_balances for select using (employee_id in (select id from public.employees where organization_id=current_org_id() and (user_id=auth.uid() or is_hr())));
create policy "leaves scoped" on public.leave_requests for select using (organization_id=current_org_id() and (is_hr() or employee_id in (select id from public.employees where user_id=auth.uid()))); create policy "employees create leave" on public.leave_requests for insert with check (organization_id=current_org_id() and employee_id in (select id from public.employees where user_id=auth.uid())); create policy "hr update leaves" on public.leave_requests for update using (organization_id=current_org_id() and is_hr());
create policy "payroll scoped" on public.payroll_runs for select using (organization_id=current_org_id() and is_hr()); create policy "hr write payroll" on public.payroll_runs for all using (organization_id=current_org_id() and is_hr()) with check (organization_id=current_org_id() and is_hr());
create policy "payslips scoped" on public.payslips for select using (employee_id in (select id from public.employees where organization_id=current_org_id() and (user_id=auth.uid() or is_hr())));
create policy "notifications own" on public.notifications for select using (user_id=auth.uid()); create policy "notifications update own" on public.notifications for update using (user_id=auth.uid());
create policy "audit hr" on public.audit_logs for select using (organization_id=current_org_id() and is_hr());
create policy "attendance self write" on public.attendance for all using (employee_id in (select id from public.employees where user_id = auth.uid())) with check (employee_id in (select id from public.employees where user_id = auth.uid()));

-- Security definer function to seed demo data and link the current user to a new organization/employee record.
create or replace function public.seed_demo_data(org_name text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  new_emp_id uuid;
  dept_eng_id uuid;
  dept_hr_id uuid;
  dept_sales_id uuid;
  desig_se_id uuid;
  desig_hr_id uuid;
  desig_sl_id uuid;
  user_email text;
  user_name text;
  emp_record record;
begin
  -- Get active user email and name from profiles or auth
  select email, full_name into user_email, user_name from public.profiles where id = auth.uid();
  if not found then
    user_email := auth.email();
    user_name := split_part(user_email, '@', 1);
  end if;

  -- 1. Create Organization if it doesn't exist
  select id into new_org_id from public.organizations where slug = lower(regexp_replace(org_name, '[^a-zA-Z0-9]', '', 'g')) limit 1;
  if new_org_id is null then
    insert into public.organizations(name, slug)
    values (org_name, lower(regexp_replace(org_name, '[^a-zA-Z0-9]', '', 'g')))
    returning id into new_org_id;
  end if;

  -- 2. Create Departments
  insert into public.departments(organization_id, name, code)
  values 
    (new_org_id, 'Engineering', 'ENG'),
    (new_org_id, 'Human Resources', 'HR'),
    (new_org_id, 'Sales', 'SLS'),
    (new_org_id, 'Finance', 'FIN')
  on conflict (organization_id, code) do update set name = excluded.name;

  -- Get department IDs
  select id into dept_eng_id from public.departments where organization_id = new_org_id and code = 'ENG';
  select id into dept_hr_id from public.departments where organization_id = new_org_id and code = 'HR';
  select id into dept_sales_id from public.departments where organization_id = new_org_id and code = 'SLS';

  -- 3. Create Designations
  insert into public.designations(organization_id, department_id, title, level)
  values 
    (new_org_id, dept_eng_id, 'Senior Software Engineer', 3),
    (new_org_id, dept_hr_id, 'HR Specialist', 2),
    (new_org_id, dept_sales_id, 'Account Executive', 2);

  select id into desig_se_id from public.designations where organization_id = new_org_id and title = 'Senior Software Engineer';
  select id into desig_hr_id from public.designations where organization_id = new_org_id and title = 'HR Specialist';
  select id into desig_sl_id from public.designations where organization_id = new_org_id and title = 'Account Executive';

  -- 4. Create Employee record for the logged-in user if not already existing
  select id into new_emp_id from public.employees where user_id = auth.uid() limit 1;
  if new_emp_id is null then
    insert into public.employees(organization_id, user_id, employee_id, first_name, last_name, email, department_id, designation_id, joining_date, basic_salary, status)
    values (
      new_org_id, 
      auth.uid(), 
      'EMP0001', 
      coalesce(split_part(user_name, ' ', 1), 'Admin'), 
      coalesce(split_part(user_name, ' ', 2), 'User'), 
      user_email, 
      dept_hr_id, 
      desig_hr_id, 
      current_date - interval '1 year', 
      75000.00, 
      'active'
    )
    returning id into new_emp_id;
  end if;

  -- 5. Update logged-in user's profile to be Admin and link Organization & Employee
  update public.profiles
  set 
    organization_id = new_org_id,
    employee_id = new_emp_id,
    role = 'admin',
    full_name = coalesce(user_name, full_name)
  where id = auth.uid();

  -- 6. Insert Mock Employees (5 other people) to make the dashboard look active
  -- Employee 2
  insert into public.employees(organization_id, employee_id, first_name, last_name, email, department_id, designation_id, joining_date, basic_salary, status)
  values (new_org_id, 'EMP0002', 'Aarav', 'Sharma', 'aarav.sharma@example.com', dept_eng_id, desig_se_id, current_date - interval '2 years', 85000.00, 'active')
  on conflict do nothing;

  -- Employee 3
  insert into public.employees(organization_id, employee_id, first_name, last_name, email, department_id, designation_id, joining_date, basic_salary, status)
  values (new_org_id, 'EMP0003', 'Diya', 'Patel', 'diya.patel@example.com', dept_eng_id, desig_se_id, current_date - interval '6 months', 65000.00, 'active')
  on conflict do nothing;

  -- Employee 4
  insert into public.employees(organization_id, employee_id, first_name, last_name, email, department_id, designation_id, joining_date, basic_salary, status)
  values (new_org_id, 'EMP0004', 'Kabir', 'Singh', 'kabir.singh@example.com', dept_sales_id, desig_sl_id, current_date - interval '1.5 years', 55000.00, 'active')
  on conflict do nothing;

  -- Employee 5
  insert into public.employees(organization_id, employee_id, first_name, last_name, email, department_id, designation_id, joining_date, basic_salary, status)
  values (new_org_id, 'EMP0005', 'Ananya', 'Gupta', 'ananya.gupta@example.com', dept_eng_id, desig_se_id, current_date - interval '3 years', 95000.00, 'active')
  on conflict do nothing;

  -- 7. Insert some attendance records for today
  for emp_record in (select id from public.employees where organization_id = new_org_id and id != new_emp_id) loop
    insert into public.attendance(organization_id, employee_id, date, status, check_in, check_out, working_hours, remarks)
    values (
      new_org_id,
      emp_record.id,
      current_date,
      'present',
      current_date + time '09:00:00',
      current_date + time '17:30:00',
      8.50,
      'Standard shift'
    )
    on conflict (employee_id, date) do nothing;
  end loop;

  -- 8. Add some audit logs
  insert into public.audit_logs(organization_id, user_id, action, entity, entity_id, changes)
  values 
    (new_org_id, auth.uid(), 'CREATE', 'organization', new_org_id, '{"seeded": true}'::jsonb),
    (new_org_id, auth.uid(), 'SEED', 'database', new_org_id, '{"seeded": true}'::jsonb);

  return json_build_object(
    'success', true,
    'organization_id', new_org_id,
    'employee_id', new_emp_id
  );
end;
$$;

