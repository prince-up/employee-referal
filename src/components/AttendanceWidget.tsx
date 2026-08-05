import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAttendance, useMarkAttendance } from "@/hooks/useAttendance";
import { useEmployees } from "@/hooks/useEmployees";
import { Card, CardContent, CardHeader, CardTitle, Button, Select, Input, Label, Badge, toast } from "@/components/ui";
import { Clock, CheckCircle2, User, Calendar, FileText, AlertCircle, Play, Square } from "lucide-react";

export default function AttendanceWidget() {
  const { user } = useAuth();
  const todayStr = new Date().toISOString().slice(0, 10);

  // States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [status, setStatus] = useState("present");
  const [remarks, setRemarks] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Employees for admin selector
  const { data: employeesData } = useEmployees({ limit: 200 });
  const employees = employeesData?.data ?? [];

  // Determine active target employee
  const targetEmployeeId = (user?.role === "employee" || !isAdminMode) 
    ? user?.employee_id 
    : selectedEmpId;

  // Queries
  const { data: records = [] } = useAttendance({
    employee_id: targetEmployeeId || undefined,
  });

  const markAttendance = useMarkAttendance();

  // Tick clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync state when targeting another record
  const selectedRecord = records.find(r => r.date === selectedDate);

  useEffect(() => {
    if (selectedRecord) {
      setStatus(selectedRecord.status);
      setRemarks(selectedRecord.remarks || "");
      setCheckInTime(selectedRecord.check_in ? new Date(selectedRecord.check_in).toTimeString().slice(0, 5) : "");
      setCheckOutTime(selectedRecord.check_out ? new Date(selectedRecord.check_out).toTimeString().slice(0, 5) : "");
    } else {
      setStatus("present");
      setRemarks("");
      setCheckInTime("");
      setCheckOutTime("");
    }
  }, [selectedRecord, selectedDate, targetEmployeeId]);

  // Find today's record for stopwatch
  const todayRecord = records.find(r => r.date === todayStr);
  const isClockedIn = todayRecord?.check_in && !todayRecord?.check_out;
  const isClockedOut = todayRecord?.check_in && todayRecord?.check_out;

  // Calculate work duration
  const [workedSeconds, setWorkedSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isClockedIn && todayRecord?.check_in) {
      const start = new Date(todayRecord.check_in).getTime();
      const updateStopwatch = () => {
        const diff = Math.floor((Date.now() - start) / 1000);
        setWorkedSeconds(diff > 0 ? diff : 0);
      };
      updateStopwatch();
      interval = setInterval(updateStopwatch, 1000);
    } else if (isClockedOut && todayRecord?.check_in && todayRecord?.check_out) {
      const diff = Math.floor(
        (new Date(todayRecord.check_out).getTime() - new Date(todayRecord.check_in).getTime()) / 1000
      );
      setWorkedSeconds(diff > 0 ? diff : 0);
    } else {
      setWorkedSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn, isClockedOut, todayRecord]);

  const formatStopwatch = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Clock In handler
  const handleClockIn = async () => {
    if (!targetEmployeeId) {
      toast("No active employee profile associated.", "error");
      return;
    }
    try {
      await markAttendance.mutateAsync({
        employee_id: targetEmployeeId,
        date: todayStr,
        status: status as any,
        check_in: new Date().toISOString(),
        remarks: remarks || undefined,
      });
      toast("Clocked in successfully!", "success");
    } catch (e: any) {
      toast(e.message || "Failed to clock in", "error");
    }
  };

  // Clock Out handler
  const handleClockOut = async () => {
    if (!targetEmployeeId || !todayRecord) return;
    try {
      await markAttendance.mutateAsync({
        employee_id: targetEmployeeId,
        date: todayStr,
        status: todayRecord.status,
        check_in: todayRecord.check_in,
        check_out: new Date().toISOString(),
        remarks: remarks || todayRecord.remarks || undefined,
      });
      toast("Clocked out successfully!", "success");
    } catch (e: any) {
      toast(e.message || "Failed to clock out", "error");
    }
  };

  // Admin Manual Save
  const handleAdminSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) {
      toast("Please select an employee", "error");
      return;
    }
    try {
      let finalCheckIn: string | undefined = undefined;
      let finalCheckOut: string | undefined = undefined;

      if (checkInTime) {
        finalCheckIn = new Date(`${selectedDate}T${checkInTime}:00`).toISOString();
      }
      if (checkOutTime) {
        finalCheckOut = new Date(`${selectedDate}T${checkOutTime}:00`).toISOString();
      }

      await markAttendance.mutateAsync({
        employee_id: selectedEmpId,
        date: selectedDate,
        status: status as any,
        check_in: finalCheckIn,
        check_out: finalCheckOut,
        remarks: remarks || undefined,
      });
      toast("Attendance updated successfully!", "success");
    } catch (e: any) {
      toast(e.message || "Failed to update attendance", "error");
    }
  };

  const showAdminTab = user?.role === "admin" || user?.role === "hr";

  return (
    <Card className="shadow-lg border border-border/80 overflow-hidden bg-card/60 backdrop-blur-md relative stat-card-glow transition-all duration-300">
      {/* Decorative Gradient Header */}
      <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600" />
      
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              Attendance Console
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live updates & session logging
            </p>
          </div>
          {showAdminTab && (
            <div className="inline-flex rounded-lg bg-muted/60 p-0.5 border border-border/60">
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  !isAdminMode 
                    ? "bg-card text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                My Tracker
              </button>
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  isAdminMode 
                    ? "bg-card text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Admin Portal
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!isAdminMode ? (
          /* ========================================================================= */
          /* EMPLOYEE / SELF TRACKER MODE                                              */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Live Ticking Clock and Session Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Local Time</p>
                <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {currentTime.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 md:text-right">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Session Status</p>
                <div>
                  {isClockedIn ? (
                    <Badge variant="success" className="animate-pulse shadow-sm px-2.5 py-0.5 text-xs font-bold gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active: {formatStopwatch(workedSeconds)}
                    </Badge>
                  ) : isClockedOut ? (
                    <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-bold gap-1.5 border-border/80">
                      <CheckCircle2 className="h-3 w-3 text-indigo-500" />
                      Shift Completed ({formatStopwatch(workedSeconds)})
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="px-2.5 py-0.5 text-xs font-bold gap-1.5 bg-rose-500/10 text-rose-500 border-rose-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                      Not Clocked In
                    </Badge>
                  )}
                </div>
                {todayRecord && (
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Clocked in: {todayRecord.check_in ? new Date(todayRecord.check_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                    {todayRecord.check_out && ` • Clocked out: ${new Date(todayRecord.check_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                  </p>
                )}
              </div>
            </div>

            {/* Shift Form */}
            {!isClockedOut && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Dropdown - Disabled once clocked in */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Select Status</Label>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={isClockedIn || markAttendance.isPending}
                      options={[
                        { value: "present", label: "Present" },
                        { value: "late", label: "Late" },
                        { value: "half-day", label: "Half-day" },
                      ]}
                    />
                  </div>

                  {/* Remarks Input */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Session Remarks (Optional)</Label>
                    <Input
                      placeholder="e.g. WFH, meeting client..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      disabled={markAttendance.isPending}
                    />
                  </div>
                </div>

                {/* Clock Actions */}
                <div className="pt-2 flex gap-3">
                  {!isClockedIn ? (
                    <Button
                      onClick={handleClockIn}
                      isLoading={markAttendance.isPending}
                      className="w-full flex-1 gradient-primary text-white font-bold h-11 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-glow"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Start Work Session (Clock In)
                    </Button>
                  ) : (
                    <Button
                      onClick={handleClockOut}
                      isLoading={markAttendance.isPending}
                      variant="destructive"
                      className="w-full flex-1 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold h-11 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                    >
                      <Square className="h-4 w-4 fill-current" />
                      End Work Session (Clock Out)
                    </Button>
                  )}
                </div>
              </div>
            )}

            {isClockedOut && (
              <div className="text-center py-6 border border-dashed border-border/80 rounded-xl bg-muted/10 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Your workday is complete!</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Today's session was successfully logged. Shift duration was{" "}
                    <span className="font-mono font-bold text-foreground">{formatStopwatch(workedSeconds)}</span>.
                  </p>
                </div>
                <div className="pt-2">
                  <Badge variant="outline" className="px-2 py-0.5 text-[11px] font-semibold text-muted-foreground border-border bg-card">
                    Remarks: {todayRecord.remarks || "No remarks added"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* ADMIN PORTAL MODE                                                         */
          /* ========================================================================= */
          <form onSubmit={handleAdminSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select Employee */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  Select Employee <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  placeholder="Choose an employee..."
                  options={employees.map((emp) => ({
                    value: emp.id,
                    label: `${emp.first_name} ${emp.last_name} (${emp.employee_id})`,
                  }))}
                />
              </div>

              {/* Select Date */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  Log Date
                </Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={todayStr}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Attendance Status */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Status</Label>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { value: "present", label: "Present" },
                    { value: "late", label: "Late" },
                    { value: "half-day", label: "Half-day" },
                    { value: "absent", label: "Absent" },
                    { value: "leave", label: "Leave" },
                    { value: "holiday", label: "Holiday" },
                  ]}
                />
              </div>

              {/* Check-In Time */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Check-In Time</Label>
                <Input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  disabled={status === "absent" || status === "leave" || status === "holiday"}
                />
              </div>

              {/* Check-Out Time */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Check-Out Time</Label>
                <Input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  disabled={status === "absent" || status === "leave" || status === "holiday"}
                />
              </div>
            </div>

            {/* Remarks Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-indigo-500" />
                Administrative Remarks
              </Label>
              <Input
                placeholder="Write reasons, adjustments or comments..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Summary Alert */}
            {selectedRecord && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-indigo-100 bg-indigo-50/20 text-xs text-indigo-950 dark:border-indigo-950/40 dark:bg-indigo-950/10">
                <AlertCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Existing attendance log found for this date.</span> Saving this form will overwrite the current record (Status: <span className="font-semibold capitalize text-indigo-600">{selectedRecord.status}</span>).
                </div>
              </div>
            )}

            {/* Save Button */}
            <Button
              type="submit"
              isLoading={markAttendance.isPending}
              className="w-full h-11 gradient-primary text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md mt-2"
            >
              Save Attendance Record
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
