import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import BottomSheet from "@/components/@common/BottomSheet";
import MobileLayout from "@/components/@layout/MobileLayout";
import AfterPartyAttendanceHeader from "@/components/AfterPartyAttendance/AfterPartyAttendanceHeader";
import AfterPartyAttendanceSummary from "@/components/AfterPartyAttendance/AfterPartyAttendanceSummary";
import AfterPartyAttendanceTable from "@/components/AfterPartyAttendance/AfterPartyAttendanceTable";
import AfterPartyBottomSearch from "@/components/AfterPartyAttendance/AfterPartyBottomSearch";
import AfterPartySearchBottomSheet from "@/components/AfterPartyAttendance/AfterPartySearchBottomSheet";
import { QueryKey } from "@/constants/queryKey";
import usePutAfterPartyAttendanceMutation from "@/hooks/mutations/usePutAfterPartyAttendancesMutation";
import useRevokeAfterPartyAttendanceMutation from "@/hooks/mutations/useRevokeAfterPartyAttendanceMutation";
import useGetAfterPartyAttendancesQuery from "@/hooks/queries/useGetAfterPartyAttendancesQuery";
import { useGetEvent } from "@/hooks/queries/useGetEvent";

export default function AfterPartyAttendancePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const eventId = id ? parseInt(id, 10) : 0;
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchName, setSearchName] = useState("");
  const [notFound, setNotFound] = useState(false);

  const {
    eventParticipantList,
    totalAttendeesCount,
    attendedAfterApplyingCount,
    notAttendedAfterApplyingCount,
    onSiteApplicationCount,
  } = useGetAfterPartyAttendancesQuery(eventId);

  const eventData = useGetEvent(eventId);

  const initialSelectedIds = useMemo(
    () =>
      new Set(
        (eventParticipantList || [])
          .filter(participant => participant.afterPartyAttendanceStatus === "ATTENDED")
          .map(participant => participant.eventParticipationId),
      ),
    [eventParticipantList],
  );

  useEffect(() => {
    if (eventParticipantList && !isEditMode) {
      setSelectedIds(initialSelectedIds);
    }
  }, [eventParticipantList, initialSelectedIds, isEditMode]);

  const mutation = usePutAfterPartyAttendanceMutation();
  const revokeMutation = useRevokeAfterPartyAttendanceMutation();

  const handleSave = async () => {
    setSearchTerm("");
    setSearchName("");
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

      queryClient.invalidateQueries({ queryKey: [QueryKey.afterPartyAttendances] });
    } catch (error) {
      console.error("저장 중 오류가 발생했습니다:", error);
      setSelectedIds(initialSelectedIds);
    }
  };

  const handleParticipantAdded = () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.afterPartyAttendances] });
    setSearchTerm("");
    setSearchName("");
    setIsBottomSheetOpen(true);
  };

  const handleNotFoundName = () => {
    setNotFound(true);
    setIsBottomSheetOpen(true);
  };
  const onCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setNotFound(false); // notFound 케이스면 함께 리셋 추천
    setSearchName("");
    setSearchTerm("");
  };

  const handleSearchParticipant = () => {
    setSearchName(searchTerm);
  };

  return (
    <MobileLayout
      header={
        <AfterPartyAttendanceHeader
          headerTitle={eventData.data?.eventData?.name || "뒤풀이 참석자 관리"}
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
        appliedAndAttendedCount={attendedAfterApplyingCount}
        appliedAndNotAttendedCount={notAttendedAfterApplyingCount}
        onSiteAppliedCount={onSiteApplicationCount}
      />
      <AfterPartyAttendanceTable
        isEditMode={isEditMode}
        afterPartyParticipants={eventParticipantList || []}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        searchName={searchName}
        handleNotFoundName={handleNotFoundName}
      />
      {isEditMode && (
        <AfterPartyBottomSearch
          handleParticipantAdded={handleParticipantAdded}
          handleSearch={handleSearchParticipant}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
      )}
      {isBottomSheetOpen && (
        <BottomSheet onCloseBottomSheet={onCloseBottomSheet}>
          <AfterPartySearchBottomSheet
            setNotFound={setNotFound}
            notFound={notFound}
            searchName={searchName}
            onCloseBottomSheet={onCloseBottomSheet}
            eventId={eventId}
          />
        </BottomSheet>
      )}
    </MobileLayout>
  );
}
