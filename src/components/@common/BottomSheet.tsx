import { styled } from "@mui/material";
import XIcon from "@/assets/x.svg?react";

export default function BottomSheet({
  children,
  onCloseBottomSheet,
}: {
  children: React.ReactNode;
  onCloseBottomSheet: () => void;
}) {
  return (
    <OverLay onClick={onCloseBottomSheet}>
      <BottomSheetWrapper onClick={e => e.stopPropagation()}>
        <Header>
          <XIcon onClick={onCloseBottomSheet} />
        </Header>
        <Body>{children}</Body>
      </BottomSheetWrapper>
    </OverLay>
  );
}

const BottomSheetWrapper = styled("div")({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  padding: "12px 20px",
  zIndex: 1000,
  maxWidth: "768px",
  margin: "0 auto",
});

const OverLay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 999,
});

const Header = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  paddingBottom: "8px",
});

const Body = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "auto",
  gap: "28px",
});
