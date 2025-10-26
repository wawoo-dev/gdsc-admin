import { useState } from "react";
import MobileLayout from "@/components/@layout/MobileLayout";
import AfterPartyAttendanceHeader from "@/components/AfterPartyAttendance/AfterPartyAttendanceHeader";
import AfterPartyAttendanceSummary from "@/components/AfterPartyAttendance/AfterPartyAttendanceSummary";
import AfterPartyAttendanceTable from "@/components/AfterPartyAttendance/AfterPartyAttendanceTable";

export default function AfterPartyAttendancePage() {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <MobileLayout
      header={
        <AfterPartyAttendanceHeader
          headerTitle="25학년도 2학기 개강총회"
          onEditClick={() => {
            setIsEditMode(prev => !prev);
          }}
        />
      }
    >
      <AfterPartyAttendanceSummary
        totalCount={123}
        applyedAndAttendedCount={123}
        applyedAndNotAttendedCount={123}
        onSiteApplyedCount={123}
      />
      <AfterPartyAttendanceTable isEditMode={isEditMode} />
    </MobileLayout>
  );
}
