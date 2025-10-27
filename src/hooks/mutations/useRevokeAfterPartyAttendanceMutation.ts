import { useMutation } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";

export default function useRevokeAfterPartyAttendanceMutation() {
  return useMutation({
    mutationFn: (data: { eventParticipationId: number; afterPartyUpdateTarget: string }) =>
      eventApi.postAfterPartyAttendanceRevoke(data),
  });
}
