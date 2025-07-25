"use client";

import { PropertyCard } from "@/components/cards/PropertyCard";
import { Box, Grid2, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { HomeActionFilter, PropertyAction } from "./Action";
import { IProperty } from "@/lib/api/property/property.types";
import { PaginatedResponse } from "@/lib/api/api.types";
import { useProperty } from "@/lib/api/property/useProperty";
import { useHomeContext } from "./HomeContext";
import { useDebounce } from "use-debounce";
import { Pagination } from "@/components/pagination";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Warehouse } from "@phosphor-icons/react/dist/ssr";
import { ScheduleAppointmentForm } from "@/components/forms/ScheduleAppointmentForm";
import { IAvailability } from "@/lib/api/availability/availability.types";
import { IState } from "@/lib/api/location/location.types";
import { MobileH2MGray900 } from "@/utils/typography";
import { useAvailability } from "@/lib/api/availability/useAvailability";

interface PropertiesProps {
  propertiesData: PaginatedResponse<IProperty> | null;
  propertyData?: IProperty | null;
  availabilityData: IAvailability[] | null;
  states: IState[] | null;
  totalProperties: number | null;
}

function Properties({
  propertiesData: propertiesDataProp,
  availabilityData,
  states,
  propertyData,
  totalProperties: totalPropertiesData,
}: PropertiesProps) {
  const { fetchProperties, fetchPropertiesTotal } = useProperty();
  const { fetchAvailabilities } = useAvailability();

  const { query, filters, setEnrollPropertyId, setSchedulePropertyId, schedulePropertyId } = useHomeContext();
  const [debouncedQuery] = useDebounce(query, 700);

  const [availabilities, setAvailabilities] = useState(availabilityData);
  const [reloadAvailability, setReloadAvailability] = useState(false);

  const [properties, setPropertiesData] = useState<PaginatedResponse<IProperty> | null>(propertiesDataProp);
  const [property, setProperty] = useState<IProperty | null>(propertyData || null);
  const [page, setPage] = useState(1);

  const [totalProperties, setTotalProperties] = useState(totalPropertiesData);

  const hasItem = Boolean(properties?.items.length);

  function handlePropertyClick(id: string) {
    setEnrollPropertyId(null);
    setSchedulePropertyId(null);
    setProperty(properties?.items.find((p) => p?.id === id) || null);
  }

  function handlePropertyClose() {
    setProperty(null);
  }

  useEffect(() => {
    async function getProperties() {
      const response = await fetchProperties({ ...filters, propertyName: debouncedQuery, page });
      if (response) {
        setPropertiesData(response);
      }
    }

    getProperties();
  }, [fetchProperties, filters, debouncedQuery, page]);

  useEffect(() => {
    async function get() {
      const response = await fetchAvailabilities();
      if (response) {
        setAvailabilities(response);
      }
    }

    get();
  }, [fetchAvailabilities, reloadAvailability]);

  useEffect(() => {
    async function getTotal() {
      setTotalProperties(await fetchPropertiesTotal({ status: "AVAILABLE" }));
    }
    getTotal();
  }, [fetchPropertiesTotal]);

  return (
    <Box>
      <MobileH2MGray900>Over {totalProperties || 0} properties are available for you!</MobileH2MGray900>

      <Box my="16px">
        <HomeActionFilter states={states} />
      </Box>

      {!hasItem ? (
        <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
          <NoListItemCard Icon={Warehouse} noItemFoundDescription="No property found" noItemCreated={false} />
        </Stack>
      ) : (
        <Box>
          <Grid2 container spacing={{ xxs: 2, md: 3 }}>
            {(properties?.items || [])?.map((p) => (
              <Grid2 key={p?.id} size={{ xxs: 12, xs: 6, lg: 4 }}>
                <PropertyCard showStatus handleClick={handlePropertyClick} property={p} />
              </Grid2>
            ))}
          </Grid2>
          <Box mt="20px" width={"fit-content"} mx="auto">
            {Boolean(properties?.totalPages && properties.totalPages > 1) && (
              <Pagination
                onChange={(_, newPage) => {
                  setPage(newPage);
                }}
                count={properties?.totalPages || 1}
                variant="outlined"
                color="secondary"
                size="large"
              />
            )}
          </Box>
        </Box>
      )}
      <PropertyAction property={property} handleClose={handlePropertyClose} />

      <ScheduleAppointmentForm
        availabilityData={availabilities}
        propertyId={property?.id || null}
        show={Boolean(schedulePropertyId)}
        onClose={() => setSchedulePropertyId(null)}
        onSubmit={() => setReloadAvailability(!reloadAvailability)}
      />
    </Box>
  );
}

export { Properties };
