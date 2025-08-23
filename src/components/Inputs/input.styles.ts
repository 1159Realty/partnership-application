"use client";
import { COLORS } from "@/utils/colors";
import styled from "@emotion/styled";

// File Upload
export const FileUploadWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  height: 56px;
  width: 100%;
  background-color: ${COLORS.gray50};
  border-radius: 4px;
  border: 1px dashed ${COLORS.gray400};
  position: relative;
  cursor: pointer;
`;

export const FileUploadPreviewWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  height: 56px;
  width: 100%;
  background-color: ${COLORS.gray50};
  border-radius: 4px;
  position: relative;
  padding: 8px;
  margin-top: 16px;
  background-color: ${COLORS.gray100};
  word-wrap: break-word;
  word-break: break-word;
  overflow: hidden;

  img {
    width: 40px;
    height: 40px;
    border-radius: 2px;
    object-fit: cover;
  }
`;

// Search
export const SearchWrapper = styled.div`
  display: flex;
  /* position: relative; */
  flex-direction: row;
  align-items: center;
  background: ${COLORS.gray200};
  border-radius: 10px;
  border-radius: 23px;
  padding: 0 20px;
  width: 100%;

  svg {
    color: "#49454F";
  }

  input {
    resize: none;
    flex-grow: 1;
    display: flex;
    width: 100%;
    height: 46px;
    outline: none;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    border: none;
    transition: all 0.2s;
    background-color: transparent;

    &::-webkit-scrollbar {
      width: 0;
      display: none;
    }
    &::placeholder {
      color: ${COLORS.gray500};
    }
  }
`;

// Autocomplete

export const RoundedAutoCompleteWrapper = styled.span`
  border-radius: 0;
  label {
    margin-top: -5px;
  }
  input {
    padding: 5px 10px !important;
  }

  .MuiAutocomplete-inputRoot {
    border-radius: 50px;
    padding: 5px 10px !important;
  }

  .Mui-focused,
  .Mui-focusVisible,
  .MuiAutocomplete-inputFocused,
  .MuiAutocomplete-inputRoot,
  .MuiAutocomplete-root,
  .MuiInput-root {
    border: none;
  }

  .MuiOutlinedInput-notchedOutline {
    border: 1.5px solid black;
  }
`;

// Select

export const RoundedSelectWrapper = styled.div`
  border-radius: 0;
  label {
    margin-top: -5px;
  }

  .MuiSelect-outlined,
  .MuiSelect-root {
    border-radius: 50px;
    padding: 5px 10px !important;
  }

  .Mui-focused,
  .Mui-focusVisible,
  .MuiSelect-root,
  .MuiSelect-outlined,
  .MuiInput-root {
    border: none;
  }

  fieldset {
    border: 2px solid;
  }
`;
