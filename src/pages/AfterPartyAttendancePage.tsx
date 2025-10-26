import { useState, useMemo, useEffect } from "react";
import MobileLayout from "@/components/@layout/MobileLayout";
import AfterPartyAttendanceHeader from "@/components/AfterPartyAttendance/AfterPartyAttendanceHeader";
import AfterPartyAttendanceSummary from "@/components/AfterPartyAttendance/AfterPartyAttendanceSummary";
import AfterPartyAttendanceTable from "@/components/AfterPartyAttendance/AfterPartyAttendanceTable";
import usePutAfterPartyAttendanceMutation from "@/hooks/mutations/usePutAfterPartyAttendancesMutation";
import useRevokeAfterPartyAttendanceMutation from "@/hooks/mutations/useRevokeAfterPartyAttendanceMutation";
import useGetAfterPartyAttendancesQuery from "@/hooks/queries/useGetAfterPartyAttendancesQuery";

export default function AfterPartyAttendancePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    eventParticipantList,
    totalAttendeesCount,
    attendedAfterApplyingCount,
    notAttendedAfterApplyingCount,
    onSiteApplicationCount,
  } = useGetAfterPartyAttendancesQuery(15);

  const initialSelectedIds = useMemo(
    () =>
      new Set(
        (eventParticipantList || [])
          .filter(participant => participant.afterPartyAttendanceStatus === "ATTENDED")
          .map(participant => participant.memberId),
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
  const mutation = usePutAfterPartyAttendanceMutation();
  const revokeMutation = useRevokeAfterPartyAttendanceMutation();

  const handleSave = async () => {
    // 초기값과 현재값이 같으면 저장하지 않음
    const initialIdsArray = Array.from(initialSelectedIds).sort();
    const currentIdsArray = Array.from(selectedIds).sort();

    if (
      initialIdsArray.length === currentIdsArray.length &&
      initialIdsArray.every((id, index) => id === currentIdsArray[index])
    ) {
      setIsEditMode(false);
      return;
    }

    // 추가된 ID들 (새로 선택된 것들)
    const addedIds = Array.from(selectedIds).filter(id => !initialSelectedIds.has(id));

    // 제거된 ID들 (선택 해제된 것들)
    const removedIds = Array.from(initialSelectedIds).filter(id => !selectedIds.has(id));

    try {
      // 추가된 항목들 처리
      if (addedIds.length > 0) {
        const addedEventParticipationIds = addedIds
          .map(memberId => {
            const participant = eventParticipantList?.find(p => p.memberId === memberId);
            return participant?.eventParticipationId;
          })
          .filter((id): id is number => id !== undefined);

        if (addedEventParticipationIds.length > 0) {
          await new Promise((resolve, reject) => {
            mutation.mutate(addedEventParticipationIds, {
              onSuccess: resolve,
              onError: reject,
            });
          });
        }
      }

      // 제거된 항목들 처리 (병렬로 실행)
      if (removedIds.length > 0) {
        const revokePromises = removedIds.map(memberId => {
          const participant = eventParticipantList?.find(p => p.memberId === memberId);
          if (participant?.eventParticipationId) {
            return new Promise((resolve, reject) => {
              revokeMutation.mutate(
                {
                  eventParticipationId: participant.eventParticipationId,
                  afterPartyUpdateTarget: "ATTENDANCE",
                },
                {
                  onSuccess: resolve,
                  onError: reject,
                },
              );
            });
          }
          return Promise.resolve();
        });

        await Promise.all(revokePromises);
      }

      setIsEditMode(false);
    } catch (error) {
      console.error("저장 중 오류가 발생했습니다:", error);
    }
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
    </MobileLayout>
  );
}
