"use client";

import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { FadersHorizontal } from "@phosphor-icons/react/dist/ssr";
import { FilterFieldsWrapper, FilterFlexWrappers, FilterHeader, FilterIconContainer } from "./filters.styles";
import { MobileB2MGray900, MobileH1SMGray900 } from "@/utils/typography";
import { HiddenOnMobile } from "@/styles/globals.styles";
import { AutoCompleteWithSub, AutoCompleteWithSubOptions, Search } from "@/components/Inputs";
import { Button } from "@/components/buttons";
import { Drawer } from "../drawer";
import { SetState } from "@/utils/global-types";
import { PaginatedResponse } from "@/lib/api/api.types";
import { useDebounce } from "use-debounce";
import { IProperty } from "@/lib/api/property/property.types";
import { useProperty } from "@/lib/api/property/useProperty";
import { User } from "@/lib/api/user/user.types";
import { useUser } from "@/lib/api/user/useUser";
import { getUserName } from "@/services/string";
import { objectHasValue } from "@/services/objects";

export interface IDocumentGroupFilters {
  propertyId?: string;
  userId?: string;
}
interface ILocalFilter {
  propertyId?: AutoCompleteWithSubOptions;
  userId?: AutoCompleteWithSubOptions;
}

interface Props {
  setFilters: SetState<IDocumentGroupFilters>;
  filters: IDocumentGroupFilters;
  searchQuery: string;
  setSearchQuery: SetState<string>;
  showFiltersControl?: boolean;
}

const DocumentGroupFilters = ({ setFilters, filters, searchQuery, setSearchQuery, showFiltersControl }: Props) => {
  const { fetchUsers } = useUser();
  const { fetchProperties } = useProperty();

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<ILocalFilter>({});

  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [debouncedUserQuery] = useDebounce(userQuery, 700);

  const [properties, setProperties] = useState<PaginatedResponse<IProperty> | null>(null);
  const [propertyQuery, setPropertyQuery] = useState("");
  const [debouncedPropertyQuery] = useDebounce(propertyQuery, 700);

  const isFilterActive = objectHasValue(filters);

  const onClose = () => {
    setShowFilters(false);
  };

  const handleShow = () => {
    setShowFilters(true);
  };

  function handleChange(field: keyof IDocumentGroupFilters, value: unknown) {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  }

  const handleClearFilters = () => {
    setFilters({});
    setLocalFilters({});
  };

  const handleFilter = () => {
    const payload: IDocumentGroupFilters = {
      propertyId: localFilters?.propertyId?.id,
      userId: localFilters?.userId?.id,
    };
    setFilters(payload);
    onClose();
  };

  useEffect(() => {
    async function fetchUserAsync() {
      const response = await fetchUsers({ page: 1, limit: 10, keyword: debouncedUserQuery, byClientOnly: true });
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

        {showFiltersControl && (
          <FilterIconContainer is_active={isFilterActive ? "active" : "in-active"} onClick={handleShow}>
            <HiddenOnMobile>
              <MobileB2MGray900>Filter</MobileB2MGray900>
            </HiddenOnMobile>
            <FadersHorizontal weight="bold" size={18} />
          </FilterIconContainer>
        )}
      </FilterFlexWrappers>

      <Drawer isOpen={showFilters} handleClose={onClose}>
        <Box mt="40px" mb="24px" px="16px">
          <FilterHeader>
            <MobileH1SMGray900>Filters</MobileH1SMGray900>
          </FilterHeader>
          <FilterFieldsWrapper>
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

export { DocumentGroupFilters };
