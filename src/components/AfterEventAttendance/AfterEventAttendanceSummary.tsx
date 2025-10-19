import { styled } from "@mui/material";
import { Text } from "../@common/Text";

interface AttendanceStatusCellProps {
  title: string;
  value: number;
}

function AttendanceStatusCell({ title, value }: AttendanceStatusCellProps) {
  return (
    <StyledContent>
      <Text typo="body2" color="mono700">
        {title}
      </Text>
      <Text typo="h2">{value}명</Text>
    </StyledContent>
  );
}

const StyledContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  minWidth: "100px",
  margin: "auto",
});

interface AfterEventAttendanceSummaryProps {
  totalCount?: number;
  applyedAndAttendedCount?: number;
  applyedAndNotAttendedCount?: number;
  onSiteApplyedCount?: number;
}

export default function AfterEventAttendanceSummary({
  totalCount,
  applyedAndAttendedCount,
  applyedAndNotAttendedCount,
  onSiteApplyedCount,
}: AfterEventAttendanceSummaryProps) {
  return (
    <StyledContainer>
      <StyledTitleSection>
        <Text typo="body2" color="mono700">
          총 뒤풀이 참석 인원
        </Text>
        <Text typo="h1" color="blue500">
          {totalCount ?? 0}명
        </Text>
      </StyledTitleSection>
      <StyledContentSection>
        <AttendanceStatusCell title="신청 후 참석" value={applyedAndAttendedCount ?? 0} />
        <StyledDivider />
        <AttendanceStatusCell title="신청 후 미참석" value={applyedAndNotAttendedCount ?? 0} />
        <StyledDivider />
        <AttendanceStatusCell title="현장 신청" value={onSiteApplyedCount ?? 0} />
      </StyledContentSection>
    </StyledContainer>
  );
}

const StyledContainer = styled("header")({
  display: "flex",
  flexDirection: "column",
  borderRadius: "6px",
  border: "1px solid #E1E1E1",
  alignItems: "center",
});

const StyledTitleSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2px",
  paddingTop: "20px",
});

const StyledContentSection = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "stretch",
  marginTop: "28px",
  marginBottom: "12px",
  marginLeft: "11.5px",
  marginRight: "11.5px",
  overflowX: "auto",
});

const StyledDivider = styled("div")({
  width: "1px",
  backgroundColor: "#E1E1E1",
  alignSelf: "stretch",
});
