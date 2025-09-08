import { CSSProperties, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { TextField } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { color, space } from "wowds-tokens";
import Button from "wowds-ui/Button";
import DropDown from "wowds-ui/DropDown";
import DropDownOption from "wowds-ui/DropDownOption";
import { Flex } from "@/components/@common/Flex";
import { Space } from "@/components/@common/Space";
import { Text } from "@/components/@common/Text";
import { EventType } from "@/types/dtos/event";

const parseISO = (s?: string): Date | undefined => (s ? new Date(s) : undefined);
const toISOOrEmpty = (d?: Date) => (d ? d.toISOString() : "");

export const EventInformation = ({
  formValue,
  setFormValues,
}: {
  formValue: EventType | null;
  setFormValues: (value: React.SetStateAction<EventType | null>) => void;
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
              startDate: toISOOrEmpty(selectedRange?.from),
              endDate: toISOOrEmpty(selectedRange?.to),
            },
            startAt: toISOOrEmpty(selectedEventDate),
            mainEventMaxApplicantCount: mainEventLimitEnabled
              ? parseInt(mainEventMaxCount) || 0
              : 0,
            afterPartyMaxApplicantCount: afterPartyLimitEnabled
              ? parseInt(afterPartyMaxCount) || 0
              : 0,
          }
        : prev,
    );
  };
  console.log(formValue, "formValue");
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
              style={{ ...formItemStyle }}
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Flex gap="sm" style={{ flex: "0 0 calc(33.33 - 8px)" }}>
                <DatePicker
                  label="신청 시작일"
                  value={selectedRange?.from ? dayjs(selectedRange.from) : null}
                  onChange={newValue => {
                    const newRange = {
                      from: newValue?.toDate(),
                      to: selectedRange?.to,
                    };
                    setSelectedRange(newRange);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { backgroundColor: "white" },
                    },
                  }}
                />
                <DatePicker
                  label="신청 종료일"
                  value={selectedRange?.to ? dayjs(selectedRange.to) : null}
                  onChange={newValue => {
                    const newRange = {
                      from: selectedRange?.from,
                      to: newValue?.toDate(),
                    };
                    setSelectedRange(newRange);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { backgroundColor: "white" },
                    },
                  }}
                />
              </Flex>
            </LocalizationProvider>
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                  value={selectedEventDate ? dayjs(selectedEventDate) : null}
                  onChange={newValue => {
                    const newDate = newValue?.toDate();
                    setSelectedEventDate(newDate);
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

const textFieldStyle3: CSSProperties = {
  flex: "0 0 calc(50% - 20px)",
  boxSizing: "border-box",
  justifyContent: "left",
};
