import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { color } from "wowds-tokens";
import AfterPartyAddParticipantBottomSheet from "./BottomSheet/AfterPartyAddParticipantBottomSheet";
import AfterPartyMemberBottomSheet from "./BottomSheet/AfterPartyMemberBottomSheet";
import AfterPartyNotFoundBottomSheet from "./BottomSheet/AfterPartyNotFoundBottomSheet";
import { Text } from "@/components/@common/Text";
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

  const { data: searchResponse, isLoading } = useGetSearchMemberListQuery(
    eventId,
    searchTerm || searchName || "",
    searchTrigger,
  );
  const postParticipantsMutation = usePostAfterPartyMemberOnsiteMutation();
  const { refetch } = useGetAfterPartyAttendancesQuery(eventId);

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
    if (searchName?.trim() === "") {
      console.log("Search term is empty. Cannot add not found member.");
      return;
    }
    try {
      await postParticipantsMutation.mutateAsync({
        eventId,
        participant: {
          name: searchName?.trim() || searchTerm.trim(),
          studentId: studentId.trim(),
          phone: phone.trim(),
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
                <NotFoundWrapper>
                  <div
                    style={{
                      marginBottom: "28px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      typo="h2"
                      color="primary"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {searchName ? `${searchName} ` : `${searchTerm}`}{" "}
                      <Text typo="h2">이름의 학생이 어드민에 없어요</Text>
                    </Text>
                    <Text typo="h2">뒤풀이 참석자에 새로 추가하시겠어요?</Text>
                  </div>

                  <MemberInputWrapper>
                    <Text
                      typo="h3"
                      color="mono600"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      전화번호<Text color="primary">*</Text>
                    </Text>
                    <MemberInput
                      type="text"
                      placeholder="전화번호를 입력하세요"
                      onChange={e => setPhone(e.target.value)}
                    />
                  </MemberInputWrapper>
                  <MemberInputWrapper>
                    <Text
                      typo="h3"
                      color="mono600"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      학번
                    </Text>
                    <MemberInput
                      type="text"
                      placeholder="학번을 입력하세요"
                      onChange={e => setStudentId(e.target.value)}
                    />
                  </MemberInputWrapper>
                </NotFoundWrapper>

                <ButtonWrapper>
                  <CheckButton variant="outlined" onClick={onCloseBottomSheet}>
                    취소하기
                  </CheckButton>
                  <CheckButton
                    variant="contained"
                    disabled={phone.trim() === ""}
                    onClick={() => {
                      handleAddNotFoundMember();
                    }}
                  >
                    추가하기
                  </CheckButton>
                </ButtonWrapper>
              </>
            )
          )}
        </>
      }
    </>
  );
};

export default AfterPartySearchBottomSheet;
const CheckButton = styled(Button)({
  width: "100%",
  padding: "13.5px 0",
});

const NotFoundWrapper = styled("div")({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
});

const ButtonWrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: "8px",
  width: "100%",
});

const MemberInput = styled("input")({
  border: "none",
  outline: "none",
  width: "100%",
  padding: "8px 12px",
  flexGrow: 1,
  backgroundColor: color.mono50,
  maxWidth: "80%",
  borderRadius: "4px",
});

const MemberInputWrapper = styled("div")({
  "display": "flex",
  "flexDirection": "row",
  "alignItems": "center",
  "flexGrow": 1,
  "width": "60%",
  "justifyContent": "space-between",

  "@media (max-width: 480px)": {
    gap: "8px",
    width: "100%",
  },
});
