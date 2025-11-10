import { useState } from "react";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { color } from "wowds-tokens";
import Search from "@/assets/search.svg?react";
import UserPlus from "@/assets/user-plus.svg?react";

export default function AfterPartyBottomSearch({
  handleParticipantAdded,
  handleSearch,
  setSearchTerm,
}: {
  handleParticipantAdded: () => void;
  handleSearch: () => void;
  setSearchTerm: (term: string) => void;
}) {
  const [isSearching, setIsSearching] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsSearching(e.target.value.length > 0);
  };

  return (
    <BottomSheetWrapper onClick={e => e.stopPropagation()}>
      <InputWrapper>
        <Search />
        <Input type="text" placeholder="이름을 입력하세요" onChange={handleInputChange} />
      </InputWrapper>
      {isSearching ? (
        <SearchButton variant="contained" onClick={handleSearch}>
          검색
        </SearchButton>
      ) : (
        <UserPlus onClick={handleParticipantAdded} style={{ cursor: "pointer" }} />
      )}
    </BottomSheetWrapper>
  );
}
const InputWrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: "4px",
  flexGrow: 1,
  backgroundColor: color.mono50,
});
const Input = styled("input")({
  "border": "none",
  "outline": "none",
  "fontSize": "16px",
  "fontWeight": 500,
  "width": "100%",
  "padding": "0px 8px",
  "flexGrow": 1,
  "&::placeholder": {
    color: color.mono400,
  },
});

const SearchButton = styled(Button)({
  margin: "6px 0px",
  padding: "6px 12px",
});

const BottomSheetWrapper = styled("div")({
  position: "fixed",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderTop: `1px solid ${color.mono200}`,
  padding: "12px 16px",
  zIndex: 10,
  maxWidth: "768px",
  margin: "0 auto",
  gap: "12px",
});
