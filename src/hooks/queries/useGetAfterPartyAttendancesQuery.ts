import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";

export default function useGetAfterPartyAttendancesQuery(eventId: number) {
  const { data, isError, error, refetch } = useQuery({
    queryKey: [QueryKey.afterPartyAttendances, eventId],
    queryFn: () => eventApi.getAfterPartyAttendances(eventId),
    retry: false,
  });

  const eventParticipantList = data?.eventParticipationDtos;
  const totalAttendeesCount = data?.totalAttendeesCount;
  const attendedAfterApplyingCount = data?.attendedAfterApplyingCount;
  const notAttendedAfterApplyingCount = data?.notAttendedAfterApplyingCount;
  const onSiteApplicationCount = data?.onSiteApplicationCount;

  return {
    eventParticipantList,
    totalAttendeesCount,
    attendedAfterApplyingCount,
    notAttendedAfterApplyingCount,
    onSiteApplicationCount,
    isError,
    error,
    refetch,
  };
}
