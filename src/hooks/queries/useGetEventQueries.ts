// hooks/useEventList.ts
import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";
import { EventResponse } from "@/types/dtos/event";

export const useEventList = (page: number = 1, size: number = 20, sort: string[] = []) => {
  return useQuery<EventResponse>({
    queryKey: [QueryKey.eventList, page, size, sort],
    queryFn: () => eventApi.getEventList(page, size, sort),
    staleTime: 1000 * 600,
  });
};
