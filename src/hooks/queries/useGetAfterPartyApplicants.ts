// hooks/queries/useGetAfterPartyApplicants.ts
import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { AfterPartyData } from "@/components/EditEvent/mockData/afterPartyMockData";

export const useGetAfterPartyApplicants = (eventId: number) => {
  return useQuery<AfterPartyData>({
    queryKey: ["afterPartyApplicants", eventId],
    queryFn: () => eventApi.getAfterPartyApplicants(eventId),
    staleTime: 60_000,
    enabled: !!eventId,
  });
};
