"use client";

import { PropertyCard } from "@/components/cards/PropertyCard";
import { Box, Grid2, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IState } from "@/lib/api/location/location.types";
import { useDebounce } from "use-debounce";
import { Pagination } from "@/components/pagination";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Warehouse } from "@phosphor-icons/react/dist/ssr";
import { IPropertyFilter } from "../home/HomeContext";
import { useEnrollment } from "@/lib/api/enrollment/useEnrollment";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { EnrolledDetail } from "./EnrolledDetail";
import { useUserContext } from "@/contexts/UserContext";
import { EnrollmentFilters } from "@/components/filters/EnrollmentFilters";

interface PropertiesProps {
  enrollmentData: PaginatedResponse<IEnrollment> | null;
  states: IState[] | null;
}

function Enrolled({ enrollmentData, states }: PropertiesProps) {
  const { fetchEnrollments } = useEnrollment();

  const { userData } = useUserContext();

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<IPropertyFilter>({});
  const [page, setPage] = useState(1);

  const [enrollment, setEnrollment] = useState<IEnrollment | null>(null);
  const [enrollments, setEnrollments] = useState<PaginatedResponse<IEnrollment> | null>(enrollmentData);

  const hasItem = Boolean(enrollments?.items?.length);
  const [debouncedQuery] = useDebounce(query, 700);

  function handleEnrollmentClick(id: string) {
    const current = enrollments?.items.find((x) => x?.id === id);
    setEnrollment(current || null);
  }

  useEffect(() => {
    async function fetchEnrollmentsAsync() {
      const response = await fetchEnrollments({ ...filters, keyword: debouncedQuery, page, userId: userData?.id });
      if (response) {
        setEnrollments(response);
      }
    }
    fetchEnrollmentsAsync();
  }, [fetchEnrollments, filters, debouncedQuery, page, userData?.id]);

  return (
    <Box>
      <Box mt="20px">
        <EnrollmentFilters
          filters={filters}
          setFilters={setFilters}
          setSearchQuery={setQuery}
          searchQuery={query}
          states={states}
        />
      </Box>

      {!hasItem ? (
        <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
          <NoListItemCard
            Icon={Warehouse}
            noItemFoundDescription="You haven't been enrolled for any property"
            noItemCreated={false}
          />
        </Stack>
      ) : (
        <Box>
          <Grid2 container spacing={{ xxs: 2, md: 3 }}>
            {enrollments?.items.map((x) => (
              <Grid2 key={x.id} size={{ xxs: 12, xs: 6, lg: 4 }}>
                <PropertyCard primaryId={x?.id} isManageProperty handleClick={handleEnrollmentClick} property={x.property} />
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
    </Box>
  );
}

export { Enrolled };
