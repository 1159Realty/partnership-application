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
import { releaseArray, ReleaseStatus, ReleaseType, releaseTypeArray } from "@/lib/api/release/types";
import { objectHasValue } from "@/services/objects";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { useEnrollment } from "@/lib/api/enrollment/useEnrollment";

export interface IReleaseFilter {
  userId?: string;
  enrolmentId?: string;
  status?: ReleaseStatus;
  type?: ReleaseType;
}
interface ILocalFilter {
  userId?: AutoCompleteWithSubOptions;
  enrolmentId?: AutoCompleteWithSubOptions;
  status?: ReleaseStatus;
  type?: ReleaseType;
}

interface Props {
  setFilters: SetState<IReleaseFilter>;
  filters: IReleaseFilter;
}

const ReleaseFilters = ({ setFilters, filters }: Props) => {
  const { fetchUsers } = useUser();
  const { fetchEnrollments } = useEnrollment();

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<ILocalFilter>({});

  const [recipients, setRecipients] = useState<PaginatedResponse<User> | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [debouncedRecipientQuery] = useDebounce(userQuery, 700);

  const [enrollments, setEnrollments] = useState<PaginatedResponse<IEnrollment> | null>(null);
  const [enrollmentQuery, setEnrollmentQuery] = useState("");
  const [debouncedEnrollmentQuery] = useDebounce(enrollmentQuery, 700);

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
      enrolmentId: localFilters?.enrolmentId?.id,
    };

    // console.log(payload);

    setFilters(payload);
    onClose();
  };

  useEffect(() => {
    async function fetchUserAsync() {
      const response = await fetchUsers({ page: 1, limit: 10, keyword: debouncedRecipientQuery, byClientOnly: true });
      if (response) {
        setRecipients(response);
      }
    }
    fetchUserAsync();
  }, [fetchUsers, debouncedRecipientQuery]);

  useEffect(() => {
    async function getData() {
      const response = await fetchEnrollments({
        page: 1,
        limit: 10,
        keyword: debouncedEnrollmentQuery,
      });
      if (response) {
        setEnrollments(response);
      }
    }
    getData();
  }, [fetchEnrollments, debouncedEnrollmentQuery]);

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
            <Select
              fullWidth
              label="Type"
              items={[
                ...releaseTypeArray.map((x) => ({
                  label: capitalizeAndSpace(x),
                  id: x,
                })),
                { label: "All", id: "" },
              ]}
              onChange={(e) => {
                handleChange("type", e.target.value);
              }}
              value={localFilters?.type}
            />

            <AutoCompleteWithSub
              fullWidth
              renderInputLabel="Recipient"
              onBlur={() => setUserQuery("")}
              options={
                recipients?.items?.map((i) => ({
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
              value={localFilters?.userId?.label || ""}
            />

            <AutoCompleteWithSub
              fullWidth
              renderInputLabel="Enrollment"
              onBlur={() => setEnrollmentQuery("")}
              options={
                enrollments?.items?.map((x) => ({
                  label: x?.property?.propertyName,
                  id: x?.id,
                  sub: `Land size:${x?.landSize}, Installment duration: ${x?.installmentDuration} months`,
                })) || []
              }
              onChange={(_, value) => {
                if (value) {
                  handleChange("enrolmentId", value);
                }
              }}
              onInputChange={(_, value) => {
                if (!value) {
                  handleChange("enrolmentId", null);
                }
                setEnrollmentQuery(value);
              }}
              value={localFilters.enrolmentId?.label || ""}
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
