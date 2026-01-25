import { eventApi } from "@/apis/eventApi";
import { useQuery } from "@tanstack/react-query";

export const useGetEvent = (eventId: number | null) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) {
        return null;
      }

      // 전체 이벤트 목록에서 특정 이벤트 찾기
      const eventListResponse = await eventApi.getEventList(0, 100);
      const event = eventListResponse.content.find(c => c.event.eventId === eventId);
      return {
        eventData: event?.event || null,
        currentApplicantCount: event?.mainEventCurrentApplicantCount,
      };
    },
    enabled: eventId !== null && eventId > 0,
  });
};
