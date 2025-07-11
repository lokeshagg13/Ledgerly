import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

function getStyles(optionValue, selectedValues, theme) {
  return {
    fontWeight: selectedValues.includes(optionValue)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

function MultiSelector({
  label,
  name,
  options = [],
  value = [],
  onChange,
  className,
}) {
  const theme = useTheme();

  const handleChange = (event) => {
    const selected =
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value;
    onChange(selected);
  };

  return (
    <FormControl
      className={className ? className : undefined}
      sx={{
        m: 1,
        width: 300,
      }}
    >
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={`${name}-select`}
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput id={`${name}-input`} label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((val) => {
              const matched = options.find((opt) => opt.value === val);
              return <Chip key={val} label={matched?.label || val} />;
            })}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            value={opt.value}
            style={getStyles(opt.value, value, theme)}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MultiSelector;
