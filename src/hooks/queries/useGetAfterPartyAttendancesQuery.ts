import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";

export default function useGetAfterPartyAttendancesQuery(eventId: number) {
  const { data } = useQuery({
    queryKey: [QueryKey.afterPartyAttendances, eventId],
    queryFn: () => eventApi.getAfterPartyAttendances(eventId),
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
  };
}
