import { useMemo, useState } from "react";
import { Modal } from "@mui/material";
import { useParams } from "react-router-dom";
import { color } from "wowds-tokens";
import Box from "wowds-ui/Box";
import Button from "wowds-ui/Button";
import DropDown from "wowds-ui/DropDown";
import DropDownOption from "wowds-ui/DropDownOption";
import SearchBar from "wowds-ui/SearchBar";
import Table from "wowds-ui/Table";
import TextField from "wowds-ui/TextField";
import { Flex } from "../@common/Flex";
import { Space } from "../@common/Space";
import { Text } from "../@common/Text";
import { AddMemberModal } from "./Modal/AddMemberModal";
import { mockEventParticipantsResponse } from "@/constants/mockData";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useGetEventParticipants } from "@/hooks/queries/useGetAllParticipants";
import { AfterPartyApplicationStatus, ParticipantRole } from "@/types/dtos/event";
import { isDigitStart, onlyDigits, isEnglishStart, isKoreanStart } from "@/utils/searchQuery";

export function toParticipantRoleLabel(role: ParticipantRole): string {
  switch (role) {
    case "NON_MEMBER":
      return "비회원";
    case "GUEST":
      return "게스트";
    case "ASSOCIATE":
      return "준회원";
    case "REGULAR":
      return "정회원";
    default:
      return "-";
  }
}

export function toAfterPartyStatusLabel(status: AfterPartyApplicationStatus): string {
  switch (status) {
    case "NONE":
      return "해당 없음";
    case "NOT_APPLIED":
      return "X";
    case "APPLIED":
      return "O";
    default:
      return "-";
  }
}

export const ApplyMember = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const id = Number(eventId);

  const [sortKey, setSortKey] = useState("");
  //const { data: appliedStudent } = useGetEventParticipants(id, 0, 20, sortKey);
  const data = mockEventParticipantsResponse.content;
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const handleSelectionChange = (rows: number[]) => setSelectedRows(rows);

  const showAfterParty = data.some(d => d.afterPartyApplicationStatus !== "NONE");

  const [searchedValue, setSearchedValue] = useState("");
  const [open, setOpen] = useState(false);

  const debouncedQuery = useDebounce(searchedValue, 300); // 300ms 디바운스
  const filtered = useMemo(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      return data;
    }

    if (isDigitStart(q)) {
      // 전화번호: 숫자만 비교
      const qDigits = onlyDigits(q);
      return data.filter(row => onlyDigits(row.participant.phone).includes(qDigits));
    }

    if (isEnglishStart(q)) {
      // 학번(studentId): 대소문자 무시 포함 검색
      const qLower = q.toLowerCase();
      return data.filter(row => row.participant.studentId.toLowerCase().includes(qLower));
    }

    if (isKoreanStart(q)) {
      // 이름: 포함 검색
      return data.filter(row => row.participant.name.includes(q));
    }

    // 기타 문자는 전체 반환(원하면 여기서 추가 규칙 가능)
    return data;
  }, [data, debouncedQuery]);

  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>
        인원 추가
      </Button>
      <AddMemberModal open={open} setOpen={setOpen} />
      <Flex gap="sm">
        <SearchBar
          placeholder="이름,학번,학과,전화번호로 검색"
          style={{ flex: 1 }}
          value={searchedValue}
          onChange={setSearchedValue}
        />
        <DropDown
          placeholder="정렬"
          style={{ flex: "auto" }}
          value={sortKey}
          onChange={({ selectedValue }) => setSortKey(selectedValue)}
        >
          <DropDownOption value="recent" text="최신순" />
          <DropDownOption value="name" text="이름순" />
        </DropDown>
      </Flex>

      <Space height={30} />
      <Table
        selectedRowsProp={selectedRows}
        showCheckbox
        onChange={handleSelectionChange}
        fullWidth
      >
        <Table.Thead>
          <Table.Th>이름</Table.Th>
          <Table.Th>학번</Table.Th>
          <Table.Th>전화번호</Table.Th>
          {showAfterParty && <Table.Th>뒤풀이 신청</Table.Th>}
          <Table.Th>회원 유형</Table.Th>
          <Table.Th>디코 사용자명</Table.Th>
          <Table.Th>디코 닉네임</Table.Th>
        </Table.Thead>

        <Table.Tbody style={{ width: "100%" }}>
          {filtered.map(
            ({
              participant,
              afterPartyApplicationStatus,
              participantRole,
              discordUsername,
              nickname,
              eventParticipationId,
            }) => {
              const isNonRegular = participantRole !== "REGULAR";

              // ✅ 공통 셀 스타일 생성기: 필요 시 추가 스타일을 합쳐서 사용
              const cellStyle = (extra?: React.CSSProperties) => ({
                ...(isNonRegular ? { backgroundColor: "#FFF0F0" } : {}),
                ...(extra ?? {}),
              });

              return (
                <Table.Tr key={eventParticipationId} value={Number(eventParticipationId)}>
                  <Table.Td style={cellStyle()}>{participant.name}</Table.Td>
                  <Table.Td style={cellStyle()}>{participant.studentId}</Table.Td>
                  <Table.Td style={cellStyle()}>{participant.phone}</Table.Td>

                  {showAfterParty && (
                    <Table.Td style={cellStyle()}>
                      {toAfterPartyStatusLabel(afterPartyApplicationStatus)}
                    </Table.Td>
                  )}

                  {/* 회원 유형: 비정회원이면 텍스트 빨강 */}
                  <Table.Td style={cellStyle(isNonRegular ? { color: color.error } : undefined)}>
                    {toParticipantRoleLabel(participantRole)}
                  </Table.Td>

                  {/* 서브톤 텍스트 두 칸 */}
                  <Table.Td style={cellStyle({ color: color.sub })}>{discordUsername}</Table.Td>
                  <Table.Td style={cellStyle({ color: color.sub })}>{nickname}</Table.Td>
                </Table.Tr>
              );
            },
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
};
