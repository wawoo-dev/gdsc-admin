import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import MobileLayout from "@/components/@layout/MobileLayout";
import AfterPartyAttendanceHeader from "@/components/AfterPartyAttendance/AfterPartyAttendanceHeader";
import AfterPartyAttendanceSummary from "@/components/AfterPartyAttendance/AfterPartyAttendanceSummary";
import AfterPartyAttendanceTable from "@/components/AfterPartyAttendance/AfterPartyAttendanceTable";
import { QueryKey } from "@/constants/queryKey";
import usePutAfterPartyAttendanceMutation from "@/hooks/mutations/usePutAfterPartyAttendancesMutation";
import useRevokeAfterPartyAttendanceMutation from "@/hooks/mutations/useRevokeAfterPartyAttendanceMutation";
import useGetAfterPartyAttendancesQuery from "@/hooks/queries/useGetAfterPartyAttendancesQuery";

export default function AfterPartyAttendancePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const eventId = id ? parseInt(id, 10) : 0;

  const {
    eventParticipantList,
    totalAttendeesCount,
    attendedAfterApplyingCount,
    notAttendedAfterApplyingCount,
    onSiteApplicationCount,
  } = useGetAfterPartyAttendancesQuery(eventId);

  const initialSelectedIds = useMemo(
    () =>
      new Set(
        (eventParticipantList || [])
          .filter(participant => participant.afterPartyAttendanceStatus === "ATTENDED")
          .map(participant => participant.eventParticipationId),
      ),
    [eventParticipantList],
  );

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // eventParticipantList가 로드되면 초기값 설정
  useEffect(() => {
    if (eventParticipantList) {
      setSelectedIds(initialSelectedIds);
    }
  }, [eventParticipantList, initialSelectedIds]);

  // 변경사항 감지
  useEffect(() => {
    const initialIdsArray = Array.from(initialSelectedIds).sort();
    const currentIdsArray = Array.from(selectedIds).sort();
    const hasChanges = !(
      initialIdsArray.length === currentIdsArray.length &&
      initialIdsArray.every((id, index) => id === currentIdsArray[index])
    );
    setHasUnsavedChanges(hasChanges);
  }, [selectedIds, initialSelectedIds]);
  const mutation = usePutAfterPartyAttendanceMutation();
  const revokeMutation = useRevokeAfterPartyAttendanceMutation();

  const handleSave = async () => {
    const initialIdsArray = Array.from(initialSelectedIds).sort();
    const currentIdsArray = Array.from(selectedIds).sort();

    if (
      initialIdsArray.length === currentIdsArray.length &&
      initialIdsArray.every((id, index) => id === currentIdsArray[index])
    ) {
      setIsEditMode(false);
      return;
    }

    // 추가된 ID들 (새로 선택된 eventParticipationId들)
    const addedEventParticipationIds = Array.from(selectedIds).filter(
      id => !initialSelectedIds.has(id),
    );

    // 제거된 ID들 (선택 해제된 eventParticipationId들)
    const removedEventParticipationIds = Array.from(initialSelectedIds).filter(
      id => !selectedIds.has(id),
    );

    try {
      // 추가된 항목들 처리
      if (addedEventParticipationIds.length > 0) {
        await new Promise((resolve, reject) => {
          mutation.mutate(addedEventParticipationIds, {
            onSuccess: () => resolve(undefined),
            onError: reject,
          });
        });
      }

      // 제거된 항목들 처리 (순차적으로 실행)
      if (removedEventParticipationIds.length > 0) {
        for (const eventParticipationId of removedEventParticipationIds) {
          await new Promise((resolve, reject) => {
            revokeMutation.mutate(
              {
                eventParticipationId: eventParticipationId,
                afterPartyUpdateTarget: "ATTENDANCE",
              },
              {
                onSuccess: () => resolve(undefined),
                onError: error => reject(error),
              },
            );
          });
        }
      }

      setIsEditMode(false);

      // 편집 모드 종료 후 쿼리 무효화
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [QueryKey.afterPartyAttendances] });
      }, 100);
    } catch (error) {
      console.error("저장 중 오류가 발생했습니다:", error);
    }
  };

  const handleSearchModalClose = () => {
    setIsEditMode(false);
  };

  const handleParticipantAdded = () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.afterPartyAttendances] });
  };

  return (
    <MobileLayout
      header={
        <AfterPartyAttendanceHeader
          headerTitle="25학년도 2학기 개강총회"
          onEditClick={() => {
            if (isEditMode) {
              handleSave();
            } else {
              setIsEditMode(true);
            }
          }}
          isEditMode={isEditMode}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      }
    >
      <AfterPartyAttendanceSummary
        totalCount={totalAttendeesCount}
        applyedAndAttendedCount={attendedAfterApplyingCount}
        applyedAndNotAttendedCount={notAttendedAfterApplyingCount}
        onSiteApplyedCount={onSiteApplicationCount}
      />
      <AfterPartyAttendanceTable
        isEditMode={isEditMode}
        afterPartyParticipants={eventParticipantList || []}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
      />
      {/* 바텀시트 구현 필요 */}
      {isEditMode && (
        <div>
          <p>검색 모달 (추후 구현)</p>
          <button onClick={handleSearchModalClose}>닫기</button>
          <button onClick={handleParticipantAdded}>참가자 추가 (테스트)</button>
        </div>
      )}
    </MobileLayout>
  );
}
