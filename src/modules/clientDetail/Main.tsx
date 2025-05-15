/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PropertyCard } from "@/components/cards/PropertyCard";
import { Box, Grid2, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IState } from "@/lib/api/location/location.types";
import { useDebounce } from "use-debounce";
import { Pagination } from "@/components/pagination";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Plus, Warehouse } from "@phosphor-icons/react/dist/ssr";
import { IPropertyFilter } from "../home/HomeContext";
import { useEnrollment } from "@/lib/api/enrollment/useEnrollment";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { EnrolledDetail } from "./EnrolledDetail";
import { PropertyFilters } from "@/components/filters/PropertyFilters";
import { EnrollClientForm } from "@/components/forms/EnrollClientForm";
import { PageTitle } from "@/components/typography";
import { Button } from "@/components/buttons";
import { User } from "@/lib/api/user/user.types";
import { getUserName } from "@/services/string";
import { getRole } from "@/lib/session/roles";
import { useUserContext } from "@/contexts/UserContext";

interface PropertiesProps {
  enrollmentsData: PaginatedResponse<IEnrollment> | null;
  states: IState[] | null;
  clientId: string;
  clientData: User | null;
}

function Main({ enrollmentsData, states, clientId, clientData }: PropertiesProps) {
  const { userData } = useUserContext();

  const { fetchEnrollments } = useEnrollment();

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<IPropertyFilter>({});
  const [page, setPage] = useState(1);

  const [showEnrollUserForm, setShowEnrollUserForm] = useState(false);
  const [enrollment, setEnrollment] = useState<IEnrollment | null>(null);
  const [enrollments, setEnrollments] = useState<PaginatedResponse<IEnrollment> | null>(enrollmentsData);

  const hasItem = Boolean(enrollments?.items?.length);
  const [debouncedQuery] = useDebounce(query, 700);

  const name = getUserName(clientData);

  function handleEnrollmentClick(id: string) {
    const current = enrollments?.items.find((x) => x?.id === id);
    setEnrollment(current || null);
  }
  function onCreate(data: IEnrollment) {
    const newData = { ...enrollments };
    newData?.items?.push(data);
    setEnrollments(newData as any);
  }

  useEffect(() => {
    async function fetchEnrollmentsAsync() {
      if (getRole(userData?.roleId) === "agent") {
        const response = await fetchEnrollments({
          ...filters,
          page,
          userId: clientId,
          agentId: userData?.id,
          keyword: debouncedQuery,
        });
        if (response) {
          setEnrollments(response);
        }
      } else {
        const response = await fetchEnrollments({ ...filters, keyword: debouncedQuery, page, userId: clientId });
        if (response) {
          setEnrollments(response);
        }
      }
    }
    fetchEnrollmentsAsync();
  }, [fetchEnrollments, filters, debouncedQuery, page, clientId, userData?.roleId, userData?.id]);

  return (
    <Box>
      <Stack mb="32px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle mr={"5px"}>
            <Box textTransform={"capitalize"}>{name}</Box>
          </PageTitle>
        </Stack>
        {hasItem && (
          <Button onClick={() => setShowEnrollUserForm(true)} startIcon={<Plus weight="bold" />}>
            Add new
          </Button>
        )}
      </Stack>

      <PropertyFilters filters={filters} setFilters={setFilters} setQuery={setQuery} query={query} states={states} />
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
        <Box>
          <Grid2 container spacing={{ xxs: 2, md: 3 }}>
            {enrollments?.items.map((x) => (
              <Grid2 key={x.id} size={{ xxs: 12, xs: 6, lg: 4 }}>
                <PropertyCard
                  showLink
                  landSize={x?.landSize}
                  primaryId={x?.id}
                  isManageProperty
                  handleClick={handleEnrollmentClick}
                  property={x.property}
                />
              </Grid2>
            ))}
          </Grid2>
          <Box mt="20px" width={"fit-content"} mx="auto">
            {Boolean(enrollments?.totalPages && enrollments.totalPages > 1) && (
              <Pagination
                onChange={(_, newPage) => {
                  setPage(newPage);
                }}
                count={enrollments?.totalPages || 1}
                variant="outlined"
                color="secondary"
                size="large"
              />
            )}
          </Box>
        </Box>
      )}
      <EnrolledDetail enrollment={enrollment} handleClose={() => setEnrollment(null)} />
      <EnrollClientForm
        onCreate={onCreate}
        clientId={clientId}
        showEnrollClient={showEnrollUserForm}
        onClose={() => setShowEnrollUserForm(false)}
      />
    </Box>
  );
}

export { Main };
