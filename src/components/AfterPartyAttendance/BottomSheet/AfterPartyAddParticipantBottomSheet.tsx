import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { Text } from "@/components/@common/Text";

interface AfterPartyAddParticipantBottomSheetProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  isLoading: boolean;
}

const AfterPartyAddParticipantBottomSheet = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  isLoading,
}: AfterPartyAddParticipantBottomSheetProps) => {
  return (
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
  );
};
export default AfterPartyAddParticipantBottomSheet;

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
