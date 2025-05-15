"use client";

import { Box, capitalize } from "@mui/material";
import { SetState } from "@/utils/global-types";
import { ROLE_PAIR } from "@/lib/session/roles";
import { RoundedSelect, Search } from "../Inputs";
import { FilterFlexWrappers } from "./filters.styles";

export interface ITeamFilter {
  roleId?: string;
}

interface Props {
  filters: ITeamFilter;
  setFilters: SetState<ITeamFilter>;
  setQuery: SetState<string>;
  query: string;
}

const TeamFilters = ({ setFilters, setQuery, query, filters }: Props) => {
  const roles = Object.entries(ROLE_PAIR)
    .filter(([, role]) => role !== "admin" && role !== "client")
    .map(([key, role]) => ({ [role]: key }));

  function handleChange(field: keyof ITeamFilter, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <Box>
      <FilterFlexWrappers>
        <Box flexGrow={1} maxWidth={450}>
          <Search
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </Box>

        <Box width={"90%"} maxWidth={"200px"}>
          <RoundedSelect
            label="Role filter"
            items={[
              ...roles.map((x) => {
                const [key, value] = Object.entries(x)[0];
                return {
                  label: capitalize(key),
                  id: value,
                };
              }),
              { label: "All", id: "" },
            ]}
            onChange={(e) => {
              handleChange("roleId", e.target.value as string);
            }}
            value={filters?.roleId}
          />
        </Box>
      </FilterFlexWrappers>
    </Box>
  );
};

export { TeamFilters };
