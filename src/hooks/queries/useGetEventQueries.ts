// hooks/useEventList.ts
import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";
import { EventResponse } from "@/types/dtos/event";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useEventList = (
  page: number = 1,
  size: number = 20,
  sort: string = "",
  searchQuery: string = "",
) => {
  return useQuery<EventResponse>({
    queryKey: [QueryKey.eventList, page, size, sort, searchQuery],
    queryFn: () => eventApi.getEventList(page, size, sort, searchQuery),
    placeholderData: keepPreviousData, // 페이지 전환 시 데이터 fetching 전까지 기존 데이터 유지
    staleTime: 1000 * 600,
  });
};
