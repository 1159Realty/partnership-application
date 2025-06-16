"use client";

import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import { FadersHorizontal } from "@phosphor-icons/react/dist/ssr";
import { FilterFieldsWrapper, FilterFlexWrappers, FilterHeader, FilterIconContainer } from "./filters.styles";
import { MobileB2MGray900, MobileH1SMGray900 } from "@/utils/typography";
import { HiddenOnMobile } from "@/styles/globals.styles";
import { Button } from "@/components/buttons";
import { Drawer } from "../drawer";
import { SetState } from "@/utils/global-types";
import { objectHasValue } from "@/services/objects";
import { Search, Select, TextField } from "../Inputs";
import { months } from "@/utils/constants";
import { AGENT_PERFORMANCE_TOTAL_TYPES } from "@/lib/api/commission/types";
import { capitalizeAndSpace } from "@/services/string";

export interface IAgentsPerformanceFilter {
  totalType?: string;
  year?: string;
  month?: string;
}

interface Props {
  setFilters: SetState<IAgentsPerformanceFilter>;
  filters: IAgentsPerformanceFilter;
  setQuery: SetState<string>;
  query: string;
}

const AgentsPerformanceFilter = ({ setFilters, filters, setQuery, query }: Props) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<IAgentsPerformanceFilter>({});

  const isFilterActive = objectHasValue(filters);

  const onClose = () => {
    setShowFilters(false);
  };

  const handleShow = () => {
    setShowFilters(true);
  };

  function handleChange(field: keyof IAgentsPerformanceFilter, value: unknown) {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  }

  const handleClearFilters = () => {
    setFilters({});
    setLocalFilters({});
  };

  const handleFilter = () => {
    const payload: IAgentsPerformanceFilter = localFilters;

    setFilters(payload);
    onClose();
  };

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
        <FilterIconContainer is_active={isFilterActive ? "active" : "in-active"} onClick={handleShow}>
          <HiddenOnMobile>
            <MobileB2MGray900>Filter</MobileB2MGray900>
          </HiddenOnMobile>
          <FadersHorizontal weight="bold" size={18} />
        </FilterIconContainer>
      </FilterFlexWrappers>

      <Drawer isOpen={showFilters} handleClose={onClose}>
        <Box mt="40px" mb="24px" px="16px">
          <FilterHeader>
            <MobileH1SMGray900>Filters</MobileH1SMGray900>
          </FilterHeader>
          <FilterFieldsWrapper>
            <Select
              fullWidth
              label="Sort by"
              items={[
                { label: "None", id: "" },
                ...AGENT_PERFORMANCE_TOTAL_TYPES.map((x) => ({
                  label: capitalizeAndSpace(x),
                  id: x.replaceAll("_", ""),
                })),
              ]}
              onChange={(e) => {
                handleChange("totalType", e.target.value);
              }}
              value={localFilters?.totalType}
            />

            <Select
              fullWidth
              label="Month"
              items={[
                { label: "None", id: "" },
                ...months.map((x) => ({
                  id: x,
                  label: x,
                })),
              ]}
              onChange={(e) => {
                handleChange("month", e.target.value);
              }}
              value={localFilters?.month}
            />
            <TextField onChange={(e) => handleChange("year", e.target.value)} value={localFilters?.year} placeholder="Year" />
          </FilterFieldsWrapper>

          <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} spacing={"10px"}>
            <Button fullWidth onClick={handleClearFilters} color="secondary" variant="outlined">
              Clear
            </Button>
            <Button fullWidth onClick={handleFilter} color="secondary" variant="contained">
              Apply
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

export { AgentsPerformanceFilter };
