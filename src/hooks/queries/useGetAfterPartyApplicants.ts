// hooks/queries/useGetAfterPartyApplicants.ts
import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { AfterPartyData } from "@/components/EditEvent/mockData/afterPartyMockData";

export const useGetAfterPartyApplicants = (
  eventId: number,
  page: number = 0,
  size: number = 20,
  sort: string = "",
) => {
  return useQuery<AfterPartyData>({
    queryKey: ["afterPartyApplicants", eventId, page, size, sort],
    queryFn: () => eventApi.getAfterPartyApplicants(eventId, page, size, sort),
    staleTime: 60_000,
    enabled: !!eventId,
  });
};
