// hooks/useEventList.ts
import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { EventResponse } from "@/types/dtos/event";

export const useEventList = (page: number = 1, size: number = 20) => {
  return useQuery<EventResponse>({
    queryKey: ["eventList", page, size], // 캐싱 키
    queryFn: () => eventApi.getEventList(page, size), // API 호출 함수
    staleTime: 1000 * 60, // 1분 동안 캐시 유지
  });
};
