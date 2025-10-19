import { css } from "@emotion/react";
import { Modal } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";
import { space } from "wowds-tokens";
import Button from "wowds-ui/Button";
import { Flex } from "../../@common/Flex";
import { Text } from "../../@common/Text";

interface AfterPartyConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

export const AfterPartyConfirmModal = ({ open, onClose }: AfterPartyConfirmModalProps) => {
  const qrCodeUrl = "https://example.com/qr-code";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    toast.success("링크가 복사되었어요!");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "450px",
          width: "652px",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "32px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* QR 스캔하기 제목 */}
        <Text typo="h1" style={{ marginBottom: "10px" }} color="primary">
          QR 스캔하기
        </Text>

        <Text typo="h2" color="sub" style={{ marginBottom: "32px" }}>
          뒤풀이 현장에서 모바일로 출석체크를 진행할 수 있어요.
        </Text>

        {/* QR 코드 영역 */}
        <div
          css={css({
            position: "relative",
            display: "inline-block",
            marginBottom: "24px",
          })}
        >
          {/* QR 코드 플레이스홀더 */}
          <div
            css={css({
              width: "200px",
              height: "200px",
              backgroundColor: "white",
              borderRadius: space.sm,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            })}
          >
            <QRCodeCanvas value={qrCodeUrl} />
          </div>
        </div>

        {/* 링크 복사 버튼 */}
        <Button variant="outline" size="lg" onClick={handleCopyLink} style={{ width: "100%" }}>
          <Flex align="center" gap="sm">
            <span>🔗</span>
            <Text typo="body2" color="primary">
              또는 링크 복사하기
            </Text>
          </Flex>
        </Button>
      </div>
    </Modal>
  );
};
