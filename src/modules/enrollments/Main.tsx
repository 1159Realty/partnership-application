/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Box, Grid2, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IState } from "@/lib/api/location/location.types";
import { useDebounce } from "use-debounce";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Plus, Warehouse } from "@phosphor-icons/react/dist/ssr";
import { useEnrollment } from "@/lib/api/enrollment/useEnrollment";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { EnrollClientForm } from "@/components/forms/EnrollClientForm";
import { PageTitle } from "@/components/typography";
import { Button } from "@/components/buttons";
import { getRole } from "@/lib/session/roles";
import { useUserContext } from "@/contexts/UserContext";
import { EnrollmentsTable } from "@/components/tables/EnrollmentsTable";
import { EnrolledDetail } from "./EnrolledDetail";
import { StatCard } from "@/components/cards/StatCard";
import Link from "next/link";
import { ROUTES } from "@/utils/constants";
import { User } from "@/lib/api/user/user.types";
import { ConfirmationDialog } from "@/components/dialog/Confirmation";
import { EnrollmentFilters, IEnrollmentFilters } from "@/components/filters/EnrollmentFilters";
import { useAlertContext } from "@/contexts/AlertContext";

interface PropertiesProps {
  enrollmentsData: PaginatedResponse<IEnrollment> | null;
  enrollmentData?: IEnrollment | null;
  states: IState[] | null;
  usersData: PaginatedResponse<User> | null;
}

function Main({ enrollmentsData, states, usersData, enrollmentData }: PropertiesProps) {
  const { userData } = useUserContext();
  const { setAlert } = useAlertContext();

  const { fetchEnrollments, cancelEnrollment, resumeEnrollment } = useEnrollment();

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<IEnrollmentFilters>({});

  const [cancelEnrollmentId, setCancelEnrollmentId] = useState<string | null>(null);
  const [cancellingEnrollment, setCancellingEnrollment] = useState(false);

  const [resumeEnrollmentId, setResumeEnrollmentId] = useState<string | null>(null);
  const [resumingEnrollment, setResumingEnrollment] = useState(false);

  const [showEnrollUserForm, setShowEnrollUserForm] = useState(false);
  const [enrollment, setEnrollment] = useState<IEnrollment | null>(enrollmentData || null);
  const [enrollments, setEnrollments] = useState<PaginatedResponse<IEnrollment> | null>(enrollmentsData);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [reload, setReload] = useState(false);

  const hasItem = Boolean(enrollments?.items?.length);
  const [debouncedQuery] = useDebounce(query, 700);

  function handleEnrollmentClick(data?: IEnrollment | null) {
    if (!data) return;
    setEnrollment(data);
  }
  function onCreate(data: IEnrollment) {
    const newData = { ...enrollments };
    newData?.items?.push(data);
    newData.totalItems = (newData?.totalItems || 0) + 1;
    setEnrollments(newData as any);
    setReload(!reload);
  }

  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }

  async function onCancelEnrollment() {
    if (!cancelEnrollmentId) return;
    setCancellingEnrollment(true);
    const res = await cancelEnrollment(cancelEnrollmentId);
    if (res) {
      setReload(!reload);
      setEnrollment(null);
      setCancelEnrollmentId(null);
    }
    setCancellingEnrollment(false);
  }

  async function onResumeEnrollment() {
    if (!resumeEnrollmentId) return;
    setResumingEnrollment(true);
    const res = await resumeEnrollment(resumeEnrollmentId);
    if (res === "success") {
      setReload(!reload);
      setEnrollment(null);
      setResumeEnrollmentId(null);
    } else if (res === "insufficient-land") {
      setAlert({
        show: true,
        message: "Insufficient land!",
        severity: "error",
      });
    } else {
      setAlert({
        show: true,
        message: "An error occurred",
        severity: "error",
      });
    }
    setResumingEnrollment(false);
  }

  function showCancelModal(id?: string) {
    if (!id) return;
    setCancelEnrollmentId(id);
  }

  function showResumeModal(id?: string) {
    if (!id) return;
    setResumeEnrollmentId(id);
  }

  useEffect(() => {
    async function fetchEnrollmentsAsync() {
      if (getRole(userData?.roleId) === "agent") {
        const response = await fetchEnrollments({
          ...filters,
          keyword: debouncedQuery,
          page: page + 1,
          agentId: userData?.id,
        });
        if (response) {
          setEnrollments(response);
        }
      } else {
        const response = await fetchEnrollments({ ...filters, keyword: debouncedQuery, page: page + 1, limit });
        if (response) {
          setEnrollments(response);
        }
      }
    }
    fetchEnrollmentsAsync();
  }, [fetchEnrollments, filters, debouncedQuery, page, userData?.roleId, userData?.id, reload, limit]);

  return (
    <Box>
      <Stack my="32px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle mr={"5px"}>
            <Box textTransform={"capitalize"}>Enrollments</Box>
          </PageTitle>
        </Stack>
        {hasItem && (
          <Button onClick={() => setShowEnrollUserForm(true)} startIcon={<Plus weight="bold" />}>
            Add new
          </Button>
        )}
      </Stack>

      <EnrollmentFilters
        filters={filters}
        setFilters={setFilters}
        setSearchQuery={setQuery}
        searchQuery={query}
        states={states}
      />

      <Box mb="32px">
        <Grid2 container spacing={{ xxs: 2, md: 3 }}>
          <Grid2 size={{ xxs: 6, md: 4, lg: 3 }}>
            <Link href={`${ROUTES["/enrollments"]}/clients`}>
              <StatCard showEye label="Total Clients" stat={usersData?.totalItems} />
            </Link>
          </Grid2>
          <Grid2 size={{ xxs: 6, md: 4, lg: 3 }}>
            <StatCard label="Total enrollments" stat={enrollments?.totalItems} />
          </Grid2>
        </Grid2>
      </Box>

      {!hasItem ? (
        <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
          <NoListItemCard
            action="Enroll client"
            onClick={() => setShowEnrollUserForm(true)}
            Icon={Warehouse}
            noItemCreatedDescription={`Client has no properties`}
            noItemFoundDescription="No properties found"
            noItemCreated={Boolean(!enrollments?.items?.length && !enrollmentsData?.items?.length)}
          />
        </Stack>
      ) : (
        <Box mt="32px">
          <EnrollmentsTable
            onLimitChange={onLimitChange}
            onPageChange={onPageChange}
            page={page}
            limit={limit}
            data={enrollments}
            onRowClick={handleEnrollmentClick}
          />
        </Box>
      )}
      <EnrolledDetail
        handleCancel={showCancelModal}
        handleResume={showResumeModal}
        enrollment={enrollment}
        handleClose={() => setEnrollment(null)}
      />
      <EnrollClientForm onCreate={onCreate} showEnrollClient={showEnrollUserForm} onClose={() => setShowEnrollUserForm(false)} />
      <ConfirmationDialog
        message="Are you sure you want to cancel this enrollment?"
        isOpen={Boolean(cancelEnrollmentId)}
        onClose={() => setCancelEnrollmentId(null)}
        onConfirm={onCancelEnrollment}
        loading={cancellingEnrollment}
      />

      <ConfirmationDialog
        message="Are you sure you want to resume this enrollment?"
        isOpen={Boolean(resumeEnrollmentId)}
        onClose={() => setResumeEnrollmentId(null)}
        onConfirm={onResumeEnrollment}
        loading={resumingEnrollment}
      />
    </Box>
  );
}

export { Main };
