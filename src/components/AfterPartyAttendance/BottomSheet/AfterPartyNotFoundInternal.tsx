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
  studentId: string;
  setPhone: (phone: string) => void;
  setStudentId: (studentId: string) => void;
  invalidMessage?: string;
}

const AfterPartyNotFoundInternal = ({
  searchTerm,
  searchName,
  onCloseBottomSheet,
  handleAddNotFoundMember,
  phone,
  setPhone,
  setStudentId,
  invalidMessage,
}: AfterPartyNotFoundInternalProps) => {
  const handleSIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();

    // 문자 + 숫자만 통과
    val = val.replace(/[^A-Za-z0-9]/g, "");

    // 7자리 제한
    val = val.slice(0, 7);

    setStudentId(val);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // 숫자만 통과
    val = val.replace(/[^0-9]/g, "");
    // 11자리 제한
    val = val.slice(0, 11);

    setPhone(val);
  };

  const formattedPhoneUI = (phone: string) => {
    // 전화번호를 000-0000-0000 형식으로 변환
    if (phone.length === 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (phone.length === 11) {
      return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    return phone;
  };

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
            type="phone"
            placeholder="전화번호를 입력하세요"
            onChange={handlePhoneChange}
            maxLength={13}
            value={formattedPhoneUI(phone)}
          />
        </MemberInputWrapper>
        <MemberInputWrapper>
          <Text typo="h3" color="mono600" style={{ display: "flex", alignItems: "center" }}>
            학번
          </Text>
          <MemberInput
            type="text"
            placeholder="학번을 입력하세요"
            onChange={handleSIDChange}
            maxLength={7}
          />
        </MemberInputWrapper>
      </NotFoundWrapper>
      <WarningText>{invalidMessage}</WarningText>

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
const WarningText = styled("div")({
  color: color.error,
  fontSize: "12px",
  marginTop: "4px",
  height: "16px",
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
