"use client";

import { PropertyCard } from "@/components/cards/PropertyCard";
import { Box, Grid2, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IProperty } from "@/lib/api/property/property.types";
import { PaginatedResponse } from "@/lib/api/api.types";
import { useProperty } from "@/lib/api/property/useProperty";
import {
  CreatePropertyForm,
  UpdatePropertyForm,
} from "@/components/forms/PropertyForm";
import { IState } from "@/lib/api/location/location.types";
import { useDebounce } from "use-debounce";
import { usePropertyManagementContext } from "./PropertyManagementContext";
import { Pagination } from "@/components/pagination";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Warehouse } from "@phosphor-icons/react/dist/ssr";
import { PageTitle } from "@/components/typography";
import { HasItemCreateButton, PropertyManagementActionFilter } from "./Action";

interface PropertiesProps {
  propertiesData: PaginatedResponse<IProperty> | null;
  states: IState[] | null;
}

function Properties({ propertiesData, states }: PropertiesProps) {
  const { query, filters, setShowCreateProperty } =
    usePropertyManagementContext();
  const { fetchProperties } = useProperty();
  const [debouncedQuery] = useDebounce(query, 700);

  const [page, setPage] = useState(1);
  const [property, setProperty] = useState<IProperty | null>(null);
  const [properties, setPropertiesData] =
    useState<PaginatedResponse<IProperty> | null>(propertiesData);
  const [reload, setReload] = useState(false);

  const hasItem = Boolean(properties?.items?.length);

  function onCreate(newProperty: IProperty) {
    setPropertiesData((prev) => {
      if (!prev?.items) return prev;
      const newPropertiesData = { ...prev };
      newPropertiesData.items = [newProperty, ...prev.items];
      return newPropertiesData;
    });
  }

  function onUpdate(newProperty: IProperty) {
    if (!newProperty) return;
    setPropertiesData((prev) => {
      if (!prev?.items) return prev;
      const newPropertiesData = { ...prev };
      const index = newPropertiesData.items.findIndex(
        (p) => p.id === newProperty.id
      );

      if (index > -1) {
        // if(newProperty?.status==="")
        newPropertiesData.items[index] = newProperty;
      }
      return newPropertiesData;
    });
  }

  function handlePropertyClick(id: string) {
    const current = properties?.items.find((p) => p?.id === id);

    setProperty(current || null);
  }

  useEffect(() => {
    async function getProperties() {
      const response = await fetchProperties({
        ...filters,
        propertyName: debouncedQuery,
        page,
        includeDisabled: true,
      });
      if (response) {
        setPropertiesData(response);
      }
    }
    getProperties();
  }, [fetchProperties, filters, debouncedQuery, page, reload]);

  return (
    <Box>
      <Stack
        rowGap={"10px"}
        mb="32px"
        flexWrap={"wrap"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <PageTitle mr={"5px"}>Property Management</PageTitle>
        {hasItem && <HasItemCreateButton />}
      </Stack>
      <PropertyManagementActionFilter states={states} />

      {!hasItem ? (
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          width={"100%"}
          mt="32px"
        >
          <NoListItemCard
            action="Add new property"
            Icon={Warehouse}
            onClick={() => {
              setShowCreateProperty(true);
            }}
            noItemCreatedDescription="No property listed yet"
            noItemFoundDescription="No property found"
            noItemCreated={Boolean(
              !properties?.items?.length && !propertiesData?.items?.length
            )}
          />
        </Stack>
      ) : (
        <Box>
          <Grid2 container spacing={{ xxs: 2, md: 3 }}>
            {properties?.items.map((p) => (
              <Grid2 key={p.id} size={{ xxs: 12, xs: 6, lg: 4 }}>
                <PropertyCard
                  showStatus
                  showRemainingLandSize
                  isManageProperty
                  handleClick={handlePropertyClick}
                  property={p}
                />
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
      <CreatePropertyForm states={states} onCreate={onCreate} />
      <UpdatePropertyForm
        handleReloadProperties={() => setReload(!reload)}
        property={property}
        onUpdate={onUpdate}
        handleClose={() => setProperty(null)}
      />
    </Box>
  );
}

export { Properties };
