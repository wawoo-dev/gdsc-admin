import { useMutation } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";

interface PostNoneMemberParticipantsParams {
  eventId: number;
  participant: {
    name: string;
    studentId: string;
    phone: string;
  };
}

export default function usePostNoneMemberParticipantsMutation() {
  return useMutation({
    mutationFn: ({ eventId, participant }: PostNoneMemberParticipantsParams) =>
      eventApi.postNoneMemberParticipants(eventId, participant),
  });
}
