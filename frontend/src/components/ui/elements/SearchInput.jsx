import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const normalizeString = (str) =>
  (str || "")
    .toString()
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();

function SearchInput({
  id,
  ref,
  className,
  options,
  value,
  onChange,
  isInvalid = false,
}) {
  const [inputValue, setInputValue] = useState("");

  const filterOptions = (options, { inputValue }) => {
    const normalizedInput = normalizeString(inputValue);
    return options.filter((option) =>
      normalizeString(option).includes(normalizedInput)
    );
  };

  return (
    <Autocomplete
      id={id}
      className={className}
      options={options}
      value={value}
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={(ev, newValue) => {
        setInputValue(newValue);
      }}
      filterOptions={filterOptions}
      autoHighlight
      sx={{
        "& .MuiAutocomplete-option[data-focus='true']": {
          backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
        "& .MuiAutocomplete-option[aria-selected='true']": {
          backgroundColor: "rgba(0, 0, 0, 0.12)",
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={ref}
          error={isInvalid}
          label={undefined}
          slotProps={{
            input: {
              ...params.InputProps,
              type: "search",
            },
          }}
        />
      )}
    />
  );
}

export default SearchInput;
