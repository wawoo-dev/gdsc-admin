import styled from "@emotion/styled";
import { color } from "wowds-tokens";
import CheckIcon from "@/assets/check.svg?react";
import { Text } from "@/components/@common/Text";

const MemberSelect = ({
  name,
  SID,
  onSelect,
  isSelected,
}: {
  name: string;
  SID: string;
  onSelect: () => void;
  isSelected: boolean;
}) => {
  const handleClick = () => {
    onSelect();
  };
  return (
    <MemberSelectWrapper onClick={handleClick}>
      <Inform>
        <Text typo="h3">{name}</Text>
        <Text typo="body1" color="mono700">
          {SID}
        </Text>
      </Inform>
      <CheckboxWrapper>
        <Checkbox isSelected={isSelected}>{isSelected && <CheckIcon />}</Checkbox>
      </CheckboxWrapper>
    </MemberSelectWrapper>
  );
};
export default MemberSelect;

const Inform = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const MemberSelectWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  padding: 24px 16px;
  cursor: pointer;
  gap: 8px;
  border: 1px solid #e0e0e0;
  &:hover {
    background-color: #f9f9f9;
  }
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
  border-radius: 20%;
  border: 2px solid ${props => (props.isSelected ? color.bluePressed : "#dddddd")};
  background-color: ${props => (props.isSelected ? color.bluePressed : "transparent")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
`;
