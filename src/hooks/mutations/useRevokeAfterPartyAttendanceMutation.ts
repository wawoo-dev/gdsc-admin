import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";

export default function useRevokeAfterPartyAttendanceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { eventParticipationId: number; afterPartyUpdateTarget: string }) =>
      eventApi.postAfterPartyAttendanceRevoke(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.afterPartyAttendances] });
    },
  });
}
