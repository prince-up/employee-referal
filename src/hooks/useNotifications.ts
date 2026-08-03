import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; import { notificationsService } from "@/services/notifications.service";
export function useNotifications() { return useQuery({ queryKey: ["notifications"], queryFn: notificationsService.list, refetchInterval: 30_000 }); }
export function useMarkNotificationRead() { const client = useQueryClient(); return useMutation({ mutationFn: notificationsService.markRead, onSuccess: () => client.invalidateQueries({ queryKey: ["notifications"] }) }); }
