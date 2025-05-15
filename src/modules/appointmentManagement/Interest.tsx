"use client";

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { CalendarHeart } from "@phosphor-icons/react/dist/ssr";
import { ConfirmationDialog } from "@/components/dialog/Confirmation";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IState } from "@/lib/api/location/location.types";
import { useDebounce } from "use-debounce";
import { IInterest } from "@/lib/api/interest/types";
import { useInterest } from "@/lib/api/interest/useInterest";
import { InterestTable } from "@/components/tables/InterestTable";
import { useUserContext } from "@/contexts/UserContext";
import { IPropertyVariantFilters, PropertyVariantFilters } from "@/components/filters/PropertyVariantFilters";

interface Props {
  interestsData: PaginatedResponse<IInterest> | null;
  states: IState[] | null;
}

function Interest({ interestsData, states }: Props) {
  const { userData } = useUserContext();

  const { fetchInterests, markInterestAsContacted } = useInterest();

  const [interest, setInterest] = useState<IInterest | null>(null);
  const [interests, setInterests] = useState<PaginatedResponse<IInterest> | null>(interestsData);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<IPropertyVariantFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearchQuery] = useDebounce(searchQuery, 700);

  const hasItem = Boolean(interests?.items?.length);

  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }

  function onRowClick(data: IInterest) {
    if (data) {
      setInterest(data);
    }
  }

  async function onConfirm() {
    if (!interest) return;

    setInterests((prev) => {
      if (!prev) return prev;
      const newData = { ...prev };
      const index = newData?.items?.findIndex((x) => x?.id === interest?.id);
      if (index > -1 && userData) {
        newData.items[index].contactedBy = userData;
      }

      return newData;
    });
    setInterest(null);
    await markInterestAsContacted(interest?.id);
  }

  useEffect(() => {
    async function refetchAppointments() {
      const response = await fetchInterests({
        page: page + 1,
        keyword: debounceSearchQuery,
        ...filters,
      });
      if (response) {
        setInterests(response);
      }
    }

    refetchAppointments();
  }, [fetchInterests, page, debounceSearchQuery, filters]);

  return (
    <Box>
      <Box my="32px">
        <PropertyVariantFilters
          filters={filters}
          showPropertyFilter
          states={states}
          setFilters={setFilters}
          setQuery={setSearchQuery}
          query={searchQuery}
        />
      </Box>
      {!hasItem ? (
        <NoListItemCard
          Icon={CalendarHeart}
          noItemCreatedDescription="No interests available"
          noItemFoundDescription="No interests found"
          noItemCreated={Boolean(!interests?.items?.length && !interestsData?.items?.length)}
        />
      ) : (
        <Box>
          <Box mt="32px">
            <InterestTable
              onLimitChange={onLimitChange}
              onRowClick={onRowClick}
              onPageChange={onPageChange}
              page={page}
              limit={limit}
              data={interests}
            />
          </Box>

          <ConfirmationDialog
            message="Are you sure you want to mark the interest as contacted?"
            isOpen={Boolean(interest)}
            onClose={() => setInterest(null)}
            onConfirm={onConfirm}
          />
        </Box>
      )}
    </Box>
  );
}

export { Interest };
