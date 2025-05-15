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
import { InvoiceStatus, invoiceStatusArr } from "@/lib/api/invoice/invoice.types";
import { useEnrollment } from "@/lib/api/enrollment/useEnrollment";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { Dayjs } from "dayjs";
import { formatAsIsoString } from "@/services/dateTime";
import { objectHasValue } from "@/services/objects";

export interface IInvoiceFilter {
  userId?: string;
  enrollmentId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  status?: any;
  startDate?: string;
  endDate?: string;
}
interface ILocalFilter {
  userId?: AutoCompleteWithSubOptions;
  enrollmentId?: AutoCompleteWithSubOptions;
  status?: InvoiceStatus;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
}

interface Props {
  setFilters: SetState<IInvoiceFilter>;
  filters: IInvoiceFilter;
}

const InvoiceFilters = ({ setFilters, filters }: Props) => {
  const { userData } = useUserContext();

  const { fetchUsers } = useUser();
  const { fetchEnrollments } = useEnrollment();

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<ILocalFilter>({});

  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [debouncedUserQuery] = useDebounce(userQuery, 700);

  const [enrollments, setEnrollments] = useState<PaginatedResponse<IEnrollment> | null>(null);
  const [enrollmentQuery, setEnrollmentQuery] = useState("");
  const [debouncedEnrollmentQuery] = useDebounce(enrollmentQuery, 700);

  const role = getRole(userData?.roleId);
  const isModerator = !(role === "agent" || role === "client");
  const isFilterActive = objectHasValue(filters);

  const onClose = () => {
    setShowFilters(false);
  };

  const handleShow = () => {
    setShowFilters(true);
  };

  function handleChange(field: keyof IInvoiceFilter, value: unknown) {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  }

  const handleClearFilters = () => {
    setFilters({});
    setLocalFilters({});
  };

  const handleFilter = () => {
    const payload: IInvoiceFilter = {
      ...localFilters,
      enrollmentId: localFilters?.enrollmentId?.id,
      userId: localFilters?.userId?.id,
      startDate: formatAsIsoString(localFilters?.startDate),
      endDate: formatAsIsoString(localFilters?.endDate),
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

  useEffect(() => {
    async function fetchPropertiesAsync() {
      const response = await fetchEnrollments({
        page: 1,
        limit: 10,
        keyword: debouncedEnrollmentQuery,
        userId: isModerator ? undefined : userData?.id,
      });
      if (response) {
        setEnrollments(response);
      }
    }

    fetchPropertiesAsync();
  }, [fetchEnrollments, debouncedEnrollmentQuery, isModerator, userData?.id]);

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
                ...invoiceStatusArr.map((x) => ({
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
                  handleChange("enrollmentId", value);
                }
              }}
              onInputChange={(_, value) => {
                if (!value) {
                  handleChange("enrollmentId", null);
                }
                setEnrollmentQuery(value);
              }}
              value={localFilters.enrollmentId?.label || ""}
            />

            {isModerator && (
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
            )}

            {/* <DatePicker
              onChange={(value: Dayjs | null) => {
                handleChange("startDate", value);
              }}
              value={localFilters?.startDate}
              label="Start date"
            />

            <DatePicker
              onChange={(value: Dayjs | null) => {
                handleChange("endDate", value);
              }}
              value={localFilters?.endDate}
              label="End date"
            /> */}
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

export { InvoiceFilters };
