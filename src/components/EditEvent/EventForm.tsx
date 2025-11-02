import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { Link as LinkIcon } from "wowds-icons";
import { color, typography } from "wowds-tokens";
import Button from "wowds-ui/Button";
import { FormField } from "./FormField";
import { FormFieldProps } from "./FormField";
import { Flex } from "../@common/Flex";
import { Space } from "../@common/Space";
import { Text } from "../@common/Text";
import { useUpdateEventFormMutation } from "@/hooks/mutations/useUpdateEventFormMutation";
import { EventType, UpdateEventFormRequest } from "@/types/dtos/event";
const getFormFields = (formValue: EventType | null): FormFieldProps[] => {
  return [
    {
      id: "name",
      type: "textfield",
      title: "이름을 입력해주세요",
      value: "예: 홍길동",
    },
    {
      id: "phone",
      type: "textfield",
      title: "전화번호를 입력해주세요",
      value: "예: 010-1234-5678",
    },
    {
      id: "studentId",
      type: "textfield",
      title: "학번을 입력해주세요",
      value: "예: 20241234",
    },
    {
      id: "noticeConfirm",
      type: "option-select",
      title: "유의사항을 확인하셨나요?",
      optional: true,
      optionalChecked: formValue?.noticeConfirmQuestionStatus === "ENABLED",
      options: [{ value: "확인", label: "예, 확인했습니다." }],
    },
    {
      id: "afterParty",
      type: "option-select",
      title: "뒤풀이에 참여하겠습니까?",
      optional: true,
      optionalChecked: formValue?.afterPartyStatus === "ENABLED",
      options: [
        { value: "참여", label: "참여합니다." },
        { value: "불참", label: "참여하지 않겠습니다." },
      ],
    },
    {
      id: "prePayment",
      type: "textfield",
      title: "선입금을 완료하였나요?",
      optional: true,
      optionalChecked: formValue?.prePaymentStatus === "ENABLED", // ENABLED일 때 true
      value: (
        <Text typo="body1" color="error">
          정산이 있는 행사일 경우 아래 토글을 켜주세요.
        </Text>
      ),
    },
    {
      id: "postPayment",
      type: "option-select",
      title: "후정산을 완료하였나요?",
      optional: true,
      optionalChecked: formValue?.postPaymentStatus === "ENABLED", // ENABLED일 때 true
      options: [{ value: "후입금", label: "예, 완료했습니다." }],
    },
    {
      id: "rsvp",
      type: "option-select",
      title: "RSVP 작성을 완료하였나요?",
      optional: true,
      optionalChecked: formValue?.rsvpQuestionStatus === "ENABLED", // ENABLED일 때 true
      options: [{ value: "RSVP 작성", label: "예, 완료했습니다." }],
    },
  ];
};

