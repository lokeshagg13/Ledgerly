import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getLocalDateString } from "../../utils/dateUtils";

function FormDatePicker({
  name,
  id,
  value,
  onChange,
  minDate,
  maxDate,
  isInvalid = false,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        name={name}
        id={id}
        value={value ? dayjs(value) : null}
        onChange={(newValue) =>
          onChange({
            target: {
              name,
              value: newValue ? getLocalDateString(newValue) : null,
            },
          })
        }
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        format="DD/MM/YYYY"
        slotProps={{
          textField: { size: "small", fullWidth: true, error: isInvalid },
        }}
      />
    </LocalizationProvider>
  );
}

export default FormDatePicker;
