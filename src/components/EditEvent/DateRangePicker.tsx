import styled from "@emotion/styled";
import { Popover, TextField } from "@mui/material";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const StyledDayPicker = styled(DayPicker)`
  .rdp-chevron {
    width: 18px;
    height: 18px;
    fill: rgba(0, 0, 0, 0.54);
  }
  .rdp-nav {
    inset-block-start: 10px;
  }
  .rdp-month_caption {
    font-size: 16px;
    font-weight: 500;
    padding-left: 12px;
  }
  .rdp-month {
    padding: 10px 8px 20px 8px;
  }
  .rdp-month_grid {
    width: 252px;
  }
  .rdp-weekday {
    font-size: 0.75rem;
    font-weight: 400;
    width: 36px;
    height: 40px;
  }
  .rdp-day {
    width: 40px;
    height: 40px;
    font-size: 0.75rem;
    font-weight: 400;
  }
  .rdp-range_end:not(.rdp-range_start) {
    background: linear-gradient(-90deg, transparent 50%, #2196f31e 50%);
  }
  .rdp-range_start:not(.rdp-range_end) {
    background: linear-gradient(90deg, transparent 50%, #2196f31e 50%);
  }
  .rdp-range_start > .rdp-day_button,
  .rdp-range_end > .rdp-day_button {
    background-color: #2196f3 !important;
    color: #ffffff !important;
    border: none !important;
  }
  .rdp-today > .rdp-day_button {
    border: 1px solid rgba(0, 0, 0, 0.6);
    color: #000000de;
  }
  .rdp-range_middle {
    background-color: #2196f31e;
  }
  .rdp-day_button {
    border-radius: 50%;
    &:hover {
      border: 1px solid rgb(158, 158, 158);
      background-color: rgba(33, 150, 243, 0.04);
    }
  }
`;

interface DateRangePickerProps {
  value?: { from: Date | undefined; to?: Date };
  onChange: (range: { from: Date | undefined; to?: Date } | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = () => {
    setAnchorEl(inputRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatDateRange = () => {
    if (!value?.from) return "";
    if (!value?.to) {
      return format(value.from, "yyyy.MM.dd.", { locale: ko });
    }
    return `${format(value.from, "yyyy.MM.dd.", { locale: ko })} - ${format(value.to, "yyyy.MM.dd.", { locale: ko })}`;
  };

  return (
    <>
      <TextField
        ref={inputRef}
        value={formatDateRange()}
        onClick={handleClick}
        label={"행사 신청 기간"}
        InputProps={{
          readOnly: true,
        }}
        style={{ backgroundColor: "white" }}
        variant="outlined"
        fullWidth
        size="small"
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <StyledDayPicker
          mode="range"
          selected={value}
          onSelect={range => {
            // 기간이 선택되어있을 때 새로운 날짜 클릭 시 시작일부터 다시 선택하도록
            if (value?.from && value?.to && range?.from) {
              const clickedDate =
                range.from.getTime() !== value.from.getTime() ? range.from : range.to;

              onChange({ from: clickedDate, to: undefined });
              return;
            }

            onChange(range);

            if (range?.from && range?.to) {
              handleClose();
            }
          }}
          locale={ko}
        />
      </Popover>
    </>
  );
}
