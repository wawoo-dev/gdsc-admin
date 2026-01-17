import { Flex } from "@/components/@common/Flex";
import { Space } from "@/components/@common/Space";
import { Text } from "@/components/@common/Text";
import { useCreateEventMutation } from "@/hooks/mutations/useCreateEventMutation";
import { useUpdateBasicInfoEventMutation } from "@/hooks/mutations/useUpdateBasicInfoEventMutation";
import { CreateEventRequest, EventType } from "@/types/dtos/event";
import { css } from "@emotion/react";
import { TextField } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { CSSProperties, useEffect, useState } from "react";
import { color, space, typography } from "wowds-tokens";
import Button from "wowds-ui/Button";
import DropDown from "wowds-ui/DropDown";
import DropDownOption from "wowds-ui/DropDownOption";

import RoutePath from "@/routes/routePath";
import { endOfDay, startOfDay } from "date-fns";
import "dayjs/locale/ko";
import { useNavigate } from "react-router-dom";
import { DateRangePicker } from "./DateRangePicker";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

const parseISO = (s?: string): Date | undefined => {
  if (!s) {
    return undefined;
  }
  // 한국 시간대를 고려하여 파싱
  return dayjs(s).tz("Asia/Seoul").toDate();
};

const parseDate = (date?: Date): string => {
  if (!date) {
    return "";
  }
  // 한국 시간대를 고려하여 ISO 문자열 생성 (.000Z 제거)
  return dayjs(date).tz("Asia/Seoul").format("YYYY-MM-DDTHH:mm:ss");
};

