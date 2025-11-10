import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { color } from "wowds-tokens";
import { Text } from "@/components/@common/Text";

interface AfterPartyNotFoundInternalProps {
  searchTerm: string;
  searchName?: string;
  onCloseBottomSheet: () => void;
  handleAddNotFoundMember: () => void;
  phone: string;
  setPhone: (phone: string) => void;
  setStudentId: (studentId: string) => void;
}

const AfterPartyNotFoundInternal = ({
  searchTerm,
  searchName,
  onCloseBottomSheet,
  handleAddNotFoundMember,
  phone,
  setPhone,
  setStudentId,
}: AfterPartyNotFoundInternalProps) => {
  return (
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
          <Text typo="h2" color="primary" style={{ display: "flex", alignItems: "center" }}>
            {searchName ? `${searchName} ` : `${searchTerm}`}{" "}
            <Text typo="h2">이름의 학생이 어드민에 없어요</Text>
          </Text>
          <Text typo="h2">뒤풀이 참석자에 새로 추가하시겠어요?</Text>
        </div>

        <MemberInputWrapper>
          <Text typo="h3" color="mono600" style={{ display: "flex", alignItems: "center" }}>
            전화번호<Text color="primary">*</Text>
          </Text>
          <MemberInput
            type="text"
            placeholder="전화번호를 입력하세요"
            onChange={e => setPhone(e.target.value)}
          />
        </MemberInputWrapper>
        <MemberInputWrapper>
          <Text typo="h3" color="mono600" style={{ display: "flex", alignItems: "center" }}>
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
  );
};

export default AfterPartyNotFoundInternal;

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
