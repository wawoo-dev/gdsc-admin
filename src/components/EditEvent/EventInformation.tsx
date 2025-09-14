import { CSSProperties, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { TextField } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { AdapterDayjs as AdapterDayjsPro } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { LocalizationProvider as LocalizationProviderPro } from "@mui/x-date-pickers-pro/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");
import { color, space } from "wowds-tokens";
import Button from "wowds-ui/Button";
import DropDown from "wowds-ui/DropDown";
import DropDownOption from "wowds-ui/DropDownOption";
import { Flex } from "@/components/@common/Flex";
import { Space } from "@/components/@common/Space";
import { Text } from "@/components/@common/Text";
import { EventType } from "@/types/dtos/event";

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
}: {
  formValue: EventType | null;
  setFormValues: (value: React.SetStateAction<EventType | null>) => void;
  eventId?: number;
}) => {
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
    (formValue?.mainEventMaxApplicantCount || 0) > 0,
  );
  const [afterPartyLimitEnabled, setAfterPartyLimitEnabled] = useState<boolean>(
    (formValue?.afterPartyMaxApplicantCount || 0) > 0,
  );

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
      setVenue(formValue.venue);
      setTitle(formValue.name);
      setMainEventMaxCount(formValue.mainEventMaxApplicantCount?.toString() || "");
      setAfterPartyMaxCount(formValue.afterPartyMaxApplicantCount?.toString() || "");
      setRegularRoleOnlyStatus(formValue.regularRoleOnlyStatus);
      setMainEventLimitEnabled((formValue.mainEventMaxApplicantCount || 0) > 0);
      setAfterPartyLimitEnabled((formValue.afterPartyMaxApplicantCount || 0) > 0);
    } else {
      setSelectedRange(undefined);
      setSelectedEventDate(undefined);
      setVenue("");
      setTitle("");
      setMainEventMaxCount("");
      setAfterPartyMaxCount("");
      setRegularRoleOnlyStatus("DISABLED");
      setMainEventLimitEnabled(false);
      setAfterPartyLimitEnabled(false);
    }
  }, [formValue]);

  const handleVenueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVenue(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleMainEventMaxCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMainEventMaxCount(event.target.value);
  };

  const handleAfterPartyMaxCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAfterPartyMaxCount(event.target.value);
  };

  const handleSave = () => {
    setFormValues(prev =>
      prev
        ? {
            ...prev,
            name: title,
            venue: venue,
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
  console.log(formValue, "formValue");
  console.log(isApplicationInPeriod(), "isApplicationPeriodExpired");
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
        <Flex justify="start" align="start" style={{ flexWrap: "wrap" }} gap="lg">
          {/* 행사 이름 - 신청 범위 */}
          <Flex
            gap="sm"
            justify="start"
            align="start"
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
            <LocalizationProviderPro dateAdapter={AdapterDayjsPro} adapterLocale="ko">
              <DateRangePicker
                value={[
                  selectedRange?.from ? dayjs(selectedRange.from) : null,
                  selectedRange?.to ? dayjs(selectedRange.to) : null,
                ]}
                calendars={1}
                label="행사 신청 기간"
                onChange={newValue => {
                  const [startDate, endDate] = newValue || [null, null];

                  const processedStartDate = startDate?.toDate();
                  const processedEndDate = endDate?.toDate();

                  if (processedStartDate) {
                    // 시작일 시간을 00:00:00으로 설정
                    processedStartDate.setHours(0, 0, 0, 0);
                  }

                  if (processedEndDate) {
                    // 종료일 시간을 23:59:59로 설정
                    processedEndDate.setHours(23, 59, 59, 0);
                  }

                  setSelectedRange({
                    from: processedStartDate,
                    to: processedEndDate,
                  });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { backgroundColor: "white" },
                  },
                }}
              />
            </LocalizationProviderPro>
            <TextField
              value={venue}
              onChange={handleVenueChange}
              label="행사 장소"
              placeholder="행사 장소를 입력해주세요"
              style={{ flex: "0 0 calc(33.33% - 8px)", backgroundColor: "white" }}
              variant="outlined"
              fullWidth
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
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { backgroundColor: "white" },
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
                  type="number"
                  style={{ backgroundColor: "white" }}
                  inputProps={{ min: 1 }}
                />
              )}
            </div>
            <div style={{ flex: "0 0 calc(50% - 8px)" }}>
              <Text typo="body1" style={{ marginBottom: "8px" }}>
                뒷풀이 인원 제한
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
                  type="number"
                  style={{ backgroundColor: "white" }}
                  inputProps={{ min: 1 }}
                />
              )}
            </div>
          </Flex>
        </Flex>
        <Button onClick={handleSave} size="sm">
          저장
        </Button>
      </div>
    </>
  );
};
const formItemStyle: CSSProperties = {
  flex: "0 0 calc(50% - 20px)",
  boxSizing: "border-box",
};