export const EventForm = ({
  formValue,
  setFormValues,
  eventId,
  totalAttendeesCount,
}: {
  formValue: EventType | null;
  setFormValues: (value: React.SetStateAction<EventType | null>) => void;
  eventId?: number;
  totalAttendeesCount: number;
}) => {
  const [description, setDescription] = useState<string>(formValue?.applicationDescription || "");
  const [formFields, setFormFields] = useState<FormFieldProps[]>(getFormFields(formValue));
  const [requiredById, setRequiredById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(formFields.map(field => [field.id, true])),
  );
  const [copied, setCopied] = useState<boolean>(false);

  // 초기 상태 저장
  const [initialState, setInitialState] = useState<{
    description: string;
    formValue: EventType | null;
  }>(() => ({
    description: formValue?.applicationDescription || "",
    formValue: formValue,
  }));

  const updateEventFormMutation = useUpdateEventFormMutation();

  // 데이터 변경사항 감지
  const hasChanges = () => {
    if (!initialState.formValue || !formValue) {
      return false;
    }

    // description 변경 확인
    const descriptionChanged = description !== initialState.description;

    // formValue의 관련 필드들 변경 확인
    const formValueChanged =
      formValue.applicationDescription !== initialState.formValue.applicationDescription ||
      formValue.afterPartyStatus !== initialState.formValue.afterPartyStatus ||
      formValue.prePaymentStatus !== initialState.formValue.prePaymentStatus ||
      formValue.postPaymentStatus !== initialState.formValue.postPaymentStatus ||
      formValue.rsvpQuestionStatus !== initialState.formValue.rsvpQuestionStatus ||
      formValue.noticeConfirmQuestionStatus !== initialState.formValue.noticeConfirmQuestionStatus;

    return descriptionChanged || formValueChanged;
  };

  // 복사할 URL 생성 (eventId가 있을 때만)
  const getEventUrl = () => {
    if (!eventId) {
      return "";
    }
    return `${import.meta.env.VITE_EVENT_URL}/event/${eventId}`;
  };

  const handleCopyUrl = async () => {
    const url = getEventUrl();
    if (!url) {
      console.error("이벤트 ID가 없어 URL을 생성할 수 없습니다.");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 복사 상태 초기화
    } catch (err) {
      console.error("URL 복사 실패:", err);
      // fallback: 텍스트 선택 방식
      const textField = document.createElement("input");
      textField.value = url;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      document.body.removeChild(textField);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRequiredToggle = (id: string, next: boolean) => {
    setRequiredById(prev => ({ ...prev, [id]: next }));

    if (id === "noticeConfirm") {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              noticeConfirmQuestionStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
    }

    // 뒷풀이 질문 토글 시 afterPartyStatus 업데이트
    if (id === "afterParty") {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              afterPartyStatus: next ? "ENABLED" : "DISABLED",
              // 뒷풀이가 DISABLED면 선입금도 DISABLED로 설정
              prePaymentStatus: next ? prev.prePaymentStatus : "DISABLED",
              postPaymentStatus: next ? prev.postPaymentStatus : "DISABLED",
              // 뒷풀이가 DISABLED면 뒷풀이 제한 인원도 null로 설정
              afterPartyMaxApplicantCount: next ? prev.afterPartyMaxApplicantCount : null,
            }
          : prev,
      );

      // 뒷풀이가 DISABLED면 선입금/후정산 질문도 비활성화
      if (!next) {
        setRequiredById(prev => ({ ...prev, prePayment: false }));
        setRequiredById(prev => ({ ...prev, postPayment: false }));
      }
    }

    // 선입금 질문 토글 시 prePaymentStatus 업데이트
    if (id === "prePayment") {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              prePaymentStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
    }

    // 후정산 질문 토글 시 postPaymentStatus 업데이트
    if (id === "postPayment") {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              postPaymentStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
    }

    if (id === "rsvp") {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              rsvpQuestionStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
    }
  };

  useEffect(() => {
    if (formValue) {
      setDescription(formValue.applicationDescription);
      const newFormFields = getFormFields(formValue);
      setFormFields(newFormFields);
      // optionalChecked 값에 따라 requiredById 설정
      setRequiredById(
        Object.fromEntries(newFormFields.map(field => [field.id, field.optionalChecked ?? true])),
      );

      // 초기 상태 업데이트 (formValue가 변경될 때만)
      setInitialState(() => ({
        description: formValue.applicationDescription || "",
        formValue: formValue,
      }));
    } else {
      setDescription("");
      const newFormFields = getFormFields(null);
      setFormFields(newFormFields);
      setRequiredById(Object.fromEntries(newFormFields.map(field => [field.id, true])));

      // 초기 상태 업데이트
      setInitialState({
        description: "",
        formValue: null,
      });
    }
  }, [formValue]);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };
  const buildEventPayload = (event: EventType): UpdateEventFormRequest => ({
    applicationDescription: event.applicationDescription,
    afterPartyStatus: event.afterPartyStatus,
    prePaymentStatus: event.prePaymentStatus,
    postPaymentStatus: event.postPaymentStatus,
    rsvpQuestionStatus: event.rsvpQuestionStatus,
    noticeConfirmQuestionStatus: event.noticeConfirmQuestionStatus,
  });

  const handlePublish = () => {
    if (!formValue) {
      console.error("formValue가 없습니다.");
      return;
    }

    // 최신 description을 병합하여 페이로드 생성
    setFormValues(prev => (prev ? { ...prev, applicationDescription: description } : prev));
    const nextEvent = { ...formValue, applicationDescription: description };
    const eventPayload = buildEventPayload(nextEvent);

    if (eventId) {
      // 기존 이벤트 수정 - 폼 정보만 업데이트
      updateEventFormMutation.mutate(
        { eventId, eventData: eventPayload },
        {
          onSuccess: () => {
            console.log("이벤트 폼 정보가 성공적으로 수정되었습니다.");
            // 저장 성공 후 초기 상태 업데이트
            setInitialState({
              description: description,
              formValue: nextEvent,
            });
          },
          onError: error => {
            console.error("이벤트 폼 정보 수정 중 오류가 발생했습니다:", error);
          },
        },
      );
    } else {
      // 새 이벤트 생성은 EventInformation에서 처리되므로 여기서는 폼 정보만 업데이트
      console.log("새 이벤트 생성은 기본 정보 입력 후 처리됩니다.");
    }
  };
  return (
    <div>
      <Space height={16} />
      <Flex justify="end" gap="sm">
        <Button
          size="sm"
          variant="sub"
          icon={<LinkIcon stroke="primary" />}
          onClick={handleCopyUrl}
          disabled={!eventId}
        >
          {copied ? "복사 완료!" : "URL 복사하기"}
        </Button>
        <Button
          size="sm"
          onClick={handlePublish}
          disabled={updateEventFormMutation.isPending || !hasChanges()}
        >
          {updateEventFormMutation.isPending ? "수정 중..." : "저장하기"}
        </Button>
      </Flex>
      <Space height={30} />
      <textarea
        placeholder="행사 신청 폼 설명을 입력해주세요"
        value={description}
        onChange={e => handleDescriptionChange(e.target.value)}
        css={css({
          "width": "100%",
          "height": "100px",
          "padding": "12px",
          "border": "1px solid #ccc",
          "borderRadius": "4px",
          ...typography.body1,
          "fontFamily": "inherit",
          "resize": "vertical",
          "&:focus": {
            outline: "none",
            borderColor: "#1976d2",
            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
          },
        })}
      />
      <Space height={32} />
      <Flex gap="sm" direction="column">
        {formFields.map(field => (
          <FormField
            key={field.id}
            {...field}
            optionalChecked={field.optionalChecked ?? requiredById[field.id]}
            onOptionalChange={checked => handleRequiredToggle(field.id, checked)}
            isDisabled={
              //NOTE: 신청 인원이 한 명이라도 생긴 경우 뒷풀이, 선입금, 후정산 질문은 비활성화
              eventId &&
              totalAttendeesCount > 0 &&
              (field.id === "noticeConfirm" ||
                field.id === "afterParty" ||
                field.id === "prePayment" ||
                field.id === "postPayment" ||
                field.id === "rsvp")
                ? true
                : false
            }
          />
        ))}
      </Flex>
    </div>
  );
};
