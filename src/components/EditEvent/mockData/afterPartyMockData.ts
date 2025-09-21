// API 응답 타입 정의
export interface Participant {
  name: string;
  studentId: string;
  phone: string;
}

export interface AfterPartyParticipant {
  eventParticipationId: number;
  participant: Participant;
  memberId: number;
  mainEventApplicationStatus: "NOT_APPLIED" | "APPLIED";
  afterPartyApplicationStatus: "NONE" | "NOT_APPLIED" | "APPLIED";
  afterPartyAttendanceStatus: "NONE" | "NOT_ATTENDED" | "ATTENDED";
  prePaymentStatus: "NONE" | "NOT_PAID" | "PAID";
  postPaymentStatus: "NONE" | "NOT_PAID" | "PAID";
}

export interface AfterPartyData {
  applicants: {
    totalElements: number;
    totalPages: number;
    size: number;
    content: AfterPartyParticipant[];
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
  counts: {
    afterPartyAppliedCount: number;
    prePaymentPaidCount: number;
    afterPartyAttendedCount: number;
    postPaymentPaidCount: number;
  };
}

// Mock 데이터
export const mockAfterPartyData: AfterPartyData = {
  applicants: {
    totalElements: 12,
    totalPages: 1,
    size: 20,
    content: Array.from({ length: 12 }, (_, index) => ({
      eventParticipationId: index + 1,
      participant: {
        name: "장린",
        studentId: "(20)C046135",
        phone: "010-1234-5678",
      },
      memberId: index + 1,
      mainEventApplicationStatus: "APPLIED" as const,
      afterPartyApplicationStatus: "APPLIED" as const,
      afterPartyAttendanceStatus: "NOT_ATTENDED" as const,
      prePaymentStatus: index < 3 ? "PAID" : "NOT_PAID",
      postPaymentStatus: "NOT_PAID" as const,
    })),
    number: 0,
    numberOfElements: 12,
    first: true,
    last: true,
    empty: false,
  },
  counts: {
    afterPartyAppliedCount: 12,
    prePaymentPaidCount: 3,
    afterPartyAttendedCount: 0,
    postPaymentPaidCount: 0,
  },
};
