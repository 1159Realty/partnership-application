"use client";

import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { FadersHorizontal } from "@phosphor-icons/react/dist/ssr";
import { FilterFieldsWrapper, FilterFlexWrappers, FilterHeader, FilterIconContainer } from "./filters.styles";
import { MobileB2MGray900, MobileH1SMGray900 } from "@/utils/typography";
import { HiddenOnMobile } from "@/styles/globals.styles";
import { AutoComplete, AutoCompleteWithSub, AutoCompleteWithSubOptions, Search, Select } from "@/components/Inputs";
import { Button } from "@/components/buttons";
import { Drawer } from "../drawer";
import { IArea, ILga, IState } from "@/lib/api/location/location.types";
import { useLocation } from "@/lib/api/location/useLocation";
import { SetState } from "@/utils/global-types";
import { PaginatedResponse } from "@/lib/api/api.types";
import { User } from "@/lib/api/user/user.types";
import { useUser } from "@/lib/api/user/useUser";
import { useDebounce } from "use-debounce";
import { capitalizeAndSpace, getUserName } from "@/services/string";
import { IProperty } from "@/lib/api/property/property.types";
import { useProperty } from "@/lib/api/property/useProperty";
import { AppointmentStatus, appointmentStatusArray } from "@/lib/api/appointment/appointment.types";
import { objectHasValue } from "@/services/objects";

export interface IAppointmentManagementFilter {
  propertyId?: string;
  userId?: string;
  stateId?: string;
  lgaId?: string;
  areaId?: string;
  status?: AppointmentStatus;
}
interface ILocalFilter {
  propertyId?: AutoCompleteWithSubOptions;
  userId?: AutoCompleteWithSubOptions;
  stateId?: string;
  lgaId?: string;
  areaId?: string;
  status?: AppointmentStatus;
}

interface Props {
  states: IState[] | null;
  setFilters: SetState<IAppointmentManagementFilter>;
  filters: IAppointmentManagementFilter;
  setQuery: SetState<string>;
  query: string;
}

const AppointmentManagementFilters = ({ states, setFilters, filters, setQuery: setSearchQuery, query: searchQuery }: Props) => {
  const { fetchLgas, fetchAreas } = useLocation();
  const { fetchUsers } = useUser();
  const { fetchProperties } = useProperty();

  const [showFilters, setShowFilters] = useState(false);
  const [lgas, setLgas] = useState<ILga[] | null>([]);
  const [areas, setAreas] = useState<IArea[] | null>(null);
  const [localFilters, setLocalFilters] = useState<ILocalFilter>({});

  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [debouncedUserQuery] = useDebounce(userQuery, 700);

  const [properties, setProperties] = useState<PaginatedResponse<IProperty> | null>(null);
  const [propertyQuery, setPropertyQuery] = useState("");
  const [debouncedPropertyQuery] = useDebounce(propertyQuery, 700);

  const is_active = objectHasValue(filters) ? "active" : "in-active";

  const onClose = () => {
    setShowFilters(false);
  };

  const handleShow = () => {
    setShowFilters(true);
  };

  function handleChange(field: keyof IAppointmentManagementFilter, value: unknown) {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  }

  const handleClearFilters = () => {
    setFilters({});
    setLocalFilters({});
  };

  const handleFilter = () => {
    const payload: IAppointmentManagementFilter = {
      ...localFilters,
      propertyId: localFilters?.propertyId?.id,
      userId: localFilters?.userId?.id,
    };
    setFilters(payload);
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

  useEffect(() => {
    async function populateAreas() {
      if (!localFilters?.lgaId) return;
      const response = await fetchAreas({ lgaId: localFilters.lgaId });
      setAreas(response?.items || []);
    }

    populateAreas();
  }, [fetchAreas, localFilters?.lgaId]);

  useEffect(() => {
    async function fetchUserAsync() {
      const response = await fetchUsers({ page: 1, limit: 10, keyword: debouncedUserQuery });
      if (response) {
        setUsers(response);
      }
    }
    fetchUserAsync();
  }, [fetchUsers, debouncedUserQuery]);

  useEffect(() => {
    async function fetchPropertiesAsync() {
      const response = await fetchProperties({ page: 1, limit: 10, propertyName: debouncedPropertyQuery });
      if (response) {
        setProperties(response);
      }
    }
    fetchPropertiesAsync();
  }, [fetchProperties, debouncedPropertyQuery]);

  return (
    <Box>
      <FilterFlexWrappers>
        <Box flexGrow={1} maxWidth={450}>
          <Search
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
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
            <Select
              fullWidth
              label="Status filter"
              items={[
                ...appointmentStatusArray.map((x) => ({
                  label: capitalizeAndSpace(x),
                  id: x,
                })),
                { label: "All", id: "" },
              ]}
              onChange={(e) => {
                handleChange("status", e.target.value);
              }}
              value={localFilters?.status}
            />
            <AutoCompleteWithSub
              fullWidth
              renderInputLabel="User"
              onBlur={() => setUserQuery("")}
              options={
                users?.items?.map((i) => ({
                  label: getUserName(i),
                  sub: `${i?.email}"`,
                  id: i?.id,
                })) || []
              }
              onChange={(_, value) => {
                if (value) {
                  handleChange("userId", value);
                }
              }}
              onInputChange={(_, value) => {
                if (!value) {
                  handleChange("userId", null);
                }
                setUserQuery(value);
              }}
              value={localFilters.userId?.label || ""}
            />

            <AutoCompleteWithSub
              fullWidth
              renderInputLabel="Property"
              onBlur={() => setPropertyQuery("")}
              options={
                properties?.items?.map((x) => ({
                  label: x?.propertyName,
                  id: x?.id,
                })) || []
              }
              onChange={(_, value) => {
                if (value) {
                  handleChange("propertyId", value);
                }
              }}
              onInputChange={(_, value) => {
                if (!value) {
                  handleChange("propertyId", null);
                }
                setPropertyQuery(value);
              }}
              value={localFilters.propertyId?.label || ""}
            />

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
                  handleChange("stateId", null);
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

            <AutoComplete
              fullWidth
              options={(areas || []).map((a) => ({ label: a.area, id: a.id }))}
              renderInputLabel="Area"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(_, value: any) => {
                if (value.id) {
                  handleChange("areaId", value.id);
                }
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onInputChange={(_, value: any) => {
                if (!value) {
                  handleChange("areaId", "");
                }
              }}
              value={(areas || []).find((a) => a.id === localFilters.areaId)?.area || ""}
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

export { AppointmentManagementFilters };
