import { useMutation } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";

interface PostMemberParticipantsParams {
  eventId: number;
  participant: {
    name: string;
    studentId: string;
    phone: string;
  };
}

export default function usePostMemberParticipantsMutation() {
  return useMutation({
    mutationFn: ({ eventId, participant }: PostMemberParticipantsParams) =>
      eventApi.postMemberParticipants(eventId, participant),
  });
}
