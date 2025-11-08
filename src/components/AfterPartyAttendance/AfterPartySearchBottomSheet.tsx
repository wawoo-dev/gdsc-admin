import { useState } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { Text } from "@/components/@common/Text";

const AfterPartySearchBottomSheet = ({
  notFound,
  searchName,
  onCloseBottomSheet,
}: {
  notFound: boolean;
  searchName?: string;
  onCloseBottomSheet: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = () => {
    // 검색 로직 구현
    console.log("Searching for:", searchTerm);
  };
  return (
    <>
      {notFound ? (
        <>
          <NotFoundWrapper>
            <Text typo="h2" color="primary" style={{ display: "flex", alignItems: "center" }}>
              {searchName} <Text typo="h2">이름의 뒤풀이 신청자가 없어요</Text>
            </Text>
            <Text typo="h2">뒤풀이 참석자에 새로 추가하시겠어요?</Text>
          </NotFoundWrapper>
          <ButtonWrapper>
            <CheckButton variant="outlined" onClick={onCloseBottomSheet}>
              취소하기
            </CheckButton>
            <CheckButton variant="contained" onClick={handleSearch}>
              새로 추가하기
            </CheckButton>
          </ButtonWrapper>
        </>
      ) : (
        <>
          <Text typo="h2">추가할 학생의 이름을 검색해주세요.</Text>
          <Text typo="h2" style={{ width: "100%" }}>
            <SearchInput
              type="text"
              placeholder="이름을 입력하세요"
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Text>
          <Text typo="h2" style={{ width: "100%" }}>
            <CheckButton variant="contained" onClick={handleSearch}>
              조회하기
            </CheckButton>
          </Text>
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
  marginTop: "16px",
  width: "100%",
});
