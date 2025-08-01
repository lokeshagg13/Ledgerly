import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function FilterDatePicker({
  label,
  name,
  value,
  onChange,
  minDate,
  maxDate,
  isInvalid = false,
  disabled = false,
  paddedCalendar = false,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        name={name}
        value={value ? dayjs(value) : null}
        onChange={onChange}
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        format="DD/MM/YYYY"
        disabled={disabled}
        slotProps={{
          textField: {
            size: "small",
            fullWidth: true,
            error: isInvalid,
            InputProps: paddedCalendar
              ? {
                  style: {
                    paddingRight: value ? "2rem" : null,
                  },
                }
              : null,
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default FilterDatePicker;
