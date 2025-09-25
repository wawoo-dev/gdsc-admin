import React, { useState } from "react";
import { Modal } from "@mui/material";
import { css } from "@emotion/react";
import { color, space } from "wowds-tokens";
import Button from "wowds-ui/Button";
import TextField from "wowds-ui/TextField";
import { Flex } from "@/components/@common/Flex";
import { Space } from "@/components/@common/Space";
import { Text } from "@/components/@common/Text";

interface CopyUrlModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

export const CopyUrlModal = ({ open, onClose, url }: CopyUrlModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 복사 상태 초기화
    } catch (err) {
      console.error("URL 복사 실패:", err);
      // fallback: 텍스트 선택 방식
      const textField = document.getElementById("url-input") as HTMLInputElement;
      if (textField) {
        textField.select();
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      css={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <div
        css={css({
          backgroundColor: "white",
          borderRadius: space.md,
          padding: "32px",
          width: "400px",
          maxWidth: "90vw",
          position: "relative",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        })}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          css={css({
            "position": "absolute",
            "top": "16px",
            "right": "16px",
            "background": "none",
            "border": "none",
            "fontSize": "20px",
            "cursor": "pointer",
            "color": color.sub,
            "&:hover": {
              color: color.text,
            },
          })}
        >
          ×
        </button>

        {/* 제목 */}
        <Text typo="h3" style={{ marginBottom: "24px", textAlign: "center" }}>
          행사 폼이 게시되었어요.
        </Text>

        {/* 링크 라벨 */}
        <Text typo="body1" style={{ marginBottom: "8px" }}>
          행사 폼 링크
        </Text>

        {/* URL 입력 필드 */}
        <TextField
          id="url-input"
          value={url}
          readOnly
          fullWidth
          css={css({
            "& .MuiInputBase-root": {
              "backgroundColor": color.backgroundAlternative,
              "&:hover": {
                backgroundColor: color.backgroundAlternative,
              },
            },
          })}
          InputProps={{
            startAdornment: (
              <span
                css={css({
                  marginRight: "8px",
                  color: color.sub,
                  fontSize: "16px",
                })}
              >
                🔗
              </span>
            ),
          }}
        />

        <Space height="lg" />

        {/* 복사 버튼 */}
        <Button
          onClick={handleCopyUrl}
          fullWidth
          size="lg"
          css={css({
            "backgroundColor": copied ? color.success : color.primary,
            "&:hover": {
              backgroundColor: copied ? color.success : color.primary,
            },
          })}
        >
          {copied ? "복사 완료!" : "링크 복사하기"}
        </Button>
      </div>
    </Modal>
  );
};
