import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { EventType } from "@/types/dtos/event";

export const useGetEvent = (eventId: number | null) => {
  return useQuery<EventType | null>({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) {
        return null;
      }

      // 전체 이벤트 목록에서 특정 이벤트 찾기
      const eventListResponse = await eventApi.getEventList(0, 20)
      const event = eventListResponse.content.find(c => c.event.eventId === eventId)?.event;
      return event || null;
    },
    enabled: eventId !== null && eventId > 0,
  });
};
