import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";

interface PostAfterPartyMemberOnsiteParams {
  eventId: number;
  participant: {
    name: string;
    studentId: string;
    phone: string;
  };
}

export default function usePostAfterPartyMemberOnsiteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, participant }: PostAfterPartyMemberOnsiteParams) =>
      eventApi.postAfterPartyOnsiteAttendance(eventId, participant),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventParticipants"] });
    },
  });
}
