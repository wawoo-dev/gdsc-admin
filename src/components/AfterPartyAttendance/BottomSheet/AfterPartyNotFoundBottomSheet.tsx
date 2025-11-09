import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { Text } from "@/components/@common/Text";

interface AfterPartyNotFoundBottomSheetProps {
  searchTerm: string;
  searchName?: string;
  onCloseBottomSheet: () => void;
  handleSearch: () => void;
}

const AfterPartyNotFoundBottomSheet = ({
  searchTerm,
  searchName,
  onCloseBottomSheet,
  handleSearch,
}: AfterPartyNotFoundBottomSheetProps) => {
  return (
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
            handleSearch();
          }}
        >
          새로 추가하기
        </CheckButton>
      </ButtonWrapper>
    </>
  );
};
export default AfterPartyNotFoundBottomSheet;
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
