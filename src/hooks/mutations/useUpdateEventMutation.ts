import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { EventType } from "@/types/dtos/event";
import { QueryKey } from "@/constants/queryKey";

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<EventType, Error, { eventId: number; eventData: EventType }>({
    mutationFn: ({ eventId, eventData }) => eventApi.updateEvent(eventId, eventData),
    onSuccess: (data, variables) => {
      // 이벤트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [QueryKey.eventList] });
      // 특정 이벤트 캐시 업데이트
      queryClient.setQueryData([QueryKey.eventList, variables.eventId], data);
      console.log("이벤트가 성공적으로 수정되었습니다:", data);
    },
    onError: error => {
      console.error("이벤트 수정 중 오류가 발생했습니다:", error);
    },
  });
};
