import { useEffect, useState } from "react";
import AfterPartyAddParticipantBottomSheet from "./BottomSheet/AfterPartyAddParticipantBottomSheet";
import AfterPartyMemberBottomSheet from "./BottomSheet/AfterPartyMemberBottomSheet";
import AfterPartyNotFoundBottomSheet from "./BottomSheet/AfterPartyNotFoundBottomSheet";
import AfterPartyNotFoundInternal from "./BottomSheet/AfterPartyNotFoundInternal";
import usePostAfterPartyMemberOnsiteMutation from "@/hooks/mutations/usePostAfterPartyMemberOnsite";
import useGetAfterPartyAttendancesQuery from "@/hooks/queries/useGetAfterPartyAttendancesQuery";
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
  const [notFoundInternal, setNotFoundInternal] = useState(false);
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [invalidMessage, setInvalidMessage] = useState("");

  const { data: searchResponse, isLoading } = useGetSearchMemberListQuery(
    eventId,
    searchTerm || searchName || "",
    searchTrigger,
  );
  const postParticipantsMutation = usePostAfterPartyMemberOnsiteMutation();
  const { refetch } = useGetAfterPartyAttendancesQuery(eventId);

  const formattedPhone = (phone: string) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");
    console.log("Formatted phone digits:", digits);
    return digits;
  };

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
      refetch();
      onCloseBottomSheet();
    }
  };

  const handleAddNotFoundMember = async () => {
    if ((searchTerm.trim() === "" && !searchName) || (searchName?.trim() === "" && !searchTerm)) {
      console.log("Search term is empty. Cannot add not found member.");
      return;
    }
    if (studentId === "" || /^[A-Za-z][0-9]{6}$/.test(studentId)) {
      if (!/^01[016789][0-9]{8}$/.test(phone)) {
        setInvalidMessage("전화번호 형식이 올바르지 않습니다. ex) 010-1234-5678");
        return;
      }
    } else {
      setInvalidMessage("학번 형식이 올바르지 않습니다. ex) A123456 or 빈칸");
      return;
    }
    try {
      await postParticipantsMutation.mutateAsync({
        eventId,
        participant: {
          name: searchName?.trim() || searchTerm.trim(),
          studentId: studentId.trim(),
          phone: formattedPhone(phone).trim(),
        },
      });
    } catch (error) {
      console.error("Error adding not found member:", error);
    } finally {
      refetch();
      onCloseBottomSheet();
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
    setNotFound(false);
    if (filtered.length === 0) {
      setNotFoundInternal(true);
    }

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
      {
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
          ) : hasSearched && !isLoading && searchResults.length > 0 ? (
            <>
              <AfterPartyMemberBottomSheet
                searchResults={searchResults}
                selectedMember={selectedMember}
                setSelectedMember={setSelectedMember}
                onCloseBottomSheet={onCloseBottomSheet}
                handleAddNewMember={handleAddNewMember}
                setNotFoundInternal={setNotFoundInternal}
                setSearchResults={setSearchResults}
              />
            </>
          ) : (
            notFoundInternal && (
              <>
                <AfterPartyNotFoundInternal
                  searchTerm={searchTerm}
                  searchName={searchName}
                  onCloseBottomSheet={onCloseBottomSheet}
                  handleAddNotFoundMember={handleAddNotFoundMember}
                  phone={phone}
                  studentId={studentId}
                  setPhone={setPhone}
                  setStudentId={setStudentId}
                  invalidMessage={invalidMessage}
                />
              </>
            )
          )}
        </>
      }
    </>
  );
};

export default AfterPartySearchBottomSheet;
