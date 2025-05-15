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
import { IInterest } from "@/lib/api/interest/types";
import { useInterest } from "@/lib/api/interest/useInterest";
import { InterestDetail } from "./InterestDetail";
import { getClientSession } from "@/lib/session/client";
import { PropertyVariantFilters } from "@/components/filters/PropertyVariantFilters";

interface PropertiesProps {
  interestsData: PaginatedResponse<IInterest> | null;
  states: IState[] | null;
}

function Interested({ interestsData, states }: PropertiesProps) {
  const { fetchInterests, deleteInterest } = useInterest();

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<IPropertyFilter>({});
  const [page, setPage] = useState(1);

  const [interest, setInterest] = useState<IInterest | null>(null);
  const [interests, setInterests] = useState<PaginatedResponse<IInterest> | null>(interestsData);

  const hasItem = Boolean(interests?.items.length);
  const [debouncedQuery] = useDebounce(query, 700);

  async function handleCancel(interest: IInterest) {
    setInterests((prev) => {
      if (!prev?.items) return prev;
      const newInterests = { ...prev };
      newInterests.items = newInterests.items?.filter((x) => x?.property?.id !== interest.property?.id);
      return newInterests;
    });
    setInterest(null);
    await deleteInterest(interest?.property?.id);
  }

  function handleInterestClick(id: string) {
    const current = interests?.items.find((x) => x?.id === id);
    setInterest(current || null);
  }

  useEffect(() => {
    async function getInterests() {
      const session = getClientSession();
      const response = await fetchInterests({ ...filters, keyword: debouncedQuery, page, userId: session?.user?.id });
      if (response) {
        setInterests(response);
      }
    }
    getInterests();
  }, [filters, debouncedQuery, page, fetchInterests]);

  return (
    <Box mt="20px">
      <PropertyVariantFilters
        filters={filters}
        showPropertyFilter
        states={states}
        setFilters={setFilters}
        setQuery={setQuery}
        query={query}
      />

      {!hasItem ? (
        <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
          <NoListItemCard
            Icon={Warehouse}
            noItemFoundDescription="No interest found"
            noItemCreatedDescription="You haven't shown interest in any property"
            noItemCreated={Boolean(!interests?.items?.length && !interestsData?.items?.length)}
          />
        </Stack>
      ) : (
        <Box>
          <Grid2 container spacing={{ xxs: 2, md: 3 }}>
            {interests?.items.map((interest) => (
              <Grid2 key={interest?.property?.id} size={{ xxs: 12, xs: 6, lg: 4 }}>
                <PropertyCard
                  primaryId={interest?.id}
                  isManageProperty
                  handleClick={handleInterestClick}
                  property={interest?.property}
                />
              </Grid2>
            ))}
          </Grid2>
          <Box mt="20px" width={"fit-content"} mx="auto">
            {Boolean(interests?.totalPages && interests.totalPages > 1) && (
              <Pagination
                onChange={(_, newPage) => {
                  setPage(newPage);
                }}
                count={interests?.totalPages || 1}
                variant="outlined"
                color="secondary"
                size="large"
              />
            )}
          </Box>
        </Box>
      )}
      <InterestDetail interest={interest} handleClose={() => setInterest(null)} onCancelInterest={handleCancel} />
    </Box>
  );
}

export { Interested };
