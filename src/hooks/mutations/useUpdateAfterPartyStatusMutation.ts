import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";

export const useUpdateAfterPartyStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventParticipationId,
      afterPartyUpdateTarget,
      isChecked,
      onSuccess,
    }: {
      eventParticipationId: number;
      afterPartyUpdateTarget: "ATTENDANCE" | "PRE_PAYMENT" | "POST_PAYMENT";
      isChecked: boolean;
      onSuccess?: () => void;
    }) => {
      const apiCall = isChecked
        ? eventApi.updateAfterPartyStatus(eventParticipationId, afterPartyUpdateTarget)
        : eventApi.revokeAfterPartyStatus(eventParticipationId, afterPartyUpdateTarget);
      return apiCall.then(result => {
        // 뒤풀이 신청자 목록 쿼리 무효화하여 다시 fetch
        queryClient.invalidateQueries({ queryKey: ["afterPartyApplicants"] });

        // 전달받은 onSuccess 콜백 실행
        onSuccess?.();

        return result;
      });
    },
    onError: error => {
      console.error("뒤풀이 상태 업데이트 중 오류가 발생했습니다:", error);
    },
  });
};
