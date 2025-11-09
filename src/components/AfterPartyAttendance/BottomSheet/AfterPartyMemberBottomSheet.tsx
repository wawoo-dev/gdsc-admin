import { Button, styled } from "@mui/material";
import MemberSelect from "@/components/@common/MemberSelect";
import { Text } from "@/components/@common/Text";
import { Participant } from "@/types/dtos/event";
import { SearchMemberListResponse } from "@/types/dtos/event";

interface AfterPartyMemberBottomSheetProps {
  searchResults: Participant[];
  selectedMember: Participant | null;
  setSelectedMember: (member: Participant) => void;
  onCloseBottomSheet: () => void;
  handleAddNewMember: () => void;
  setNotFoundInternal: (value: boolean) => void;
  setSearchResults: (value: SearchMemberListResponse[]) => void;
}
const AfterPartyMemberBottomSheet = ({
  searchResults,
  selectedMember,
  setSelectedMember,
  onCloseBottomSheet,
  handleAddNewMember,
  setNotFoundInternal,
  setSearchResults,
}: AfterPartyMemberBottomSheetProps) => {
  return (
    <>
      <Text typo="h2">아래 학생이 맞나요?</Text>
      <MemberWrapper>
        {searchResults.map(member => (
          <MemberSelect
            name={member.name}
            SID={member.studentId}
            onSelect={() => {
              setSelectedMember(member);
            }}
            isSelected={selectedMember === member}
          />
        ))}
      </MemberWrapper>
      <Text
        typo="body2"
        color="mono800"
        style={{
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={() => {
          setNotFoundInternal(true);
          setSearchResults([]);
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
            handleAddNewMember();
          }}
        >
          추가하기
        </CheckButton>
      </ButtonWrapper>
    </>
  );
};
export default AfterPartyMemberBottomSheet;

const CheckButton = styled(Button)({
  width: "100%",
  padding: "13.5px 0",
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
