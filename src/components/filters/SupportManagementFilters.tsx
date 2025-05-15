"use client";

import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { FadersHorizontal } from "@phosphor-icons/react/dist/ssr";
import { FilterFieldsWrapper, FilterFlexWrappers, FilterHeader, FilterIconContainer } from "./filters.styles";
import { MobileB2MGray900, MobileH1SMGray900 } from "@/utils/typography";
import { HiddenOnMobile } from "@/styles/globals.styles";
import { AutoComplete, AutoCompleteWithSub, AutoCompleteWithSubOptions, Select } from "@/components/Inputs";
import { Button } from "@/components/buttons";
import { Drawer } from "../drawer";
import { SetState } from "@/utils/global-types";
import { PaginatedResponse } from "@/lib/api/api.types";
import { capitalizeAndSpace, getUserName } from "@/services/string";
import { ISupportCategory, SupportStatus, supportStatusArray } from "@/lib/api/support/types";
import { objectHasValue } from "@/services/objects";
import { User } from "@/lib/api/user/user.types";
import { useDebounce } from "use-debounce";
import { useUser } from "@/lib/api/user/useUser";

export interface ISupportManagementFilter {
  supportCategoryId?: string;
  status?: SupportStatus;
  userId?: string;
}
interface ILocalFilter {
  userId?: AutoCompleteWithSubOptions;
  supportCategoryId?: AutoCompleteWithSubOptions;
  status?: SupportStatus;
}

interface Props {
  setFilters: SetState<ISupportManagementFilter>;
  filters: ISupportManagementFilter;
  supportCategories: PaginatedResponse<ISupportCategory> | null;
}

const SupportManagementFilters = ({ setFilters, filters, supportCategories }: Props) => {
  const { fetchUsers } = useUser();

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<ILocalFilter>({});

  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [debouncedUserQuery] = useDebounce(userQuery, 700);

  const isFilterActive = objectHasValue(filters);

  const onClose = () => {
    setShowFilters(false);
  };

  const handleShow = () => {
    setShowFilters(true);
  };

  function handleChange(field: keyof ISupportManagementFilter, value: unknown) {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  }

  const handleClearFilters = () => {
    setFilters({});
    setLocalFilters({});
  };

  const handleFilter = () => {
    const payload: ISupportManagementFilter = {
      ...localFilters,
      supportCategoryId: localFilters?.supportCategoryId?.id,
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

  return (
    <Box>
      <FilterFlexWrappers>
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
              label="Status"
              items={[
                ...supportStatusArray.map((x) => ({
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

            <AutoComplete
              fullWidth
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={(supportCategories?.items || []).map((s) => ({ label: s?.name, id: s?.id }))}
              renderInputLabel="Support category"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(_, value: any) => {
                if (value) {
                  handleChange("supportCategoryId", value);
                }
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onInputChange={(_, value: any) => {
                if (!value) {
                  handleChange("supportCategoryId", "");
                }
              }}
              value={localFilters?.supportCategoryId?.label}
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

export { SupportManagementFilters };
