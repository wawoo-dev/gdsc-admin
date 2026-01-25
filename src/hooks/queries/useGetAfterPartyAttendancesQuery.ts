import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";

export default function useGetAfterPartyAttendancesQuery(eventId: number) {
  const { data, isError, error, refetch } = useQuery({
    queryKey: [QueryKey.afterPartyAttendances, eventId],
    queryFn: () => eventApi.getAfterPartyAttendances(eventId),
    retry: false,
  });

  const eventParticipantList = data?.eventParticipationDtos;
  const currentApplicantCount = data?.mainEventCurrentApplicantCount;
  const attendedAfterApplyingCount = data?.attendedAfterApplyingCount;
  const notAttendedAfterApplyingCount = data?.notAttendedAfterApplyingCount;
  const onSiteApplicationCount = data?.onSiteApplicationCount;

  return {
    eventParticipantList,
    currentApplicantCount,
    attendedAfterApplyingCount,
    notAttendedAfterApplyingCount,
    onSiteApplicationCount,
    isError,
    error,
    refetch,
  };
}
