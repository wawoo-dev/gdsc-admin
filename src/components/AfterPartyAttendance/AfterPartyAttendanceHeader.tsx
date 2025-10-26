import { styled } from "@mui/material";
import { Button } from "@mui/material";
import { Text } from "../@common/Text";
import LogoIcon from "@/assets/logo.svg?react";

interface AfterPartyAttendanceHeaderProps {
  headerTitle?: string;
  onEditClick?: () => void;
}

export default function AfterPartyAttendanceHeader({
  headerTitle,
  onEditClick,
}: AfterPartyAttendanceHeaderProps) {
  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    }
  };

  return (
    <StyledHeaderWrapper>
      <StyledTitleSection>
        <LogoIcon width={49} height={24} />
        <Text typo="h3">{headerTitle}</Text>
      </StyledTitleSection>
      <StyledButton variant="contained" onClick={handleEditClick}>
        수정
      </StyledButton>
    </StyledHeaderWrapper>
  );
}

const StyledHeaderWrapper = styled("header")({
  display: "flex",
  padding: "16px",
  alignItems: "center",
  justifyContent: "space-between",
});

const StyledTitleSection = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

const StyledButton = styled(Button)({
  padding: "6px 12px",
  minWidth: "49px",
  height: "30px",
  fontFamily: "SUIT v1",
  fontWeight: 600,
});
