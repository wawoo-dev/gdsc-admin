import { useState, useMemo } from "react";
import { css } from "@emotion/react";
import { color, space } from "wowds-tokens";
import Checkbox from "wowds-ui/Checkbox";
import Table from "wowds-ui/Table";
import { Flex } from "../@common/Flex";
import { Space } from "../@common/Space";
import { Text } from "../@common/Text";
import { mockAfterPartyData, type AfterPartyData } from "./mockData/afterPartyMockData";

export const AfterPartyManagement = () => {
  const [data, setData] = useState<AfterPartyData>(mockAfterPartyData);

  const participants = data.applicants.content;
  const counts = data.counts;

  // 통계 계산
  const stats = useMemo(() => {
    const total = participants.length;
    const prePaymentCount = counts.prePaymentPaidCount;
    const afterPartyCount = counts.afterPartyAttendedCount;
    const settlementCount = counts.postPaymentPaidCount;

    return {
      total,
      prePayment: { count: prePaymentCount, total },
      afterParty: { count: afterPartyCount, total },
      settlement: { count: settlementCount, total },
    };
  }, [participants, counts]);

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (
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

  // 전체 선택/해제 핸들러
  const handleSelectAll = (field: "prePayment" | "afterPartyAttendance" | "postPayment") => {
    const allChecked = participants.every(p => {
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

    setData(prev => ({
      ...prev,
      applicants: {
        ...prev.applicants,
        content: prev.applicants.content.map(p => {
          switch (field) {
            case "prePayment":
              return { ...p, prePaymentStatus: allChecked ? "NOT_PAID" : "PAID" };
            case "afterPartyAttendance":
              return { ...p, afterPartyAttendanceStatus: allChecked ? "NOT_ATTENDED" : "ATTENDED" };
            case "postPayment":
              return { ...p, postPaymentStatus: allChecked ? "NOT_PAID" : "PAID" };
            default:
              return p;
          }
        }),
      },
    }));
  };

  return (
    <div
      css={css({
        backgroundColor: color.backgroundAlternative,
        padding: "30px",
        borderRadius: space.md,
        marginTop: "30px",
      })}
    >
      <Text typo="h2">뒤풀이 관리</Text>
      <Space height="lg" />

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
          {participants.map(participant => (
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
