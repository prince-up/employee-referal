import { useState } from "react";
import { CalendarCheck, Clock3, Users } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, Select, StatCard, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import AttendanceWidget from "@/components/AttendanceWidget";
import { useAttendance } from "@/hooks/useAttendance";
import { useEmployees } from "@/hooks/useEmployees";
import { formatDate } from "@/utils";

export default function AttendancePage() {
  const today = new Date().toISOString().slice(0, 10); const [status, setStatus] = useState(""); const { data: records = [], isLoading } = useAttendance({ status: status as any || undefined }); const { data: employees } = useEmployees({ limit: 100 });
  const present = records.filter((r) => r.date === today && r.status === "present").length; const late = records.filter((r) => r.date === today && r.status === "late").length;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Live time office</p>
          <h2 className="text-3xl font-bold">Attendance</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track workdays from actual clock-in and attendance records.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left widget & stats area */}
        <div className="xl:col-span-1 space-y-6">
          <AttendanceWidget />
          
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <StatCard title="Present today" value={isLoading ? "—" : present} subtitle="Live records" icon={CalendarCheck} color="success" />
            <StatCard title="Late arrivals" value={isLoading ? "—" : late} subtitle="Today" icon={Clock3} color="warning" />
            <StatCard title="People tracked" value={employees?.total ?? 0} subtitle="Active roster" icon={Users} color="primary" />
          </div>
        </div>

        {/* Right logs area */}
        <div className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <CardTitle>Attendance log</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Latest records first</p>
                </div>
                <div className="w-full sm:w-44">
                  <Select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    options={[
                      {value:"",label:"All statuses"},
                      {value:"present",label:"Present"},
                      {value:"absent",label:"Absent"},
                      {value:"leave",label:"Leave"},
                      {value:"late",label:"Late"},
                      {value:"half-day",label:"Half-day"}
                    ]} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {records.length === 0 && !isLoading ? (
                <EmptyState icon={CalendarCheck} title="No attendance records" description="Clock in or add an attendance entry to get started." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team member</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Clock in</TableHead>
                      <TableHead>Clock out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.employee_name ?? "You"}</TableCell>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>
                          <Badge variant={record.status === "present" ? "success" : record.status === "absent" ? "destructive" : "warning"}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</TableCell>
                        <TableCell>{record.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

