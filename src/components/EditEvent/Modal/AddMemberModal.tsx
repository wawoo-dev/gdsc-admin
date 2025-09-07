import React, { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import Box from "wowds-ui/Box";
import Button from "wowds-ui/Button";
import Checkbox from "wowds-ui/Checkbox";
import DropDown from "wowds-ui/DropDown";
import DropDownOption from "wowds-ui/DropDownOption";
import SearchBar from "wowds-ui/SearchBar";
import Table from "wowds-ui/Table";
import TextField from "wowds-ui/TextField";
import { Text } from "@/components/@common/Text";
import usePostParticipantsMutation from "@/hooks/mutations/usePostParticipantsMutation";
import { useGetSearchMemberListQuery } from "@/hooks/queries/useGetSearchMemberListQuery";
import { SearchMemberListResponse } from "@/types/dtos/event";

type Phase = "INPUT" | "MEMBER_SEARCH" | "PICK" | "NONE_MEMBER_SEARCH";

export const AddMemberModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>("INPUT");
  const [searchResults, setSearchResults] = useState<SearchMemberListResponse[]>([]);
  const [searchTrigger, setSearchTrigger] = useState(0); // 검색 트리거
  const [selectedMember, setSelectedMember] = useState<SearchMemberListResponse | undefined>(
    undefined,
  );

  // TODO: eventId를 props로 받아야 함
  const eventId = 1; // 임시로 1 설정

  const {
    data: searchResponse,
    isLoading,
    error,
  } = useGetSearchMemberListQuery(eventId, name, searchTrigger > 0);

  const postParticipantsMutation = usePostParticipantsMutation();

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
    setSearchTrigger(prev => prev + 1);
  };

  const handleAddMember = async () => {
    if (!selectedMember) {
      return;
    }

    try {
      await postParticipantsMutation.mutateAsync({
        eventId,
        memberId: selectedMember.memberId,
      });
      // 상태 초기화
      setPhase("PICK");
      setSearchTrigger(0);
      setSearchResults([]);
      setSelectedMember(undefined);
      setName("");
    } catch (error) {
      console.error("멤버 추가 중 오류 발생:", error);
    }
  };

  console.log(selectedMember);
  // 검색 결과에 따라 phase 설정
  useEffect(() => {
    if (searchTrigger > 0 && !isLoading && searchResponse) {
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
      onClose={() => {
        setOpen(false);
      }}
    >
      <Box
        text={
          <>
            <Text typo="body1" color="sub">
              2025-1 개강 총회
            </Text>
            {phase === "INPUT" && (
              <>
                <Text as="h1" typo="h1">
                  신청 인원 명단에 추가할 학생의 이름을 입력해주세요
                </Text>
                <TextField placeholder="김홍익" label="" value={name} onChange={setName} />
                <Button disabled={name === "" || isLoading} onClick={handle1PhaseButtonClick}>
                  {isLoading ? "검색 중..." : "다음으로"}
                </Button>
              </>
            )}

            {phase === "MEMBER_SEARCH" && (
              <>
                <Text as="h1" typo="h1">
                  아래의 학생이 맞는지 확인해주세요
                </Text>
                {searchResults &&
                  searchResults.length > 0 &&
                  searchResults.filter(student => student.participable === true).length > 0 &&
                  searchResults
                    .filter(student => student.participable === true)
                    .map((student, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", alignItems: "center", gap: "10px" }}
                      >
                        <Text typo="h3">{student.name}</Text>
                        <Text typo="body1" color="sub">
                          {student.studentId}
                        </Text>
                        <Checkbox
                          checked={selectedMember?.memberId === student.memberId}
                          onChange={() => setSelectedMember(student)}
                        />
                      </div>
                    ))}
                <div style={{ display: "flex", gap: "20px" }}>
                  <Button
                    onClick={() => {
                      setPhase("INPUT");
                      setSearchTrigger(0);
                      setSearchResults([]);
                      setSelectedMember(undefined);
                      setName("");
                    }}
                  >
                    다시 검색
                  </Button>
                  <Button
                    disabled={!selectedMember || postParticipantsMutation.isPending}
                    onClick={handleAddMember}
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
                    <Text typo="h3">{selectedMember.name}</Text>
                    <Text typo="body1" color="sub">
                      {selectedMember.studentId}
                    </Text>
                  </div>
                )}
              </div>
            )}
            {phase === "NONE_MEMBER_SEARCH" && (
              <>
                <Text as="h1" typo="h1">
                  검색 결과가 없습니다
                </Text>
                <Text typo="body1" color="sub">
                  입력하신 이름으로 검색된 학생이 없습니다.
                </Text>
              </>
            )}
          </>
        }
        style={{
          position: "absolute",
          bottom: "50%",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "fit-content",
          height: "fit-content",
        }}
      />
    </Modal>
  );
};
