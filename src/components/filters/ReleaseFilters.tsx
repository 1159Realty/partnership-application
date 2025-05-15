"use client";

import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { FadersHorizontal } from "@phosphor-icons/react/dist/ssr";
import { FilterFieldsWrapper, FilterFlexWrappers, FilterHeader, FilterIconContainer } from "./filters.styles";
import { MobileB2MGray900, MobileH1SMGray900 } from "@/utils/typography";
import { HiddenOnMobile } from "@/styles/globals.styles";
import { AutoCompleteWithSub, AutoCompleteWithSubOptions, Select } from "@/components/Inputs";
import { Button } from "@/components/buttons";
import { Drawer } from "../drawer";
import { SetState } from "@/utils/global-types";
import { PaginatedResponse } from "@/lib/api/api.types";
import { User } from "@/lib/api/user/user.types";
import { useUser } from "@/lib/api/user/useUser";
import { useDebounce } from "use-debounce";
import { capitalizeAndSpace, getUserName } from "@/services/string";
import { getRole } from "@/lib/session/roles";
import { useUserContext } from "@/contexts/UserContext";
import { releaseArray, ReleaseStatus } from "@/lib/api/release/types";
import { objectHasValue } from "@/services/objects";

export interface IReleaseFilter {
  userId?: string;
  status?: ReleaseStatus;
}
interface ILocalFilter {
  userId?: AutoCompleteWithSubOptions;
  status?: ReleaseStatus;
}

interface Props {
  setFilters: SetState<IReleaseFilter>;
  filters: IReleaseFilter;
}

const ReleaseFilters = ({ setFilters, filters }: Props) => {
  const { userData } = useUserContext();

  const { fetchUsers } = useUser();

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<ILocalFilter>({});

  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [debouncedUserQuery] = useDebounce(userQuery, 700);

  const role = getRole(userData?.roleId);

  const is_active = objectHasValue(filters) ? "active" : "in-active";

  const onClose = () => {
    setShowFilters(false);
  };

  const handleShow = () => {
    setShowFilters(true);
  };

  function handleChange(field: keyof IReleaseFilter, value: unknown) {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  }

  const handleClearFilters = () => {
    setFilters({});
    setLocalFilters({});
  };

  const handleFilter = () => {
    const payload: IReleaseFilter = {
      ...localFilters,
      userId: localFilters?.userId?.id,
    };

    // console.log(payload);

    setFilters(payload);
    onClose();
  };

  useEffect(() => {
    async function fetchUserAsync() {
      if (role === "agent") return;
      const response = await fetchUsers({ page: 1, limit: 10, keyword: debouncedUserQuery, byClientOnly: true });
      if (response) {
        setUsers(response);
      }
    }

    fetchUserAsync();
  }, [fetchUsers, debouncedUserQuery, role]);

  return (
    <Box>
      <FilterFlexWrappers>
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
              label="Status"
              items={[
                ...releaseArray.map((x) => ({
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

export { ReleaseFilters };
