import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { typography } from "wowds-tokens";
import Button from "wowds-ui/Button";
import { FormField } from "./FormField";
import { FormFieldProps } from "./FormField";
import { Flex } from "../@common/Flex";
import { Space } from "../@common/Space";
import { EventType, CreateEventRequest } from "@/types/dtos/event";
import { useCreateEventMutation } from "@/hooks/mutations/useCreateEventMutation";

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
      options: [{ value: "확인", label: "예, 확인했습니다." }],
    },
    {
      type: "option-select",
      title: "뒤풀이에 참여하겠습니까?",
      optional: true,
      optionalChecked: formValue?.afterPartyStatus === "ENABLED", // ENABLED일 때 true
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
  ];
};

export const EventForm = ({
  formValue,
  setFormValues,
}: {
  formValue: EventType | null;
  setFormValues: (value: React.SetStateAction<EventType | null>) => void;
}) => {
  const [description, setDescription] = useState<string>(formValue?.applicationDescription || "");
  const [formFields, setFormFields] = useState<FormFieldProps[]>(getFormFields(formValue));
  const [requiredByIndex, setRequiredByIndex] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(formFields.map((_, i) => [i, true])),
  );

  const createEventMutation = useCreateEventMutation();

  const handleRequiredToggle = (index: number, next: boolean) => {
    setRequiredByIndex(prev => ({ ...prev, [index]: next }));

    //TODO: 유의사항 토글 업데이트
    if (index === 3) {
     
    }


    // 뒷풀이 질문 (index 4) 토글 시 afterPartyStatus 업데이트
    if (index === 4) {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              afterPartyStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
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

    //TODO: 입력값을 formValue 에 업데이트 하는 건 게시하기를 누르고 함
    setFormValues(prev => (prev ? { ...prev, applicationDescription: description } : prev));
    const createEventData: CreateEventRequest = {
      name: formValue.name,
      venue: formValue.venue,
      startAt: formValue.startAt,
      applicationDescription: formValue.applicationDescription,
      applicationPeriod: formValue.applicationPeriod,
      regularRoleOnlyStatus: formValue.regularRoleOnlyStatus,
      afterPartyStatus: formValue.afterPartyStatus,
      prePaymentStatus: formValue.prePaymentStatus,
      postPaymentStatus: formValue.postPaymentStatus,
      rsvpQuestionStatus: formValue.rsvpQuestionStatus,
      mainEventMaxApplicantCount: formValue.mainEventMaxApplicantCount,
      afterPartyMaxApplicantCount: formValue.afterPartyMaxApplicantCount,
    };

    createEventMutation.mutate(createEventData);
  };
  return (
    <div>
      <Space height={16} />
      <Button size="sm" onClick={handlePublish} disabled={createEventMutation.isPending}>
        {createEventMutation.isPending ? "게시 중..." : "게시하기"}
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
          />
        ))}
      </Flex>
    </div>
  );
};
