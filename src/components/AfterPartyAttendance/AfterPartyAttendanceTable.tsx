import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { color } from "wowds-tokens";
import { Text } from "../@common/Text";
import CheckIcon from "@/assets/check.svg?react";
import { EventParticipantDto } from "@/types/dtos/event";

interface AfterPartyAttendanceTableProps {
  afterPartyParticipants: EventParticipantDto[];
  isEditMode?: boolean;
  selectedIds: Set<number>;
  onSelectedIdsChange: (selectedIds: Set<number>) => void;
  searchName: string;
  handleNotFoundName: () => void;
}

export default function AfterPartyAttendanceTable({
  isEditMode = false,
  afterPartyParticipants,
  selectedIds,
  onSelectedIdsChange,
  searchName,
  handleNotFoundName,
}: AfterPartyAttendanceTableProps) {
  const handleToggle = (eventParticipationId: number) => {
    if (!isEditMode) {
      return;
    }

    const newSet = new Set(selectedIds);
    if (newSet.has(eventParticipationId)) {
      newSet.delete(eventParticipationId);
    } else {
      newSet.add(eventParticipationId);
    }
    onSelectedIdsChange(newSet);
  };
  const scrolledRef = useRef(false);

  useEffect(() => {
    // 검색어 바뀌면 다시 스크롤 허용
    scrolledRef.current = false;
  }, [searchName]);

  useEffect(() => {
    // 새 검색 결과가 렌더되면 다시 스크롤 허용
    scrolledRef.current = false;
  }, [afterPartyParticipants]);

  useEffect(() => {
    if (!searchName?.trim()) {
      return;
    }
    if (!afterPartyParticipants?.length) {
      return;
    }
    if (scrolledRef.current) {
      return;
    }

    // retry helper to wait until DOM paints the row
    const tryScrollIntoView = (targetId: string, attempts = 5) => {
      if (attempts <= 0) {
        return;
      }
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        scrolledRef.current = true; // mark success
      } else {
        requestAnimationFrame(() => tryScrollIntoView(targetId, attempts - 1));
      }
    };

    const term = searchName.trim().toLowerCase();
    const matches = afterPartyParticipants.filter(
      p => (p.participant?.name || "").toLowerCase() === term,
    );

    if (matches.length === 0) {
      handleNotFoundName();
      return;
    }

    const targetId = `afterparty-row-${matches[0].eventParticipationId}`;
    requestAnimationFrame(() => tryScrollIntoView(targetId));
  }, [searchName, afterPartyParticipants, handleNotFoundName]);

  return (
    <Container>
      <Header>
        <Text typo="body2" color="mono500" style={{ flex: 1.2 }}>
          학번
        </Text>
        <Text typo="body2" color="mono500" style={{ flex: 1 }}>
          이름
        </Text>
        <Text typo="body2" color="mono500" style={{ flex: 1.5 }}>
          전화번호 뒷자리
        </Text>
        <HeaderCount>
          <Text typo="body2" color="blue500">
            {selectedIds.size}
          </Text>
          <Text typo="body2" color="mono500">
            {`/${afterPartyParticipants.length}`}
          </Text>
        </HeaderCount>
      </Header>

      <List>
        {afterPartyParticipants.map(participant => {
          const isSelected = selectedIds.has(participant.eventParticipationId);

          return (
            <ListItem
              id={`afterparty-row-${participant.eventParticipationId}`} //스크롤 타깃
              key={participant.eventParticipationId}
              onClick={() => handleToggle(participant.eventParticipationId)}
              isSelected={isSelected && isEditMode}
              isClickable={isEditMode}
              isSearchTerm={
                !!searchName &&
                (participant.participant?.name || "").toLowerCase() === searchName.toLowerCase()
              }
            >
              <Text style={{ flex: 1.2, color: isSelected ? color.mono700 : "inherit" }}>
                {participant.participant?.studentId || `회원 ID: ${participant.memberId}`}
              </Text>
              <Text style={{ flex: 1, color: isSelected ? color.mono700 : "inherit" }}>
                {participant.participant?.name || "정보 없음"}
              </Text>
              <Text style={{ flex: 1.5, color: isSelected ? color.mono700 : "inherit" }}>
                {participant.participant?.phone ? participant.participant.phone.slice(-4) : "-"}
              </Text>
              {isEditMode ? (
                <CheckboxWrapper>
                  <Checkbox isSelected={isSelected}>{isSelected && <CheckIcon />}</Checkbox>
                </CheckboxWrapper>
              ) : (
                <StatusText isSelected={isSelected}>{isSelected ? "참석" : "미참석"}</StatusText>
              )}
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  margin: 16px auto;
  margin-bottom: 60px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 8px;
  gap: 16px;
  background-color: #ffffff;
`;

const HeaderCount = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
  min-width: 60px;
  justify-content: flex-end;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div<{ isSelected: boolean; isClickable: boolean; isSearchTerm: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 8px;
  gap: 16px;
  background-color: ${props => (props.isSelected ? "#f5f5f5" : "#ffffff")};
  border: ${props => (props.isSearchTerm ? "1px solid #2196f3" : "1px solid #f0f0f0")};
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: ${props => (props.isClickable ? "pointer" : "default")};
  transition: all 0.2s;
  &:hover {
    background-color: ${props => {
      if (!props.isClickable) {
        return props.isSelected ? "#f5f5f5" : "#ffffff";
      }
      return "#e3f2fd";
    }};
  }
`;

const StatusText = styled.div<{ isSelected: boolean }>`
  min-width: 60px;
  text-align: right;
  font-size: 14px;
  font-weight: 500;
  color: ${props => (props.isSelected ? "#2196f3" : "#999999")};
`;

const CheckboxWrapper = styled.div`
  min-width: 60px;
  display: flex;
  justify-content: flex-end;
  transition: opacity 0.3s ease-in-out;
`;

const Checkbox = styled.div<{ isSelected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${props => (props.isSelected ? "#2196f3" : "#dddddd")};
  background-color: ${props => (props.isSelected ? "#2196f3" : "transparent")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
`;
