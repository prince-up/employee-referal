import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; import { departmentsService } from "@/services/departments.service"; import type { Department } from "@/types";
export function useDepartments() { return useQuery({ queryKey: ["departments"], queryFn: departmentsService.list }); }
export function useCreateDepartment() { const client = useQueryClient(); return useMutation({ mutationFn: (data: Partial<Department>) => departmentsService.create(data), onSuccess: () => client.invalidateQueries({ queryKey: ["departments"] }) }); }
