import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import MemberSelect from "../@common/MemberSelect";
import { Text } from "@/components/@common/Text";
import { useGetSearchMemberListQuery } from "@/hooks/queries/useGetSearchMemberListQuery";
import { SearchMemberListResponse } from "@/types/dtos/event";

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
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: searchResponse, isLoading } = useGetSearchMemberListQuery(
    eventId,
    searchTerm || "",
    searchTrigger,
  );
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
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
          <Text typo="h2">추가할 학생의 이름을 검색해주세요.</Text>
          <Text typo="h2" style={{ width: "100%" }}>
            <SearchInput
              type="text"
              placeholder="이름을 입력하세요"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Text>
          <Text typo="h2" style={{ width: "100%" }}>
            <CheckButton variant="contained" onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "조회 중..." : "조회하기"}
            </CheckButton>
          </Text>
        </>
      )}
      {/* 결과 영역 */}
      {hasSearched && !isLoading && (
        <>
          {notFound ? (
            <>
              <NotFoundWrapper>
                <Text typo="h2" color="primary" style={{ display: "flex", alignItems: "center" }}>
                  {searchName ? `${searchName} ` : `${searchTerm}`}{" "}
                  <Text typo="h2">이름의 뒤풀이 신청자가 없어요</Text>
                </Text>
                <Text typo="h2">뒤풀이 참석자에 새로 추가하시겠어요?</Text>
              </NotFoundWrapper>
              <ButtonWrapper>
                <CheckButton variant="outlined" onClick={onCloseBottomSheet}>
                  취소하기
                </CheckButton>
                <CheckButton
                  variant="contained"
                  onClick={() => {
                    /* onAddNewMember() */
                  }}
                >
                  새로 추가하기
                </CheckButton>
              </ButtonWrapper>
            </>
          ) : searchResults.length > 0 ? (
            <>
              <Text typo="h2">아래 학생이 맞나요?</Text>
              <MemberWrapper>
                {searchResults.map(member => (
                  <MemberSelect
                    key={member.memberId}
                    name={member.name}
                    SID={member.studentId}
                    onSelect={() => {
                      setSelectedId(member.memberId);
                    }}
                    isSelected={selectedId === member.memberId}
                  />
                ))}
              </MemberWrapper>
              <Text
                typo="body2"
                color="mono800"
                style={{
                  textDecoration: "underline",
                }}
              >
                아니요, 회원 명단에 없는 사람입니다.
              </Text>
              <ButtonWrapper>
                <CheckButton variant="outlined" onClick={onCloseBottomSheet}>
                  취소하기
                </CheckButton>
                <CheckButton
                  variant="contained"
                  onClick={() => {
                    /* onAddNewMember() */
                  }}
                >
                  추가하기
                </CheckButton>
              </ButtonWrapper>
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default AfterPartySearchBottomSheet;

const SearchInput = styled("input")({
  "width": "100%",
  "padding": "8px 12px",
  "fontSize": "16px",
  "borderRadius": "4px",
  "boxSizing": "border-box",
  "flexGrow": 1,
  "background": "#F7F7F7",
  "::placeholder": {
    color: "#C2C2C2",
  },
});

const CheckButton = styled(Button)({
  width: "100%",
  padding: "13.5px 0",
});

const NotFoundWrapper = styled("div")({
  display: "flex",
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
const MemberWrapper = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});
