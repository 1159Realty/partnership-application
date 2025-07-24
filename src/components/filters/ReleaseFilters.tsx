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
  revocationRecipientId?: string;
  commissionRecipientId?: string;
  revocationEnrolmentId?: string;
  commissionEnrolmentId?: string;
  status?: ReleaseStatus;
  type?: ReleaseType;
}
interface ILocalFilter {
  revocationRecipientId?: AutoCompleteWithSubOptions;
  commissionRecipientId?: AutoCompleteWithSubOptions;
  revocationEnrolmentId?: AutoCompleteWithSubOptions;
  commissionEnrolmentId?: AutoCompleteWithSubOptions;
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

  const [revocationRecipients, setRevocationRecipients] = useState<PaginatedResponse<User> | null>(null);
  const [revocationRecipientQuery, setRevocationRecipientQuery] = useState("");
  const [debouncedRevocationRecipientQuery] = useDebounce(revocationRecipientQuery, 700);

  const [commissionRecipients, setCommissionRecipients] = useState<PaginatedResponse<User> | null>(null);
  const [commissionRecipientQuery, setCommissionRecipientQuery] = useState("");
  const [debouncedCommissionRecipientQuery] = useDebounce(commissionRecipientQuery, 700);

  const [revocationEnrollments, setRevocationEnrollments] = useState<PaginatedResponse<IEnrollment> | null>(null);
  const [revocationEnrollmentQuery, setRevocationEnrollmentQuery] = useState("");
  const [debouncedRevocationEnrollmentQuery] = useDebounce(revocationEnrollmentQuery, 700);

  const [commissionEnrollments, setCommissionEnrollments] = useState<PaginatedResponse<IEnrollment> | null>(null);
  const [commissionEnrollmentQuery, setCommissionEnrollmentQuery] = useState("");
  const [debouncedCommissionEnrollmentQuery] = useDebounce(commissionEnrollmentQuery, 700);

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
      revocationRecipientId: localFilters?.revocationRecipientId?.id,
      commissionRecipientId: localFilters?.commissionRecipientId?.id,
      revocationEnrolmentId: localFilters?.revocationEnrolmentId?.id,
      commissionEnrolmentId: localFilters?.commissionEnrolmentId?.id,
    };

    // console.log(payload);

    setFilters(payload);
    onClose();
  };

  useEffect(() => {
    async function fetchUserAsync() {
      const response = await fetchUsers({ page: 1, limit: 10, keyword: debouncedRevocationRecipientQuery, byClientOnly: true });
      if (response) {
        setRevocationRecipients(response);
      }
    }
    fetchUserAsync();
  }, [fetchUsers, debouncedRevocationRecipientQuery]);

  useEffect(() => {
    async function fetchUserAsync() {
      const response = await fetchUsers({ page: 1, limit: 10, keyword: debouncedCommissionRecipientQuery, roleId: "agent" });
      if (response) {
        setCommissionRecipients(response);
      }
    }
    fetchUserAsync();
  }, [fetchUsers, debouncedCommissionRecipientQuery]);

  useEffect(() => {
    async function getData() {
      const response = await fetchEnrollments({
        page: 1,
        limit: 10,
        keyword: debouncedRevocationEnrollmentQuery,
      });
      if (response) {
        setRevocationEnrollments(response);
      }
    }
    getData();
  }, [fetchEnrollments, debouncedRevocationEnrollmentQuery]);

  useEffect(() => {
    async function getData() {
      const response = await fetchEnrollments({
        page: 1,
        limit: 10,
        keyword: debouncedCommissionEnrollmentQuery,
      });
      if (response) {
        setCommissionEnrollments(response);
      }
    }
    getData();
  }, [fetchEnrollments, debouncedCommissionEnrollmentQuery]);

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
              renderInputLabel="Revocation recipient"
              onBlur={() => setRevocationRecipientQuery("")}
              options={
                revocationRecipients?.items?.map((i) => ({
                  label: getUserName(i),
                  sub: `${i?.email}"`,
                  id: i?.id,
                })) || []
              }
              onChange={(_, value) => {
                if (value) {
                  handleChange("revocationRecipientId", value);
                }
              }}
              onInputChange={(_, value) => {
                if (!value) {
                  handleChange("revocationRecipientId", null);
                }
                setRevocationRecipientQuery(value);
              }}
              value={localFilters?.revocationRecipientId?.label || ""}
            />

            <AutoCompleteWithSub
              fullWidth
              renderInputLabel="Commission recipient"
              onBlur={() => setCommissionRecipientQuery("")}
              options={
                commissionRecipients?.items?.map((i) => ({
                  label: getUserName(i),
                  sub: `${i?.email}"`,
                  id: i?.id,
                })) || []
              }
              onChange={(_, value) => {
                if (value) {
                  handleChange("commissionRecipientId", value);
                }
              }}
              onInputChange={(_, value) => {
                if (!value) {
                  handleChange("commissionRecipientId", null);
                }
                setCommissionRecipientQuery(value);
              }}
              value={localFilters?.commissionRecipientId?.label || ""}
            />

            <AutoCompleteWithSub
              fullWidth
              renderInputLabel="Revocation enrollment"
              onBlur={() => setRevocationEnrollmentQuery("")}
              options={
                revocationEnrollments?.items?.map((x) => ({
                  label: x?.property?.propertyName,
                  id: x?.id,
                  sub: `Land size:${x?.landSize}, Installment duration: ${x?.installmentDuration} months`,
                })) || []
              }
              onChange={(_, value) => {
                if (value) {
                  handleChange("revocationEnrolmentId", value);
                }
              }}
              onInputChange={(_, value) => {
                if (!value) {
                  handleChange("revocationEnrolmentId", null);
                }
                setRevocationEnrollmentQuery(value);
              }}
              value={localFilters.revocationEnrolmentId?.label || ""}
            />

            <AutoCompleteWithSub
              fullWidth
              renderInputLabel="Commission enrollment"
              onBlur={() => setCommissionEnrollmentQuery("")}
              options={
                commissionEnrollments?.items?.map((x) => ({
                  label: x?.property?.propertyName,
                  id: x?.id,
                  sub: `Land size:${x?.landSize}, Installment duration: ${x?.installmentDuration} months`,
                })) || []
              }
              onChange={(_, value) => {
                if (value) {
                  handleChange("commissionEnrolmentId", value);
                }
              }}
              onInputChange={(_, value) => {
                if (!value) {
                  handleChange("commissionEnrolmentId", null);
                }
                setCommissionEnrollmentQuery(value);
              }}
              value={localFilters.commissionEnrolmentId?.label || ""}
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
