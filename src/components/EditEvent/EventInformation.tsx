import { CSSProperties, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { TextField } from "@mui/material";
import { color, space } from "wowds-tokens";
import DropDown from "wowds-ui/DropDown";
import DropDownOption from "wowds-ui/DropDownOption";
import PickerGroup from "wowds-ui/PickerGroup";
import RangeDatePicker from "wowds-ui/RangeDatePicker";
import DatePicker from "wowds-ui/SingleDatePicker";
import TimePicker from "wowds-ui/TimePicker";
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
    } else {
      setSelectedRange(undefined);
      setSelectedEventDate(undefined);
      setVenue("");
      setTitle("");
      setMainEventMaxCount("");
      setAfterPartyMaxCount("");
    }
  }, [formValue]);

  const handleVenueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVenue(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    // setFormValues(prev => (prev ? { ...prev, name: event.target.value } : prev));
  };

  const handleMainEventMaxCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMainEventMaxCount(event.target.value);
  };

  const handleAfterPartyMaxCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAfterPartyMaxCount(event.target.value);
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
        <Flex justify="start" style={{ flexWrap: "wrap" }} gap="sm">
          <TextField
            label="행사이름"
            placeholder="행사 이름을 입력해주세요"
            style={formItemStyle}
            value={title}
            onChange={handleTitleChange}
            variant="outlined"
            fullWidth
          />

          <DropDown
            label="신청범위"
            placeholder="신청 범위를 선택해주세요"
            style={formItemStyle}
            value={formValue?.regularRoleOnlyStatus === "ENABLED" ? "only-member" : "everyone"}
            onChange={value =>
              setFormValues(prev =>
                prev
                  ? {
                      ...prev,
                      regularRoleOnlyStatus:
                        value.selectedValue === "only-member" ? "ENABLED" : "DISABLED",
                    }
                  : prev,
              )
            }
          >
            <DropDownOption value="only-member" text="정회원만 신청 가능" />
            <DropDownOption value="everyone" text="모두 신청 가능" />
          </DropDown>
          <RangeDatePicker
            label="행사 신청 기간"
            selected={selectedRange}
            onSelect={range => {
              setSelectedRange({
                from: range?.from,
                to: range?.to,
              });

              // 2) 서버 DTO도 함께 업데이트
              setFormValues(prev =>
                prev
                  ? {
                      ...prev,
                      applicationPeriod: {
                        startDate: toISOOrEmpty(range?.from),
                        endDate: toISOOrEmpty(range?.to),
                      },
                    }
                  : prev,
              );
            }}
            style={formItemStyle}
          />
          <TextField
            value={venue}
            onChange={handleVenueChange}
            label="행사 장소"
            placeholder="행사 장소를 입력해주세요"
            style={formItemStyle}
            variant="outlined"
            fullWidth
          />
          <PickerGroup
            selectedDate={selectedEventDate}
            setSelectedDate={date => {
              setSelectedEventDate(date);
              setFormValues(prev => (prev ? { ...prev, startAt: toISOOrEmpty(date) } : prev));
            }}
            label=""
          >
            <DatePicker label="행사 진행 날짜" />
            <TimePicker label="행사 진행 시간" />
          </PickerGroup>
          <TextField
            label="행사 인원 제한"
            placeholder="제한 인원(20)"
            style={formItemStyle}
            value={mainEventMaxCount}
            onChange={handleMainEventMaxCountChange}
            variant="outlined"
            fullWidth
            type="number"
          />
          <TextField
            label="뒷풀이 인원 제한"
            placeholder="제한 인원(20)"
            style={formItemStyle}
            value={afterPartyMaxCount}
            onChange={handleAfterPartyMaxCountChange}
            variant="outlined"
            fullWidth
            type="number"
          />
        </Flex>
      </div>
    </>
  );
};
const formItemStyle: CSSProperties = {
  flex: "0 0 calc(50% - 8px)",
  boxSizing: "border-box",
};
