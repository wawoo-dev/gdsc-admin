import { ReactNode } from "react";
import { Stack, styled } from "@mui/material";

interface MobileLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

/**
 * 모바일 레이아웃 컴포넌트
 *
 * 최대 너비를 768px로 제한하여 대부분의 모바일 기기에 적합한 레이아웃을 제공
 *
 * @param props - 컴포넌트 props
 * @param props.header - 상단에 표시될 헤더 컴포넌트 (선택사항)
 * @param props.children - 본문에 표시될 자식 컴포넌트
 *
 * @returns 모바일 최적화된 레이아웃 컴포넌트
 *
 * @example
 * ```tsx
 * <MobileLayout header={<Header />}>
 *   <MainContent />
 * </MobileLayout>
 * ```
 */
export default function MobileLayout({ header, children }: MobileLayoutProps) {
  return (
    <StyledLayoutWrapper>
      <StyledHeaderWrapper>{header}</StyledHeaderWrapper>
      <StyledBodyWrapper>{children}</StyledBodyWrapper>
    </StyledLayoutWrapper>
  );
}

// 전체 레이아웃 구성
const StyledLayoutWrapper = styled(Stack)({
  minHeight: "100vh",
  flexDirection: "column",
  position: "relative",
  width: "100%",
});

// 상단 고정 헤더 영역
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

// 본문 영역
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
