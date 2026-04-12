import { Space } from "@/components/@common/Space";
import { AfterPartyManagement } from "@/components/EditEvent/AfterPartyManagement";
import { ApplyMember } from "@/components/EditEvent/ApplyMembers";
import { EventForm } from "@/components/EditEvent/EventForm";
import { EventInformation } from "@/components/EditEvent/EventInformation";
import { useGetEvent } from "@/hooks/queries/useGetEvent";
import { EventType } from "@/types/dtos/event";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const EditEventPage = () => {
  const { eventId: eventIdParam } = useParams<{ eventId?: string }>();
  const isNew = eventIdParam === "new";
  const id = !isNew && eventIdParam ? Number(eventIdParam) : null;

  const { data: eventData, isLoading, error } = useGetEvent(id ?? null);
  const [formValues, setformValues] = useState<EventType | null>(null);
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3">("tab1");

  useEffect(() => {
    if (isNew || id === null) {
      const initialEventData: EventType = {
        eventId: -1,
        name: "",
        venue: "추후 공지 예정",
        startAt: "",
        description: "",
        applicationPeriod: {
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
        },
        regularRoleOnlyStatus: "ENABLED",
        afterPartyStatus: "ENABLED",
        prePaymentStatus: "ENABLED",
        postPaymentStatus: "ENABLED",
        rsvpQuestionStatus: "ENABLED",
        noticeConfirmQuestionStatus: "ENABLED",
        mainEventMaxApplicantCount: null,
        afterPartyMaxApplicantCount: null,
      };
      setformValues(initialEventData);
    } else if (eventData) {
      setformValues(eventData.eventData);
    }
  }, [id, isNew, eventData]);

  if (isLoading) {
    return <div>이벤트 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div>이벤트 정보를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <>
      <EventInformation
        formValue={formValues}
        setFormValues={setformValues}
        eventId={id || undefined}
        currentApplicantCount={eventData?.currentApplicantCount || 0}
      />

      {eventIdParam !== "new" && (
        <>
          <Space height={54} />
          {/* wowds-ui의 Tab에 렌더링 문제가 있어 프로젝트에서 구현한 탭으로 대체 */}
          <TabContainer>
            <TabButton isActive={activeTab === "tab1"} onClick={() => setActiveTab("tab1")}>
              행사 신청 폼
            </TabButton>
            <TabButton isActive={activeTab === "tab2"} onClick={() => setActiveTab("tab2")}>
              신청 인원
            </TabButton>
            <TabButton isActive={activeTab === "tab3"} onClick={() => setActiveTab("tab3")}>
              뒤풀이 인원
            </TabButton>
          </TabContainer>

          <TabContent isActive={activeTab === "tab1"}>
            <EventForm
              formValue={formValues}
              setFormValues={setformValues}
              eventId={id || undefined}
              currentApplicantCount={eventData?.currentApplicantCount || 0}
            />
          </TabContent>
          <TabContent isActive={activeTab === "tab2"}>
            <ApplyMember title={formValues?.name || ""} />
          </TabContent>
          <TabContent isActive={activeTab === "tab3"}>
            <AfterPartyManagement afterPartyEnabled={formValues?.afterPartyStatus === "ENABLED"} />
          </TabContent>
        </>
      )}
    </>
  );
};

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 12px 24px;
  border: none;
  background: none;
  border-bottom: ${({ isActive }) => (isActive ? "2px solid #1976d2" : "2px solid transparent")};
  color: ${({ isActive }) => (isActive ? "#1976d2" : "#666")};
  font-weight: ${({ isActive }) => (isActive ? "600" : "400")};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #1976d2;
  }
`;

const TabContent = styled.div<{ isActive: boolean }>`
  display: ${({ isActive }) => (isActive ? "block" : "none")};
`;
