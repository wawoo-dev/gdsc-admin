import { useMutation } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";

interface PostParticipantsParams {
  eventId: number;
  memberId: number;
}

export default function usePostParticipantsMutation() {
  return useMutation({
    mutationFn: ({ eventId, memberId }: PostParticipantsParams) =>
      eventApi.postParticipants(eventId, memberId),
  });
}
