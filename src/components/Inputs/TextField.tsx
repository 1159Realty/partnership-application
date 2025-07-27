"use client";
import {
  TextField as MuiTextField,
  TextFieldProps,
  BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import "react-international-phone/style.css";
import { CountryIso2, defaultCountries, FlagImage, parseCountry, usePhoneInput } from "react-international-phone";

const TextField = ({ ...props }: TextFieldProps) => {
  return <MuiTextField variant="outlined" fullWidth {...props} />;
};

export interface MUIPhoneProps extends BaseTextFieldProps {
  value: string;
  onChange: (phone: string) => void;
}

const PhoneNumberInput: React.FC<MUIPhoneProps> = ({ value, onChange, ...restProps }) => {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
    defaultCountry: "us",
    value,
    countries: defaultCountries,
    onChange: (data) => {
      onChange(data.phone);
    },
  });

  return (
    <TextField
      variant="outlined"
      label="Phone number"
      color="primary"
      placeholder="Phone number"
      value={inputValue}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" style={{ marginRight: "2px", marginLeft: "-8px" }}>
            <Select
              MenuProps={{
                style: {
                  height: "300px",
                  width: "360px",
                  top: "10px",
                  left: "-34px",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
              }}
              sx={{
                width: "max-content",
                // Remove default outline (display only on focus)
                fieldset: {
                  display: "none",
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: "block",
                  },
                },
                // Update default spacing
                ".MuiSelect-select": {
                  padding: "8px",
                  paddingRight: "24px !important",
                },
                svg: {
                  right: 0,
                },
              }}
              value={country.iso2}
              onChange={(e) => setCountry(e.target.value as CountryIso2)}
              renderValue={(value) => <FlagImage iso2={value} style={{ display: "flex" }} />}
            >
              {defaultCountries.map((c) => {
                const country = parseCountry(c);
                return (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    <FlagImage iso2={country.iso2} style={{ marginRight: "8px" }} />
                    <Typography marginRight="8px">{country.name}</Typography>
                    <Typography color="gray">+{country.dialCode}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
  );
};

const NumericInput = ({ ...props }: TextFieldProps) => {
  return (
    <NumericFormat
      customInput={TextField}
      thousandSeparator={","}
      allowNegative={false}
      valueIsNumericString
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    />
  );
};

export { TextField, PhoneNumberInput, NumericInput };
