import { styled } from "@mui/system";
import { Text } from "@/components/@common/Text";

const AfterPartySearchBottomSheet = () => {
  return (
    <>
      <Text typo="h2">추가할 학생의 이름을 검색해주세요.</Text>
      <Text typo="h2" style={{ width: "100%" }}>
        <SearchInput type="text" placeholder="이름을 입력하세요" />
      </Text>
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
