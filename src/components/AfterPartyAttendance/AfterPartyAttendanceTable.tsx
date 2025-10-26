import styled from "@emotion/styled";
import { Text } from "../@common/Text";
import CheckIcon from "@/assets/check.svg?react";
import { EventParticipantDto } from "@/types/dtos/event";

interface AfterPartyAttendanceTableProps {
  afterPartyParticipants: EventParticipantDto[];
  isEditMode?: boolean;
  selectedIds: Set<number>;
  onSelectedIdsChange: (selectedIds: Set<number>) => void;
}

export default function AfterPartyAttendanceTable({
  isEditMode = false,
  afterPartyParticipants,
  selectedIds,
  onSelectedIdsChange,
}: AfterPartyAttendanceTableProps) {
  const handleToggle = (memberId: number) => {
    if (!isEditMode) {
      return;
    }

    const newSet = new Set(selectedIds);
    if (newSet.has(memberId)) {
      newSet.delete(memberId);
    } else {
      newSet.add(memberId);
    }
    onSelectedIdsChange(newSet);
  };

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
          const isSelected = selectedIds.has(participant.memberId);

          return (
            <ListItem
              key={participant.memberId}
              onClick={() => handleToggle(participant.memberId)}
              isSelected={isSelected && isEditMode}
              isClickable={isEditMode}
            >
              <Text style={{ flex: 1.2 }}>{participant.participant.studentId}</Text>
              <Text style={{ flex: 1 }}>{participant.participant.name}</Text>
              <Text style={{ flex: 1.5 }}>{participant.participant.phone}</Text>
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

const ListItem = styled.div<{ isSelected: boolean; isClickable: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 8px;
  gap: 16px;
  background-color: ${props => (props.isSelected ? "#f5f5f5" : "#ffffff")};
  border: 1px solid #f0f0f0;
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
