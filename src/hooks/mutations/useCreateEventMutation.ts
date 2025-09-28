import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";
import { CreateEventRequest } from "@/types/dtos/event";

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ eventId: string }, Error, CreateEventRequest>({
    mutationFn: (eventData: CreateEventRequest) => eventApi.createEvent(eventData),
    onSuccess: () => {
      // 이벤트 목록 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: [QueryKey.eventList] });
    },
    onError: error => {
      console.error("이벤트 생성 중 오류가 발생했습니다:", error);
    },
  });
};
