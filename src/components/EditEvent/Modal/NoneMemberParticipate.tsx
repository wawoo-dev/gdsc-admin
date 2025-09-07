import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "wowds-ui/Button";
import TextField from "wowds-ui/TextField";
import { Text } from "@/components/@common/Text";
import usePostNoneMemberParticipantsMutation from "@/hooks/mutations/usePostNoneMemberParticipantsMutation";

export const NoneMemberParticipate = ({ handleBack }: { handleBack: () => void }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // eventId를 숫자로 변환
  const eventIdNumber = eventId ? parseInt(eventId, 10) : 0;

  const postNoneMemberParticipantsMutation = usePostNoneMemberParticipantsMutation();

  const handleSubmit = async () => {
    if (studentId.trim() === "" || name.trim() === "" || phone.trim() === "") {
      alert("학번, 이름, 전화번호를 모두 입력해주세요.");
      return;
    }

    try {
      await postNoneMemberParticipantsMutation.mutateAsync({
        eventId: eventIdNumber,
        participant: {
          name: name.trim(),
          studentId: studentId.trim(),
          phone: phone.trim(),
        },
      });

      // 성공 시 입력값 초기화
      setStudentId("");
      setName("");
      setPhone("");
      alert("비회원 참가자가 성공적으로 등록되었습니다.");
    } catch (error) {
      console.error("비회원 참가자 등록 중 오류 발생:", error);
      alert("등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleReset = () => {
    handleBack();
    setStudentId("");
    setName("");
    setPhone("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px" }}>
      <Text typo="h2">비회원 참가자 정보 입력</Text>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <TextField placeholder="C123456" label="학번" value={studentId} onChange={setStudentId} />
        <TextField placeholder="김홍익" label="이름" value={name} onChange={setName} />
        <TextField placeholder="010-1234-5678" label="전화번호" value={phone} onChange={setPhone} />
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={handleReset}>
          뒤로가기
        </Button>
        <Button
          disabled={
            studentId.trim() === "" ||
            name.trim() === "" ||
            phone.trim() === "" ||
            postNoneMemberParticipantsMutation.isPending
          }
          onClick={handleSubmit}
        >
          {postNoneMemberParticipantsMutation.isPending ? "등록 중..." : "등록하기"}
        </Button>
      </div>
    </div>
  );
};
