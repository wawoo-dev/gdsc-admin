import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { useParams } from "react-router-dom";
import { color } from "wowds-tokens";
import Button from "wowds-ui/Button";
import Checkbox from "wowds-ui/Checkbox";
import TextField from "wowds-ui/TextField";
import { NoneMemberParticipate } from "./NoneMemberParticipate";
import X from "@/assets/x.svg?react";
import { Space } from "@/components/@common/Space";
import { Text } from "@/components/@common/Text";
import usePostNoneMemberParticipantsMutation from "@/hooks/mutations/usePostMemberParticipants";
import { useGetSearchMemberListQuery } from "@/hooks/queries/useGetSearchMemberListQuery";
import { SearchMemberListResponse } from "@/types/dtos/event";

type Phase = "INPUT" | "MEMBER_SEARCH" | "PICK" | "NONE_MEMBER_SEARCH";

export const AddMemberModal = ({
  title,
  open,
  setOpen,
}: {
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { eventId } = useParams<{ eventId: string }>();
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>("INPUT");
  const [searchResults, setSearchResults] = useState<SearchMemberListResponse[]>([]);
  const [searchTrigger, setSearchTrigger] = useState(false); // 검색 트리거
  const [selectedMember, setSelectedMember] = useState<SearchMemberListResponse | undefined>(
    undefined,
  );

  // eventId를 숫자로 변환
  const eventIdNumber = eventId ? parseInt(eventId, 10) : 0;

  const { data: searchResponse, isLoading } = useGetSearchMemberListQuery(
    eventIdNumber,
    name,
    searchTrigger,
  );

  const postParticipantsMutation = usePostNoneMemberParticipantsMutation();
  // API 응답이 변경될 때마다 searchResults 상태 업데이트
  useEffect(() => {
    if (searchResponse) {
      setSearchResults(searchResponse);
    }
  }, [searchResponse]);

  const handle1PhaseButtonClick = () => {
    if (name.trim() === "") {
      return;
    }
    // 검색 트리거를 증가시켜서 API 호출
    setSearchTrigger(true);
  };

  const handleAddMember = async () => {
    if (!selectedMember) {
      return;
    }

    try {
      await postParticipantsMutation.mutateAsync({
        eventId: eventIdNumber,
        participant: {
          name: selectedMember.name,
          studentId: selectedMember.studentId.trim(),
          phone: selectedMember.phone.trim(),
        },
      });
      // 상태 초기화
      setPhase("PICK");
      setSearchTrigger(false);
      setSearchResults([]);
      setName("");
    } catch (error) {
      console.error("멤버 추가 중 오류 발생:", error);
    } finally {
      setOpen(false);
      setPhase("INPUT");
      setSearchTrigger(false);
      setSearchResults([]);
      setSelectedMember(undefined);
      setName("");
    }
  };

  useEffect(() => {
    if (searchTrigger && !isLoading && searchResponse) {
      const participableStudents = searchResults.filter(student => student.participable === true);
      if (participableStudents.length > 0) {
        setPhase("MEMBER_SEARCH");
      } else {
        setPhase("NONE_MEMBER_SEARCH");
      }
    }
  }, [searchTrigger, isLoading, searchResponse, searchResults]);
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <ModalContainer>
        <X
          onClick={() => setOpen(false)}
          css={css({
            cursor: "pointer",
            fontSize: "24px",
            border: "none",
            color: "#666",
            backgroundColor: "transparent",
            position: "absolute",
            top: "16px",
            right: "16px",
          })}
        >
          ✕
        </X>
        <Text typo="body1" color="sub">
          {title}
        </Text>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            width: "100%",
          }}
        >
          {phase === "INPUT" && (
            <>
              <Text as="h1" typo="h1" style={{ textAlign: "center" }}>
                신청 인원 명단에 추가할
                <br />
                학생의 이름을 입력해주세요
              </Text>
              <Space height={76} />
              <TextField
                placeholder="Ex.김홍익"
                label=""
                value={name}
                onChange={setName}
                style={{ width: "60%" }}
              />
              <Space height={121} />
              <Button
                disabled={name === "" || isLoading}
                onClick={handle1PhaseButtonClick}
                style={{ width: "60%" }}
              >
                {isLoading ? "검색 중..." : "다음으로"}
              </Button>
            </>
          )}

          {phase === "MEMBER_SEARCH" && (
            <>
              <Text as="h1" typo="h1">
                아래의 학생이 맞는지 확인해주세요
              </Text>
              <Space height={76} />
              {searchResults &&
                searchResults.length > 0 &&
                searchResults.filter(student => student.participable === true).length > 0 &&
                searchResults
                  .filter(student => student.participable === true)
                  .map((student, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "24px",
                        width: "70%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "8px",
                          flexGrow: 1,
                          alignItems: "center",
                        }}
                      >
                        <Text typo="h3">{student.name}</Text>
                        <Text typo="body1" color="sub">
                          {student.studentId}
                        </Text>
                      </div>
                      <Checkbox
                        checked={selectedMember?.memberId === student.memberId}
                        onChange={() => setSelectedMember(student)}
                      />
                    </div>
                  ))}
              <Space height={76} />
              <div style={{ display: "flex", gap: "12px", width: "70%" }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPhase("INPUT");
                    setSearchTrigger(false);
                    setSearchResults([]);
                    setSelectedMember(undefined);
                    setName("");
                  }}
                  style={{ width: "100%" }}
                >
                  뒤로 가기{" "}
                </Button>
                <Button
                  disabled={!selectedMember || postParticipantsMutation.isPending}
                  onClick={handleAddMember}
                  style={{ width: "100%" }}
                >
                  {postParticipantsMutation.isPending ? "추가 중..." : "추가하기"}
                </Button>
              </div>
            </>
          )}
          {phase === "PICK" && (
            <div>
              {selectedMember && (
                <div>
                  <Text typo="h1" as="h1">
                    <span style={{ color: color.primary }}> {selectedMember.name}</span> 님을 행사
                    신청 인원에 추가했어요.
                  </Text>
                </div>
              )}
            </div>
          )}
          {phase === "NONE_MEMBER_SEARCH" && (
            <>
              <NoneMemberParticipate
                name={name}
                handleBack={() => {
                  setPhase("INPUT");
                  setSearchTrigger(false);
                  setSearchResults([]);
                  setSelectedMember(undefined);
                  setName("");
                }}
              />
            </>
          )}
        </div>
      </ModalContainer>
    </Modal>
  );
};

const ModalContainer = styled("div")({
  "display": "flex",
  "flexDirection": "column",
  "padding": "44px 24px",
  "backgroundColor": "white",
  "width": "50%",
  "maxHeight": "60%",
  "position": "relative",
  "alignItems": "center",
  "borderRadius": "8px",
  "@media (max-width: 768px)": {
    width: "90%",
  },
});
