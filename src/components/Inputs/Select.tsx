"use client";

import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select as MuiSelect, Stack, SelectProps } from "@mui/material";
import { DotOutline } from "@phosphor-icons/react/dist/ssr";
import { RoundedSelectWrapper } from "./input.styles";

interface SelectItemType {
  id: string | undefined;
  label: string;
}

interface Props {
  items: SelectItemType[];
}

function Select({ label, items, ...etc }: Props & SelectProps) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} {...etc}>
        {items?.map((i) => (
          <MenuItem key={i.id} value={i.id}>
            {i.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}

interface SelectWithStatusType {
  id: string;
  label: string;
  status: string;
}

interface SelectWithStatusProps {
  items: SelectWithStatusType[];
}

function SelectWithStatus({ label, items, ...etc }: SelectWithStatusProps & SelectProps) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} {...etc}>
        {items?.map((i) => (
          <MenuItem key={i.id} value={i.id}>
            <Stack direction={"row"} alignItems={"center"}>
              <DotOutline size={30} weight="fill" color={i.status} /> <span>{i.label}</span>
            </Stack>
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}

function RoundedSelect({ label, items, ...etc }: Props & SelectProps) {
  return (
    <RoundedSelectWrapper>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <MuiSelect label={label} {...etc}>
          {items?.map((i) => (
            <MenuItem key={i.id} value={i.id}>
              {i.label}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    </RoundedSelectWrapper>
  );
}

export { Select, SelectWithStatus, RoundedSelect };
