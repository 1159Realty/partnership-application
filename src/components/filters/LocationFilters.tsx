"use client";

import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { FadersHorizontal } from "@phosphor-icons/react/dist/ssr";
import { FilterFieldsWrapper, FilterFlexWrappers, FilterHeader, FilterIconContainer } from "./filters.styles";
import { MobileB2MGray900, MobileH1SMGray900 } from "@/utils/typography";
import { HiddenOnMobile } from "@/styles/globals.styles";
import { AutoComplete, Search } from "@/components/Inputs";
import { Button } from "@/components/buttons";
import { Drawer } from "../drawer";
import { ILga, IState } from "@/lib/api/location/location.types";
import { useLocation } from "@/lib/api/location/useLocation";
import { SetState } from "@/utils/global-types";
import { objectHasValue } from "@/services/objects";

export interface ILocationFilter {
  stateId?: string;
  lgaId?: string;
}

interface Props {
  states: IState[] | null;
  setFilters: SetState<ILocationFilter>;
  filters: ILocationFilter;
  setQuery: SetState<string>;
  query: string;
}

const LocationFilters = ({ states, setFilters, filters, setQuery, query }: Props) => {
  const { fetchLgas } = useLocation();

  const [showFilters, setShowFilters] = useState(false);
  const [lgas, setLgas] = useState<ILga[] | null>([]);
  const [localFilters, setLocalFilters] = useState<ILocationFilter>({});

  const is_active = objectHasValue(filters) ? "active" : "in-active";

  const onClose = () => {
    setShowFilters(false);
  };

  const handleShow = () => {
    setShowFilters(true);
  };

  function handleChange(field: keyof ILocationFilter, value: unknown) {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  }

  const handleClearFilters = () => {
    setFilters({});
    setLocalFilters({});
  };

  const handleFilter = () => {
    setFilters(localFilters);
    onClose();
  };

  useEffect(() => {
    async function populateLgas() {
      if (!localFilters?.stateId) return;
      const response = await fetchLgas(localFilters.stateId);
      setLgas(response);
    }

    populateLgas();
  }, [fetchLgas, localFilters?.stateId]);

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

        <FilterIconContainer is_active={is_active} onClick={handleShow}>
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
            <AutoComplete
              fullWidth
              options={(states || []).map((s) => ({ label: s.state, id: s.id }))}
              renderInputLabel="State"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(_, value: any) => {
                if (value.id) {
                  handleChange("stateId", value.id);
                }
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onInputChange={(_, value: any) => {
                if (!value) {
                  handleChange("stateId", undefined);
                }
              }}
              value={(states || []).find((s) => s.id === localFilters.stateId)?.state || ""}
            />
            <AutoComplete
              fullWidth
              options={(lgas || []).map((lga) => ({ label: lga.lga, id: lga.id }))}
              renderInputLabel="Lga"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(_, value: any) => {
                if (value.id) {
                  handleChange("lgaId", value.id);
                }
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onInputChange={(_, value: any) => {
                if (!value) {
                  handleChange("lgaId", "");
                }
              }}
              value={(lgas || []).find((lga) => lga.id === localFilters.lgaId)?.lga || ""}
            />
          </FilterFieldsWrapper>
          <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} spacing={"10px"}>
            <Button
              fullWidth
              onClick={handleClearFilters}
              color="secondary"
              variant="outlined"
              // not_rounded
            >
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

export { LocationFilters };
