import { useMutation } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";

export default function usePutAfterPartyAttendanceMutation() {
  return useMutation({
    mutationFn: (eventParticipationIds: number[]) =>
      eventApi.putAfterPartyAttendances(eventParticipationIds),
  });
}
