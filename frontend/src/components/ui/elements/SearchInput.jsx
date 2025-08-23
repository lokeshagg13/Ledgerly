import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

function SearchInput({ id, className, options, value, onChange }) {
  const [inputValue, setInputValue] = useState("");
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
      renderInput={(params) => (
        <TextField
          {...params}
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
