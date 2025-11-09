import { useEffect, useState } from "react";
import AfterPartyAddParticipantBottomSheet from "./BottomSheet/AfterPartyAddParticipantBottomSheet";
import AfterPartyMemberBottomSheet from "./BottomSheet/AfterPartyMemberBottomSheet";
import AfterPartyNotFoundBottomSheet from "./BottomSheet/AfterPartyNotFoundBottomSheet";
import usePostNoneMemberParticipantsMutation from "@/hooks/mutations/usePostMemberParticipants";
import { useGetSearchMemberListQuery } from "@/hooks/queries/useGetSearchMemberListQuery";
import { SearchMemberListResponse } from "@/types/dtos/event";
import { Participant } from "@/types/dtos/event";

const AfterPartySearchBottomSheet = ({
  notFound,
  setNotFound,
  searchName,
  onCloseBottomSheet,
  eventId,
}: {
  notFound: boolean;
  setNotFound: (value: boolean) => void;
  searchName?: string;
  onCloseBottomSheet: () => void;
  eventId: number;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchMemberListResponse[]>([]);
  const [searchTrigger, setSearchTrigger] = useState(false); // 검색 트리거
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Participant | null>(null);

  const { data: searchResponse, isLoading } = useGetSearchMemberListQuery(
    eventId,
    searchTerm || searchName || "",
    searchTrigger,
  );
  const postParticipantsMutation = usePostNoneMemberParticipantsMutation();

  const handleAddNewMember = async () => {
    if (selectedMember === null) {
      return;
    }
    try {
      await postParticipantsMutation.mutateAsync({
        eventId,
        participant: {
          name: selectedMember.name,
          studentId: selectedMember.studentId.trim(),
          phone: selectedMember.phone.trim(),
        },
      });
    } catch (error) {
      console.error("Error adding new member:", error);
    } finally {
      window.location.reload();
    }
  };

  const handleSearch = () => {
    if ((searchTerm.trim() === "" && !searchName) || (searchName?.trim() === "" && !searchTerm)) {
      return;
    }
    // 검색 트리거를 증가시켜서 API 호출
    setSearchTrigger(true);
    setHasSearched(true);
  };

  useEffect(() => {
    if (notFound) {
      setHasSearched(true);
      return;
    }
    setNotFound(false);
  }, [searchTerm, setNotFound, notFound]);

  useEffect(() => {
    if (!searchTrigger || isLoading) {
      return;
    }
    if (!searchResponse) {
      return;
    }

    // 참여 가능한 멤버만 필터링
    const filtered = searchResponse.filter(m => m.participable);

    setSearchResults(filtered);
    setNotFound(filtered.length === 0);

    setSearchTrigger(false);
  }, [searchResponse, searchTrigger, isLoading, setNotFound]);

  return (
    <>
      {!hasSearched && (
        <>
          <AfterPartyAddParticipantBottomSheet
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            isLoading={isLoading}
          />
        </>
      )}
      {/* 결과 영역 */}
      {hasSearched && !isLoading && (
        <>
          {notFound ? (
            <>
              <AfterPartyNotFoundBottomSheet
                searchTerm={searchTerm}
                searchName={searchName}
                onCloseBottomSheet={onCloseBottomSheet}
                handleSearch={handleSearch}
              />
            </>
          ) : searchResults.length > 0 ? (
            <>
              <AfterPartyMemberBottomSheet
                searchResults={searchResults}
                selectedMember={selectedMember}
                setSelectedMember={setSelectedMember}
                onCloseBottomSheet={onCloseBottomSheet}
                handleAddNewMember={handleAddNewMember}
              />
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default AfterPartySearchBottomSheet;
