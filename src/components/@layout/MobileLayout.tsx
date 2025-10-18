import { ReactNode } from "react";
import { Stack, styled } from "@mui/material";

interface MobileLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

export default function MobileLayout({ header, children }: MobileLayoutProps) {
  return (
    <StyledLayoutWrapper>
      <StyledHeaderWrapper>{header}</StyledHeaderWrapper>
      <StyledBodyWrapper>{children}</StyledBodyWrapper>
    </StyledLayoutWrapper>
  );
}

const StyledLayoutWrapper = styled(Stack)({
  minHeight: "100vh",
  flexDirection: "column",
  position: "relative",
  width: "100%",
});

const StyledHeaderWrapper = styled("header")({
  "position": "sticky",
  "top": 0,
  "zIndex": 100,
  "backgroundColor": "#ffffff",
  "width": "100%",
  "maxWidth": "768px",
  "margin": "0 auto",
  "@media (min-width: 768px)": {
    maxWidth: "768px",
  },
});

const StyledBodyWrapper = styled(Stack)({
  "flex": 1,
  "width": "100%",
  "maxWidth": "768px",
  "margin": "0 auto",
  "padding": "16px",
  "overflow": "auto",
  "@media (min-width: 768px)": {
    maxWidth: "768px",
  },
});
