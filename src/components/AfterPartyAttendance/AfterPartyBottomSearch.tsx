import { styled } from "@mui/material";
import UserPlus from "@/assets/user-plus.svg?react";

export default function AfterPartyBottomSearch({
  handleParticipantAdded,
}: {
  handleParticipantAdded: () => void;
}) {
  return (
    <BottomSheetWrapper onClick={e => e.stopPropagation()}>
      <input type="text" placeholder="참가자 검색" />
      <UserPlus onClick={handleParticipantAdded} />
    </BottomSheetWrapper>
  );
}

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
  boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  padding: "12px 20px",
  zIndex: 10,
  maxWidth: "768px",
  margin: "0 auto",
});
