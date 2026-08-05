import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; import { attendanceService } from "@/services/attendance.service"; import type { AttendanceFilters, AttendanceRecord } from "@/types";
export function useAttendance(filters: AttendanceFilters = {}) { return useQuery({ queryKey: ["attendance", filters], queryFn: () => attendanceService.list(filters) }); }
export function useMarkAttendance() { const client = useQueryClient(); return useMutation({ mutationFn: (input: Pick<AttendanceRecord, "employee_id" | "date" | "status" | "check_in" | "check_out" | "remarks">) => attendanceService.mark(input), onSuccess: () => { client.invalidateQueries({ queryKey: ["attendance"] }); client.invalidateQueries({ queryKey: ["dashboard"] }); } }); }

