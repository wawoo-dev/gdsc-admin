import { eventApi } from "@/apis/eventApi";
import { useQuery } from "@tanstack/react-query";

export const useGetEvent = (eventId: number | null) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) {
        return null;
      }

      const eventContent = await eventApi.getSpecificEvent(eventId);
      return {
        eventData: eventContent.event,
        currentApplicantCount: eventContent.mainEventCurrentApplicantCount,
      };
    },
    enabled: eventId !== null && eventId > 0,
  });
};
