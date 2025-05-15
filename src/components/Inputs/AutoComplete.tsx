import { MobileCap2MGray500 } from "@/utils/typography";
import {
  AutocompleteProps,
  Box,
  CircularProgress,
  Autocomplete as MuiAutocomplete,
  TextField,
  TextFieldVariants,
} from "@mui/material";
import { RoundedAutoCompleteWrapper } from "./input.styles";

interface Props<T> extends Omit<AutocompleteProps<T, boolean, boolean, boolean>, "renderInput"> {
  renderInputLabel?: string;
}

const AutoComplete = <T,>({ renderInputLabel, loading, ...etc }: Props<T>) => {
  return (
    <MuiAutocomplete
      disablePortal
      loading={loading}
      {...etc}
      renderInput={(params) => (
        <TextField
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
          {...params}
          label={renderInputLabel}
        />
      )}
    />
  );
};

interface AutoCompleteWithSubOptions {
  label: string;
  id: string;
  sub?: string;
}

interface AutoCompleteWithSubProps<T> extends Omit<AutocompleteProps<T, boolean, boolean, boolean>, "renderInput"> {
  renderInputLabel?: string;
  textFieldVariants?: TextFieldVariants;
}

function AutoCompleteWithSub({
  renderInputLabel,
  textFieldVariants,
  loading,
  ...etc
}: AutoCompleteWithSubProps<AutoCompleteWithSubOptions>) {
  return (
    <MuiAutocomplete
      disablePortal
      loading={loading}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
      filterOptions={(x) => x}
      renderOption={(props, option) => {
        return (
          <Box sx={{ display: "block!important", mb: "3px" }} {...props} component="li" key={option.id}>
            <div>{option.label}</div>
            <MobileCap2MGray500>{option.sub}</MobileCap2MGray500>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          variant={textFieldVariants}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
          {...params}
          label={renderInputLabel}
        />
      )}
      {...etc}
    />
  );
}
function RoundedAutoCompleteWithSub({
  renderInputLabel,
  textFieldVariants,
  loading,
  ...etc
}: AutoCompleteWithSubProps<AutoCompleteWithSubOptions>) {
  return (
    <RoundedAutoCompleteWrapper>
      <MuiAutocomplete
        disablePortal
        loading={loading}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
        filterOptions={(x) => x}
        renderOption={(props, option) => {
          return (
            <Box sx={{ display: "block!important", mb: "3px" }} {...props} component="li" key={option.id}>
              <div>{option.label}</div>
              <MobileCap2MGray500>{option.sub}</MobileCap2MGray500>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            variant={textFieldVariants}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
            {...params}
            label={renderInputLabel}
          />
        )}
        {...etc}
      />
    </RoundedAutoCompleteWrapper>
  );
}

export { AutoComplete, AutoCompleteWithSub, RoundedAutoCompleteWithSub };
export type { AutoCompleteWithSubOptions };