export const EventInformation = ({
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
  const navigate = useNavigate();

  const createEventMutation = useCreateEventMutation();
  const updateBasicInfoMutation = useUpdateBasicInfoEventMutation();
  //const [formValues, setFormValues] = useState<EventType | null>(formValue);
  const [selectedRange, setSelectedRange] = useState<
    { from: Date | undefined; to: Date | undefined } | undefined
  >(() => {
    if (!formValue) {
      return undefined;
    }
    return {
      from: parseISO(formValue.applicationPeriod?.startDate),
      to: parseISO(formValue.applicationPeriod?.endDate),
    };
  });

  const [selectedEventDate, setSelectedEventDate] = useState<Date | undefined>(
    formValue?.startAt ? new Date(formValue?.startAt) : undefined,
  );

  const [venue, setVenue] = useState<string>("");
  const [description, setDescription] = useState<string>(formValue?.description || "");
  const [title, setTitle] = useState<string>(formValue?.name || "");
  const [mainEventMaxCount, setMainEventMaxCount] = useState<string>(
    formValue?.mainEventMaxApplicantCount?.toString() || "",
  );
  const [afterPartyMaxCount, setAfterPartyMaxCount] = useState<string>(
    formValue?.afterPartyMaxApplicantCount?.toString() || "",
  );
  const [regularRoleOnlyStatus, setRegularRoleOnlyStatus] = useState<"ENABLED" | "DISABLED">(
    formValue?.regularRoleOnlyStatus || "DISABLED",
  );
  const [mainEventLimitEnabled, setMainEventLimitEnabled] = useState<boolean>(
    eventId ? (formValue?.mainEventMaxApplicantCount || 0) > 0 : true,
  );
  const [afterPartyLimitEnabled, setAfterPartyLimitEnabled] = useState<boolean>(
    eventId ? (formValue?.afterPartyMaxApplicantCount || 0) > 0 : true,
  );

  // 초기 상태 저장
  const [initialState, setInitialState] = useState<{
    title: string;
    venue: string;
    description: string;
    regularRoleOnlyStatus: "ENABLED" | "DISABLED";
    selectedRange: { from: Date | undefined; to: Date | undefined } | undefined;
    selectedEventDate: Date | undefined;
    mainEventMaxCount: string;
    afterPartyMaxCount: string;
    mainEventLimitEnabled: boolean;
    afterPartyLimitEnabled: boolean;
  }>(() => ({
    title: formValue?.name || "",
    venue: formValue?.venue || "",
    description: formValue?.description || "",
    regularRoleOnlyStatus: formValue?.regularRoleOnlyStatus || "DISABLED",
    selectedRange: formValue
      ? {
          from: parseISO(formValue.applicationPeriod?.startDate),
          to: parseISO(formValue.applicationPeriod?.endDate),
        }
      : undefined,
    selectedEventDate: formValue?.startAt ? new Date(formValue?.startAt) : undefined,
    mainEventMaxCount: formValue?.mainEventMaxApplicantCount?.toString() || "",
    afterPartyMaxCount: formValue?.afterPartyMaxApplicantCount?.toString() || "",
    mainEventLimitEnabled: eventId ? (formValue?.mainEventMaxApplicantCount || 0) > 0 : true,
    afterPartyLimitEnabled: eventId ? (formValue?.afterPartyMaxApplicantCount || 0) > 0 : true,
  }));

  // 행사 생성 가능 여부
  const isCreationValid = !!(
    title &&
    selectedEventDate &&
    ((mainEventLimitEnabled && Number(mainEventMaxCount) > 0) || !mainEventLimitEnabled)
  );

  // 데이터 변경사항 감지
  const hasChanges = () => {
    return (
      title !== initialState.title ||
      venue !== initialState.venue ||
      description !== initialState.description ||
      regularRoleOnlyStatus !== initialState.regularRoleOnlyStatus ||
      JSON.stringify(selectedRange) !== JSON.stringify(initialState.selectedRange) ||
      JSON.stringify(selectedEventDate) !== JSON.stringify(initialState.selectedEventDate) ||
      mainEventMaxCount !== initialState.mainEventMaxCount ||
      afterPartyMaxCount !== initialState.afterPartyMaxCount ||
      mainEventLimitEnabled !== initialState.mainEventLimitEnabled ||
      afterPartyLimitEnabled !== initialState.afterPartyLimitEnabled
    );
  };

  // 신청 기간이 지났는지 확인하는 함수
  const isApplicationInPeriod = () => {
    if (!formValue?.applicationPeriod?.startDate || !formValue?.applicationPeriod?.endDate) {
      return false;
    }
    const startDate = new Date(formValue.applicationPeriod.startDate);
    const endDate = new Date(formValue.applicationPeriod.endDate);
    const now = new Date();
    return now > startDate && now < endDate;
  };

  useEffect(() => {
    if (formValue) {
      // setFormValues는 제거 - 부모에서 이미 관리하고 있음
      setSelectedRange({
        from: parseISO(formValue.applicationPeriod?.startDate),
        to: parseISO(formValue.applicationPeriod?.endDate),
      });
      setSelectedEventDate(parseISO(formValue.startAt));
      setDescription(formValue.description);
      setVenue(formValue.venue);
      setTitle(formValue.name);
      setMainEventMaxCount(formValue.mainEventMaxApplicantCount?.toString() || "");
      setAfterPartyMaxCount(formValue.afterPartyMaxApplicantCount?.toString() || "");
      setRegularRoleOnlyStatus(formValue.regularRoleOnlyStatus);
      setMainEventLimitEnabled(eventId ? (formValue.mainEventMaxApplicantCount || 0) > 0 : true);
      setAfterPartyLimitEnabled(
        formValue.afterPartyStatus === "DISABLED"
          ? false
          : (formValue.afterPartyMaxApplicantCount || 0) > 0,
      );

      // 초기 상태 업데이트 (formValue가 변경될 때만)
      setInitialState({
        title: formValue.name,
        venue: formValue.venue,
        description: formValue.description,
        regularRoleOnlyStatus: formValue.regularRoleOnlyStatus,
        selectedRange: {
          from: parseISO(formValue.applicationPeriod?.startDate),
          to: parseISO(formValue.applicationPeriod?.endDate),
        },
        selectedEventDate: parseISO(formValue.startAt),
        mainEventMaxCount: formValue.mainEventMaxApplicantCount?.toString() || "",
        afterPartyMaxCount: formValue.afterPartyMaxApplicantCount?.toString() || "",
        mainEventLimitEnabled: eventId ? (formValue.mainEventMaxApplicantCount || 0) > 0 : true,
        afterPartyLimitEnabled:
          formValue.afterPartyStatus === "DISABLED"
            ? false
            : (formValue.afterPartyMaxApplicantCount || 0) > 0,
      });
    } else {
      setSelectedRange(undefined);
      setSelectedEventDate(undefined);
      setVenue("");
      setTitle("");
      setDescription("");
      setMainEventMaxCount("");
      setAfterPartyMaxCount("");
      setRegularRoleOnlyStatus("DISABLED");
      setMainEventLimitEnabled(eventId ? false : true);
      setAfterPartyLimitEnabled(eventId ? false : true);

      // 초기 상태 업데이트
      setInitialState({
        title: "",
        venue: "",
        description: "",
        regularRoleOnlyStatus: "DISABLED",
        selectedRange: undefined,
        selectedEventDate: undefined,
        mainEventMaxCount: "",
        afterPartyMaxCount: "",
        mainEventLimitEnabled: eventId ? false : true,
        afterPartyLimitEnabled: eventId ? false : true,
      });
    }
  }, [formValue, eventId]);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleVenueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVenue(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleMainEventMaxCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // 숫자만 허용 (빈 문자열도 허용)
    if (value === "" || /^\d+$/.test(value)) {
      setMainEventMaxCount(value);
    }
  };

  const handleAfterPartyMaxCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // 숫자만 허용 (빈 문자열도 허용)
    if (value === "" || /^\d+$/.test(value)) {
      setAfterPartyMaxCount(value);
    }
  };

  const handleSave = () => {
    const basicInfoData: CreateEventRequest = {
      name: title,
      venue: venue,
      description: description,
      regularRoleOnlyStatus: regularRoleOnlyStatus,
      applicationPeriod: {
        startDate: parseDate(selectedRange?.from),
        endDate: parseDate(selectedRange?.to),
      },
      startAt: parseDate(selectedEventDate),
      afterPartyMaxApplicantCount:
        formValue?.afterPartyStatus === "DISABLED"
          ? null
          : afterPartyLimitEnabled
            ? parseInt(afterPartyMaxCount) || 0
            : null,
      mainEventMaxApplicantCount: mainEventLimitEnabled ? parseInt(mainEventMaxCount) || 0 : null,
    };

    const updateFormValues = () => {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              name: title,
              venue: venue,
              description: description,
              regularRoleOnlyStatus: regularRoleOnlyStatus,
              applicationPeriod: {
                startDate: parseDate(selectedRange?.from),
                endDate: parseDate(selectedRange?.to),
              },
              startAt: parseDate(selectedEventDate),
              mainEventMaxApplicantCount: mainEventLimitEnabled
                ? parseInt(mainEventMaxCount) || 0
                : null,
              afterPartyMaxApplicantCount: afterPartyLimitEnabled
                ? parseInt(afterPartyMaxCount) || 0
                : null,
            }
          : prev,
      );
    };

    if (eventId) {
      // 기존 이벤트 수정
      updateBasicInfoMutation.mutate(
        { eventId, eventData: basicInfoData },
        {
          onSuccess: () => {
            updateFormValues();
            // 저장 성공 후 초기 상태 업데이트
            setInitialState({
              title: title,
              venue: venue,
              description: description,
              regularRoleOnlyStatus: regularRoleOnlyStatus,
              selectedRange: selectedRange,
              selectedEventDate: selectedEventDate,
              mainEventMaxCount: mainEventMaxCount,
              afterPartyMaxCount: afterPartyMaxCount,
              mainEventLimitEnabled: mainEventLimitEnabled,
              afterPartyLimitEnabled: afterPartyLimitEnabled,
            });
          },
          onError: error => {
            console.error("기본 정보 저장 중 오류가 발생했습니다:", error);
          },
        },
      );
    } else {
      // 새 이벤트 생성
      createEventMutation.mutate(basicInfoData, {
        onSuccess: data => {
          navigate(`${RoutePath.EditEvent}/${data.eventId}`, { replace: true });
          console.log("이벤트가 성공적으로 생성되었습니다:", data);
        },
        onError: error => {
          console.error("이벤트 생성 중 오류가 발생했습니다:", error);
        },
      });
    }
  };

  return (
    <>
      <div
        css={css({
          backgroundColor: color.backgroundAlternative,
          padding: "30px",
          borderRadius: space.md,
          marginTop: "30px",
        })}
      >
        <Text typo="h2">행사 기본 정보를 입력해주세요</Text>
        <Space height="lg" />
        <Flex align="flex-end" gap="lg">
          <Flex justify="start" align="start" style={{ flexWrap: "wrap", flex: 1 }} gap="lg">
            {/* 행사 이름 - 신청 범위 */}
            <Flex
              gap="sm"
              justify="start"
              align="end"
              style={{ flex: "0 0 100%", marginBottom: "16px" }}
            >
              <TextField
                label="행사이름"
                placeholder="행사 이름을 입력해주세요"
                style={{ ...formItemStyle, backgroundColor: "white" }}
                value={title}
                onChange={handleTitleChange}
                variant="outlined"
                fullWidth
                size="small"
              />
              <DropDown
                label="신청범위"
                placeholder="신청 범위를 선택해주세요"
                style={{
                  ...formItemStyle,
                  pointerEvents: eventId && isApplicationInPeriod() ? "none" : "auto",
                  opacity: eventId && isApplicationInPeriod() ? 0.6 : 1,
                }}
                value={regularRoleOnlyStatus === "ENABLED" ? "only-member" : "everyone"}
                onChange={value =>
                  setRegularRoleOnlyStatus(
                    value.selectedValue === "only-member" ? "ENABLED" : "DISABLED",
                  )
                }
              >
                <DropDownOption value="only-member" text="정회원만 신청 가능" />
                <DropDownOption value="everyone" text="모두 신청 가능" />
              </DropDown>
            </Flex>
            {/* 신청 시작일/종료일/장소 */}
            <Flex
              gap="sm"
              justify="start"
              align="start"
              style={{ flex: "0 0 100%", marginBottom: "16px" }}
            >
              <DateRangePicker
                value={selectedRange}
                onChange={newValue => {
                  const startDate = newValue?.from ? startOfDay(newValue.from) : undefined;
                  const endDate = newValue?.to ? endOfDay(newValue.to) : undefined;

                  setSelectedRange({ from: startDate, to: endDate });
                }}
              />
              <TextField
                value={venue}
                onChange={handleVenueChange}
                label="행사 장소"
                placeholder="행사 장소를 입력해주세요"
                style={{ flex: "0 0 calc(33.33% - 8px)", backgroundColor: "white" }}
                variant="outlined"
                fullWidth
                size="small"
              />
            </Flex>
            {/* 진행 날짜/시간 */}
            <Flex
              gap="sm"
              justify="start"
              align="start"
              style={{ flex: "0 0 100%", marginBottom: "16px" }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <Flex gap="sm" style={{ flex: "0 0 calc(50% - 8px)" }}>
                  <DatePicker
                    label="행사 진행 날짜"
                    value={selectedEventDate ? dayjs(selectedEventDate) : null}
                    onChange={newValue => {
                      const newDate = newValue?.toDate();
                      setSelectedEventDate(newDate);
                    }}
                    minDate={selectedRange?.from ? dayjs(selectedRange.from) : undefined}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { backgroundColor: "white" },
                        size: "small",
                      },
                    }}
                  />
                  <TimePicker
                    label="행사 진행 시간"
                    value={selectedEventDate ? dayjs(selectedEventDate).tz("Asia/Seoul") : null}
                    onChange={newValue => {
                      if (newValue && selectedEventDate) {
                        // 기존 날짜에 새로운 시간을 적용 (한국 시간대 기준)
                        const newDate = dayjs(selectedEventDate)
                          .hour(newValue.hour())
                          .minute(newValue.minute())
                          .second(0)
                          .millisecond(0)
                          .toDate();
                        setSelectedEventDate(newDate);
                      }
                    }}
                    views={["hours", "minutes"]}
                    format="HH:mm"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { backgroundColor: "white" },
                        size: "small",
                      },
                    }}
                  />
                </Flex>
              </LocalizationProvider>
            </Flex>
            {/* 인원 제한/뒷풀이 제한 */}
            <Flex
              gap="sm"
              justify="start"
              align="start"
              style={{ flex: "0 0 100%", marginBottom: "16px" }}
            >
              <div style={{ flex: "0 0 calc(50% - 8px)" }}>
                <Text typo="body1" style={{ marginBottom: "8px" }}>
                  행사 인원 제한
                </Text>
                <Flex gap="sm" style={{ marginBottom: "8px", justifyContent: "left" }}>
                  <label>
                    <input
                      type="radio"
                      name="mainEventLimit"
                      checked={!mainEventLimitEnabled}
                      onChange={() => setMainEventLimitEnabled(false)}
                      style={{ marginRight: "4px" }}
                    />
                    없음
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="mainEventLimit"
                      checked={mainEventLimitEnabled}
                      onChange={() => setMainEventLimitEnabled(true)}
                      style={{ marginRight: "4px" }}
                    />
                    있음
                  </label>
                </Flex>
                {mainEventLimitEnabled && (
                  <TextField
                    label="제한 인원"
                    placeholder="제한 인원(20)"
                    value={mainEventMaxCount}
                    onChange={handleMainEventMaxCountChange}
                    variant="outlined"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    inputProps={{
                      min: totalAttendeesCount > 0 ? totalAttendeesCount : 1,
                      pattern: "[0-9]*",
                      inputMode: "numeric",
                    }}
                    size="small"
                  />
                )}
              </div>
              <div style={{ flex: "0 0 calc(50% - 8px)" }}>
                {eventId && formValue?.afterPartyStatus === "ENABLED" && (
                  <>
                    <Text typo="body1" style={{ marginBottom: "8px" }}>
                      뒤풀이 인원 제한
                    </Text>
                    <Flex gap="sm" style={{ marginBottom: "8px", justifyContent: "left" }}>
                      <label>
                        <input
                          type="radio"
                          name="afterPartyLimit"
                          checked={!afterPartyLimitEnabled}
                          onChange={() => setAfterPartyLimitEnabled(false)}
                          style={{ marginRight: "4px" }}
                        />
                        없음
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="afterPartyLimit"
                          checked={afterPartyLimitEnabled}
                          onChange={() => setAfterPartyLimitEnabled(true)}
                          style={{ marginRight: "4px" }}
                        />
                        있음
                      </label>
                    </Flex>

                    {afterPartyLimitEnabled && (
                      <TextField
                        label="제한 인원"
                        placeholder="제한 인원(20)"
                        value={afterPartyMaxCount}
                        onChange={handleAfterPartyMaxCountChange}
                        variant="outlined"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        inputProps={{
                          min: totalAttendeesCount > 0 ? totalAttendeesCount : 1,
                          pattern: "[0-9]*",
                          inputMode: "numeric",
                        }}
                        size="small"
                      />
                    )}
                  </>
                )}
              </div>
            </Flex>
            <Flex direction="column" align="flex-start">
              <Text typo="body1" style={{ marginBottom: "8px" }}>
                행사 설명
              </Text>
              <textarea
                placeholder="행사 신청 설명을 입력해주세요"
                value={description ?? ""}
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
                  "backgroundColor": "white",
                  "&:focus": {
                    outline: "none",
                    borderColor: "#1976d2",
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                  },
                })}
              />
            </Flex>
          </Flex>
          <Button
            onClick={handleSave}
            size="sm"
            disabled={
              eventId
                ? updateBasicInfoMutation.isPending || !hasChanges()
                : createEventMutation.isPending || !isCreationValid
            }
          >
            {eventId ? "저장하기" : "게시하기"}
          </Button>
        </Flex>
      </div>
    </>
  );
};
const formItemStyle: CSSProperties = {
  flex: "0 0 calc(50% - 20px)",
  boxSizing: "border-box",
};
