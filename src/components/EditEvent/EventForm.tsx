import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { typography } from "wowds-tokens";
import Button from "wowds-ui/Button";
import { FormField } from "./FormField";
import { FormFieldProps } from "./FormField";
import { Flex } from "../@common/Flex";
import { Space } from "../@common/Space";
import { useCreateEventMutation } from "@/hooks/mutations/useCreateEventMutation";
import { useUpdateEventMutation } from "@/hooks/mutations/useUpdateEventMutation";
import { EventType, CreateEventRequest } from "@/types/dtos/event";

const getFormFields = (formValue: EventType | null): FormFieldProps[] => {
  return [
    {
      type: "textfield",
      title: "이름을 입력해주세요",
      value: "예: 홍길동",
    },
    {
      type: "textfield",
      title: "전화번호를 입력해주세요",
      value: "예: 010-1234-5678",
    },
    {
      type: "textfield",
      title: "학번을 입력해주세요",
      value: "예: 20241234",
    },
    {
      type: "option-select",
      title: "유의사항을 확인하셨나요?",
      optional: true,
      optionalChecked: formValue?.noticeConfirmQuestionStatus === "ENABLED",
      options: [{ value: "확인", label: "예, 확인했습니다." }],
    },
    {
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
      type: "option-select",
      title: "선입금을 완료하였나요",
      optional: true,
      optionalChecked: formValue?.prePaymentStatus === "ENABLED", // ENABLED일 때 true
      options: [{ value: "선입금", label: "예, 완료했습니다." }],
    },
    {
      type: "option-select",
      title: "후정산을 완료하셨나요",
      optional: true,
      optionalChecked: formValue?.postPaymentStatus === "ENABLED", // ENABLED일 때 true
      options: [{ value: "후입금", label: "예, 완료했습니다." }],
    },
    {
      type: "option-select",
      title: "RSVP 작성을 완료하셨나요?",
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
}: {
  formValue: EventType | null;
  setFormValues: (value: React.SetStateAction<EventType | null>) => void;
  eventId?: number;
}) => {
  const [description, setDescription] = useState<string>(formValue?.applicationDescription || "");
  const [formFields, setFormFields] = useState<FormFieldProps[]>(getFormFields(formValue));
  const [requiredByIndex, setRequiredByIndex] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(formFields.map((_, i) => [i, true])),
  );

  const createEventMutation = useCreateEventMutation();
  const updateEventMutation = useUpdateEventMutation();

  // 신청 기간이 지났는지 확인하는 함수
  const isApplicationPeriodExpired = () => {
    if (!formValue?.applicationPeriod?.startDate || !formValue?.applicationPeriod?.endDate) {
      return false;
    }
    const startDate = new Date(formValue.applicationPeriod.startDate);
    const endDate = new Date(formValue.applicationPeriod.endDate);
    const now = new Date();
    return now > endDate || now < startDate;
  };

  const handleRequiredToggle = (index: number, next: boolean) => {
    setRequiredByIndex(prev => ({ ...prev, [index]: next }));

    if (index === 3) {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              noticeConfirmQuestionStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
    }

    // 뒷풀이 질문 (index 4) 토글 시 afterPartyStatus 업데이트
    if (index === 4) {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              afterPartyStatus: next ? "ENABLED" : "DISABLED",
              // 뒷풀이가 DISABLED면 선입금도 DISABLED로 설정
              prePaymentStatus: next ? prev.prePaymentStatus : "DISABLED",
              postPaymentStatus: next ? prev.postPaymentStatus : "DISABLED",
            }
          : prev,
      );

      // 뒷풀이가 DISABLED면 선입금/후정산 질문도 비활성화
      if (!next) {
        setRequiredByIndex(prev => ({ ...prev, [5]: false }));
        setRequiredByIndex(prev => ({ ...prev, [6]: false }));
      }
    }

    // 선입금 질문 (index 5) 토글 시 prePaymentStatus 업데이트
    if (index === 5) {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              prePaymentStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
    }

    // 후정산 질문 (index 6) 토글 시 postPaymentStatus 업데이트
    if (index === 6) {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              postPaymentStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
    }

    if (index === 7) {
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
      // optionalChecked 값에 따라 requiredByIndex 설정
      setRequiredByIndex(
        Object.fromEntries(newFormFields.map((field, i) => [i, field.optionalChecked ?? true])),
      );
    } else {
      setDescription("");
      const newFormFields = getFormFields(null);
      setFormFields(newFormFields);
      setRequiredByIndex(Object.fromEntries(newFormFields.map((_, i) => [i, true])));
    }
  }, [formValue]);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handlePublish = () => {
    if (!formValue) {
      console.error("formValue가 없습니다.");
      return;
    }

    // 최신 description을 병합하여 페이로드 생성
    setFormValues(prev => (prev ? { ...prev, applicationDescription: description } : prev));
    const nextEvent = { ...formValue, applicationDescription: description };
    if (eventId) {
      // 수정 모드
      updateEventMutation.mutate({ eventId, eventData: nextEvent });
    } else {
      // 생성 모드
      const createEventData: CreateEventRequest = {
        name: nextEvent.name,
        venue: nextEvent.venue,
        startAt: nextEvent.startAt,
        applicationDescription: nextEvent.applicationDescription,
        applicationPeriod: nextEvent.applicationPeriod,
        regularRoleOnlyStatus: nextEvent.regularRoleOnlyStatus,
        afterPartyStatus: nextEvent.afterPartyStatus,
        prePaymentStatus: nextEvent.prePaymentStatus,
        postPaymentStatus: nextEvent.postPaymentStatus,
        rsvpQuestionStatus: nextEvent.rsvpQuestionStatus,
        noticeConfirmQuestionStatus: nextEvent.noticeConfirmQuestionStatus,
        mainEventMaxApplicantCount: nextEvent.mainEventMaxApplicantCount,
        afterPartyMaxApplicantCount: nextEvent.afterPartyMaxApplicantCount,
      };
      createEventMutation.mutate(createEventData);
    }
  };
  return (
    <div>
      <Space height={16} />
      <Button
        size="sm"
        onClick={handlePublish}
        disabled={createEventMutation.isPending || updateEventMutation.isPending}
      >
        {createEventMutation.isPending || updateEventMutation.isPending
          ? eventId
            ? "수정 중..."
            : "게시 중..."
          : eventId
            ? "수정하기"
            : "게시하기"}
      </Button>
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
        {formFields.map((field, index) => (
          <FormField
            key={`${field.title} - ${index}`}
            {...field}
            optionalChecked={field.optionalChecked ?? requiredByIndex[index]}
            onOptionalChange={checked => handleRequiredToggle(index, checked)}
            isDisabled={
              eventId && isApplicationPeriodExpired() && (index === 4 || index === 5 || index === 6)
                ? true
                : false
            }
          />
        ))}
      </Flex>
    </div>
  );
};
