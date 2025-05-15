"use client";
import { Button } from "@/components/buttons";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { ILocationFilter, LocationFilters } from "@/components/filters/LocationFilters";
import { LocationForm } from "@/components/forms/LocationForm";
import { LocationTable } from "@/components/tables/LocationTable";
import { PageTitle } from "@/components/typography";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IArea, IState } from "@/lib/api/location/location.types";
import { useLocation } from "@/lib/api/location/useLocation";
import { Box, Stack } from "@mui/material";
import { MapPinLine, Plus } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface Props {
  states: IState[] | null;
  areasData: PaginatedResponse<IArea> | null;
}

function Main({ states, areasData }: Props) {
  const { fetchAreas } = useLocation();

  const [showLocationForm, setShowLocationForm] = useState(false);
  const [area, setArea] = useState<IArea | null>(null);

  const [areas, setAreas] = useState<PaginatedResponse<IArea> | null>(areasData);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<ILocationFilter>({});
  const [query, setQuery] = useState("");
  const [debounceQuery] = useDebounce(query, 700);
  const [reload, setReload] = useState(false);

  const hasItem = Boolean(areas?.items?.length);

  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }

  function onRowClick(area: IArea) {
    setArea(area);
  }

  function onAddLocation() {
    setReload(!reload);
  }

  function hideForm() {
    setShowLocationForm(false);
    setArea(null);
  }

  useEffect(() => {
    async function fetchAreasAsync() {
      const response = await fetchAreas({
        page: page + 1,
        limit,
        keyword: debounceQuery,
        stateId: filters?.stateId,
        lgaId: filters?.lgaId,
      });

      setAreas(response);
    }

    fetchAreasAsync();
  }, [debounceQuery, fetchAreas, limit, page, filters, reload]);

  return (
    <Box>
      <Stack mb="32px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <PageTitle mr={"5px"}>Locations</PageTitle>
        {hasItem && (
          <Button onClick={() => setShowLocationForm(true)} startIcon={<Plus weight="bold" />}>
            Add new
          </Button>
        )}
      </Stack>
      <Box mb="32px">
        <LocationFilters filters={filters} states={states} setFilters={setFilters} setQuery={setQuery} query={query} />
      </Box>

      <Box>
        {!hasItem ? (
          <NoListItemCard
            action="Add new area"
            Icon={MapPinLine}
            onClick={() => setShowLocationForm(true)}
            noItemCreatedDescription="No area has been added"
            noItemFoundDescription="No area found"
            noItemCreated={Boolean(!areas?.items?.length && !areasData?.items?.length)}
          />
        ) : (
          <Box>
            <Box>
              <LocationTable
                onLimitChange={onLimitChange}
                onRowClick={onRowClick}
                onPageChange={onPageChange}
                page={page}
                limit={limit}
                data={areas}
              />
            </Box>
          </Box>
        )}

        <LocationForm
          onCreate={onAddLocation}
          area={area}
          states={states}
          isOpen={showLocationForm || Boolean(area)}
          onClose={hideForm}
        />
      </Box>
    </Box>
  );
}

export { Main };
