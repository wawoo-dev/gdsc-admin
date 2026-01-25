import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import { useParams } from "react-router-dom";
import Button from "wowds-ui/Button";
import X from "@/assets/x.svg?react";
import { Flex } from "@/components/@common/Flex";
import { Space } from "@/components/@common/Space";
import { Text } from "@/components/@common/Text";
import { useDeleteEventParticipants } from "@/hooks/mutations/useDeleteEventParticipants";
import { ParticipationContent } from "@/types/dtos/event";

interface DeleteMemberModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedParticipants: ParticipationContent[];
  onDeleteSuccess?: () => void;
  title?: string;
}

export const DeleteMemberModal = ({
  open,
  setOpen,
  selectedParticipants,
  onDeleteSuccess,
  title,
}: DeleteMemberModalProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  const id = Number(eventId);

  // 삭제 핸들러
  const deleteParticipantsMutation = useDeleteEventParticipants();

  const handleDelete = async () => {
    if (selectedParticipants.length > 0) {
      try {
        const eventParticipationIds = selectedParticipants.map(p => p.eventParticipationId);
        await deleteParticipantsMutation.mutateAsync({ eventId: id, eventParticipationIds });
        setOpen(false);
        onDeleteSuccess?.();
      } catch (error) {
        console.error("Error deleting participants:", error);
        alert("삭제 중 오류가 발생했습니다:");
        // 에러 처리 로직 추가 가능 (예: 토스트 메시지 표시)
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <ModalContainer>
        <X
          onClick={handleClose}
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text typo="body1" color="sub">
            {title}
          </Text>

          {/* Content */}
          <div>
            <Text typo="h2" style={{ marginBottom: "16px", textAlign: "center" }} as="h2">
              아래의{" "}
              <Text as="span" color="primary" typo="h2">
                {selectedParticipants.length}명을
              </Text>
              <br />
              행사 신청 인원에서 삭제하시겠어요?
            </Text>
          </div>
        </div>

        {/* Selected Participants List */}
        <div
          css={css({
            overflowY: "auto",
            borderRadius: "4px",
            padding: "12px",
            width: "100%",
          })}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                selectedParticipants.length > 1 ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
              gap: "12px",
            }}
          >
            {selectedParticipants.map((participant, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #c2c2c2",
                  borderRadius: "8px",
                  padding: "22px 24px",
                }}
              >
                <Text typo="h3">{participant.participant.name}</Text>
                <Text typo="body1" color="sub">
                  {participant.participant.studentId}
                </Text>
              </div>
            ))}
          </div>
          <Space height={121} />
        </div>

        {/* Actions */}
        <Flex gap="sm">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={deleteParticipantsMutation.isPending}
          >
            취소하기
          </Button>
          <Button
            onClick={handleDelete}
            disabled={selectedParticipants.length === 0 || deleteParticipantsMutation.isPending}
            style={{
              backgroundColor: selectedParticipants.length === 0 ? "#ccc" : undefined,
              cursor: selectedParticipants.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            {deleteParticipantsMutation.isPending ? "삭제 중..." : `삭제하기`}
          </Button>
        </Flex>
      </ModalContainer>
    </Modal>
  );
};

const ModalContainer = styled("div")({
  "display": "flex",
  "flexDirection": "column",
  "padding": "24px",
  "gap": "24px",
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
