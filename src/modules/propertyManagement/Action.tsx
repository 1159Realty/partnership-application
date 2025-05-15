"use client";

import React from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/buttons";
import { usePropertyManagementContext } from "./PropertyManagementContext";
import { IState } from "@/lib/api/location/location.types";
import { PropertyFilters } from "@/components/filters/PropertyFilters";

function HasItemCreateButton() {
  const { setShowCreateProperty } = usePropertyManagementContext();

  function handleClick() {
    setShowCreateProperty(true);
  }

  return (
    <Button onClick={handleClick} startIcon={<Plus weight="bold" />}>
      Add new
    </Button>
  );
}

interface PropertyManagementActionFilterProps {
  states: IState[] | null;
}

function PropertyManagementActionFilter({ states }: PropertyManagementActionFilterProps) {
  const { setFilters, filters, setQuery, query } = usePropertyManagementContext();
  return <PropertyFilters filters={filters} setFilters={setFilters} setQuery={setQuery} query={query} states={states} />;
}

export { HasItemCreateButton, PropertyManagementActionFilter };
