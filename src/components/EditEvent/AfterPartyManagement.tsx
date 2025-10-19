import { useState, useMemo, useEffect } from "react";
import { css } from "@emotion/react";
import { useParams } from "react-router-dom";
import Checkbox from "wowds-ui/Checkbox";
import DropDown from "wowds-ui/DropDown";
import DropDownOption from "wowds-ui/DropDownOption";
import SearchBar from "wowds-ui/SearchBar";
import Table from "wowds-ui/Table";
import { Flex } from "../@common/Flex";
import { Space } from "../@common/Space";
import { Text } from "../@common/Text";
import { mockAfterPartyData, type AfterPartyData } from "./mockData/afterPartyMockData";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useUpdateAfterPartyStatusMutation } from "@/hooks/mutations/useUpdateAfterPartyStatusMutation";
import { useGetAfterPartyApplicants } from "@/hooks/queries/useGetAfterPartyApplicants";
import { isDigitStart, onlyDigits, isEnglishStart, isKoreanStart } from "@/utils/searchQuery";

export const AfterPartyManagement = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const id = Number(eventId);

  const [searchedValue, setSearchedValue] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [data, setData] = useState<AfterPartyData>(mockAfterPartyData);

  const { data: apiData, isLoading, error } = useGetAfterPartyApplicants(id);

  // 로컬 상태 업데이트를 위한 onSuccess 콜백
  const handleLocalStateUpdate = (
    participantId: number,
    field: "prePayment" | "afterPartyAttendance" | "postPayment",
  ) => {
    setData(prev => ({
      ...prev,
      applicants: {
        ...prev.applicants,
        content: prev.applicants.content.map(p => {
          if (p.eventParticipationId === participantId) {
            switch (field) {
              case "prePayment":
                return {
                  ...p,
                  prePaymentStatus: p.prePaymentStatus === "PAID" ? "NOT_PAID" : "PAID",
                };
              case "afterPartyAttendance":
                return {
                  ...p,
                  afterPartyAttendanceStatus:
                    p.afterPartyAttendanceStatus === "ATTENDED" ? "NOT_ATTENDED" : "ATTENDED",
                };
              case "postPayment":
                return {
                  ...p,
                  postPaymentStatus: p.postPaymentStatus === "PAID" ? "NOT_PAID" : "PAID",
                };
              default:
                return p;
            }
          }
          return p;
        }),
      },
    }));
  };

  const updateAfterPartyStatusMutation = useUpdateAfterPartyStatusMutation();

  // API 데이터가 로드되면 로컬 상태 업데이트
  useEffect(() => {
    // if (apiData) {
    //   setData(apiData);
    // }
  }, [apiData]);

  const participants = data.applicants.content;

  const debouncedQuery = useDebounce(searchedValue, 300); // 300ms 디바운스

  // 필터링된 참가자 목록
  const filteredParticipants = useMemo(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      return participants;
    }

    if (isDigitStart(q)) {
      // 전화번호: 숫자만 비교
      const qDigits = onlyDigits(q);
      return participants.filter(participant =>
        onlyDigits(participant.participant.phone)?.includes(qDigits),
      );
    }

    if (isEnglishStart(q)) {
      // 학번(studentId): 대소문자 무시 포함 검색
      const qLower = q.toLowerCase();
      return participants.filter(participant =>
        participant.participant.studentId?.toLowerCase()?.includes(qLower),
      );
    }

    if (isKoreanStart(q)) {
      // 이름: 포함 검색
      return participants.filter(participant => participant.participant.name?.includes(q));
    }

    // 기타 문자는 전체 반환
    return participants;
  }, [participants, debouncedQuery]);

  // 정렬된 참가자 목록
  const sortedParticipants = useMemo(() => {
    if (!sortKey) {
      return filteredParticipants;
    }

    return [...filteredParticipants].sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.participant.name.localeCompare(b.participant.name);
        case "createdAt":
          // eventParticipationId를 기준으로 정렬 (높은 ID가 최신)
          return b.eventParticipationId - a.eventParticipationId;
        default:
          return 0;
      }
    });
  }, [filteredParticipants, sortKey]);

  // 통계 계산
  const stats = useMemo(() => {
    const total = sortedParticipants.length;
    const prePaymentCount = sortedParticipants.filter(p => p.prePaymentStatus === "PAID").length;
    const afterPartyCount = sortedParticipants.filter(
      p => p.afterPartyAttendanceStatus === "ATTENDED",
    ).length;
    const settlementCount = sortedParticipants.filter(p => p.postPaymentStatus === "PAID").length;

    return {
      total,
      prePayment: { count: prePaymentCount, total },
      afterParty: { count: afterPartyCount, total },
      settlement: { count: settlementCount, total },
    };
  }, [sortedParticipants]);

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (
    participantId: number,
    field: "prePayment" | "afterPartyAttendance" | "postPayment",
  ) => {
    // API 호출을 위한 타겟 매핑
    const targetMap = {
      prePayment: "PRE_PAYMENT" as const,
      afterPartyAttendance: "ATTENDANCE" as const,
      postPayment: "POST_PAYMENT" as const,
    };

    // 현재 상태 확인
    const participant = participants.find(p => p.eventParticipationId === participantId);
    if (!participant) {
      return;
    }

    let isChecked = false;
    switch (field) {
      case "prePayment":
        isChecked = participant.prePaymentStatus === "PAID";
        break;
      case "afterPartyAttendance":
        isChecked = participant.afterPartyAttendanceStatus === "ATTENDED";
        break;
      case "postPayment":
        isChecked = participant.postPaymentStatus === "PAID";
        break;
    }

    updateAfterPartyStatusMutation.mutate({
      eventParticipationId: participantId,
      afterPartyUpdateTarget: targetMap[field],
      isChecked: !isChecked, // 현재 상태의 반대로 설정
      onSuccess: () => {
        handleLocalStateUpdate(participantId, field);
      },
    });
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = (field: "prePayment" | "afterPartyAttendance" | "postPayment") => {
    const allChecked = sortedParticipants.every(p => {
      switch (field) {
        case "prePayment":
          return p.prePaymentStatus === "PAID";
        case "afterPartyAttendance":
          return p.afterPartyAttendanceStatus === "ATTENDED";
        case "postPayment":
          return p.postPaymentStatus === "PAID";
        default:
          return false;
      }
    });

    // API 호출을 위한 타겟 매핑
    const targetMap = {
      prePayment: "PRE_PAYMENT" as const,
      afterPartyAttendance: "ATTENDANCE" as const,
      postPayment: "POST_PAYMENT" as const,
    };

    // 각 참가자에 대해 API 호출 (성공 시 onSuccess에서 로컬 상태 업데이트)
    sortedParticipants.forEach(participant => {
      updateAfterPartyStatusMutation.mutate({
        eventParticipationId: participant.eventParticipationId,
        afterPartyUpdateTarget: targetMap[field],
        isChecked: !allChecked, // 전체 선택/해제 상태에 따라 설정
        onSuccess: () => {
          handleLocalStateUpdate(participant.eventParticipationId, field);
        },
      });
    });
  };

  if (isLoading) {
    return (
      <div css={css({ padding: "30px", textAlign: "center" })}>
        <Text typo="body1">로딩 중...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div css={css({ padding: "30px", textAlign: "center" })}>
        <Text typo="body1" color="error">
          데이터를 불러오는 중 오류가 발생했습니다.
        </Text>
      </div>
    );
  }

  return (
    <div
      css={css({
        marginTop: "30px",
      })}
    >
      <Space height="lg" />

      {/* 뒤풀이 신청 인원 수 표시 */}
      <Flex justify="space-between">
        <Text typo="h2">
          뒤풀이 신청 인원{" "}
          <Text as="span" color="primary" typo="h2">
            {sortedParticipants.length}명
          </Text>
        </Text>
      </Flex>

      <Space height={30} />

      {/* 검색 및 정렬 필터 */}
      <Flex gap="sm">
        <SearchBar
          placeholder="이름, 학번, 전화번호로 검색"
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
          <DropDownOption value="createdAt" text="최신순" />
          <DropDownOption value="name" text="이름순" />
        </DropDown>
      </Flex>

      <Space height={30} />

      <Table fullWidth>
        <Table.Thead>
          <Table.Th>이름</Table.Th>
          <Table.Th>학번</Table.Th>
          <Table.Th>전화번호</Table.Th>
          <Table.Th>
            <Flex align="center" gap="sm">
              <Text typo="body1">선입금 납부</Text>
              <Text typo="body2" color="primary">
                {stats.prePayment.count}/{stats.prePayment.total}
              </Text>
              <Checkbox
                checked={
                  stats.prePayment.count === stats.prePayment.total && stats.prePayment.count > 0
                }
                onChange={() => handleSelectAll("prePayment")}
              />
            </Flex>
          </Table.Th>
          <Table.Th>
            <Flex align="center" gap="sm">
              <Text typo="body1">뒤풀이 참여</Text>
              <Text typo="body2" color="primary">
                {stats.afterParty.count}/{stats.afterParty.total}
              </Text>
              <Checkbox
                checked={
                  stats.afterParty.count === stats.afterParty.total && stats.afterParty.count > 0
                }
                onChange={() => handleSelectAll("afterPartyAttendance")}
              />
            </Flex>
          </Table.Th>
          <Table.Th>
            <Flex align="center" gap="sm">
              <Text typo="body1">정산 확인</Text>
              <Text typo="body2" color="primary">
                {stats.settlement.count}/{stats.settlement.total}
              </Text>
              <Checkbox
                checked={
                  stats.settlement.count === stats.settlement.total && stats.settlement.count > 0
                }
                onChange={() => handleSelectAll("postPayment")}
              />
            </Flex>
          </Table.Th>
        </Table.Thead>

        <Table.Tbody>
          {sortedParticipants.map(participant => (
            <Table.Tr
              key={participant.eventParticipationId}
              value={participant.eventParticipationId}
            >
              <Table.Td>{participant.participant.name}</Table.Td>
              <Table.Td>{participant.participant.studentId}</Table.Td>
              <Table.Td>{participant.participant.phone}</Table.Td>
              <Table.Td>
                <Checkbox
                  checked={participant.prePaymentStatus === "PAID"}
                  onChange={() =>
                    handleCheckboxChange(participant.eventParticipationId, "prePayment")
                  }
                />
              </Table.Td>
              <Table.Td>
                <Checkbox
                  checked={participant.afterPartyAttendanceStatus === "ATTENDED"}
                  onChange={() =>
                    handleCheckboxChange(participant.eventParticipationId, "afterPartyAttendance")
                  }
                />
              </Table.Td>
              <Table.Td>
                <Checkbox
                  checked={participant.postPaymentStatus === "PAID"}
                  onChange={() =>
                    handleCheckboxChange(participant.eventParticipationId, "postPayment")
                  }
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};
