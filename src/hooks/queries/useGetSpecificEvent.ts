import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";

export const useGetSpecificEventQuery = (eventId: number) => {
  return useQuery({
    queryKey: [QueryKey.specificEvent, eventId],
    queryFn: () => eventApi.getSpecificEvent(eventId),
    staleTime: 1000 * 60,
  });
};
