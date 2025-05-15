"use client";

import { AvailabilityForm } from "@/components/forms/AvailabilityForm";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Calendar } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/buttons";
import { AvailabilityTable } from "@/components/tables/AvailabilityTable";
import { ConfirmationDialog } from "@/components/dialog/Confirmation";
import { useAvailability } from "@/lib/api/availability/useAvailability";
import { IAvailability } from "@/lib/api/availability/availability.types";

interface Props {
  availabilitiesData: IAvailability[] | null;
}

function Availability({ availabilitiesData }: Props) {
  const { fetchAvailabilities, deleteAvailability } = useAvailability();

  const [showAvailability, setShowAvailability] = useState(false);
  const [availability, setAvailability] = useState<IAvailability | null>(null);

  const [availabilities, setAvailabilities] = useState<IAvailability[] | null>(availabilitiesData);
  const [reload, setReload] = useState(false);

  const hasItem = Boolean(availabilities?.length);

  function handleShowAvailability() {
    setShowAvailability(true);
  }

  function handleDelete(data: IAvailability | null) {
    if (!availabilities) return;
    setAvailability(data);
  }

  function onCreate(result: IAvailability) {
    setAvailabilities((prev) => {
      let newAvailability: IAvailability[] = [];

      if (prev) {
        newAvailability = [...prev];
        const index = newAvailability?.findIndex((a) => a.weekday === result.weekday);
        if (index > -1) {
          newAvailability[index] = result;
        } else {
          newAvailability.push(result);
        }
      }

      return newAvailability;
    });

    setReload(!reload);
  }

  async function confirmDelete() {
    if (!availability?.id) return;

    setAvailabilities((prev) => {
      let newAvailability: IAvailability[] = [];

      if (prev) {
        newAvailability = prev.filter((x) => x.id !== availability?.id);
      }
      return newAvailability;
    });
    setAvailability(null);
    await deleteAvailability(availability?.id);
  }

  useEffect(() => {
    async function refetchAvailability() {
      const response = await fetchAvailabilities();
      if (response) {
        setAvailabilities(response);
      }
    }

    refetchAvailability();
  }, [reload, fetchAvailabilities]);

  return (
    <Box>
      {!hasItem ? (
        <NoListItemCard
          action="Add schedule"
          Icon={Calendar}
          onClick={handleShowAvailability}
          noItemCreatedDescription="No schedule added"
          noItemCreated={true}
        />
      ) : (
        <Box>
          {hasItem && (
            <Stack mb="32px" width={"100%"} alignItems={"flex-end"}>
              <Button onClick={handleShowAvailability}>Add schedule</Button>
            </Stack>
          )}
          <AvailabilityTable availabilities={availabilities} handleDelete={handleDelete} />
          <ConfirmationDialog
            message="Are you sure you want to delete this item?"
            isOpen={Boolean(availability)}
            onClose={() => setAvailability(null)}
            onConfirm={confirmDelete}
          />
        </Box>
      )}
      <AvailabilityForm onCreate={onCreate} show={showAvailability} onClose={() => setShowAvailability(false)} />
    </Box>
  );
}

export { Availability };
