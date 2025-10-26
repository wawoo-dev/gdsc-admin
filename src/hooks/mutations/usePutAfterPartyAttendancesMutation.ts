import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";

export default function usePutAfterPartyAttendanceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventParticipationIds: number[]) =>
      eventApi.putAfterPartyAttendances(eventParticipationIds),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventParticipants"] });
    },
  });
}
