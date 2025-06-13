"use client";

import { Drawer } from "@/components/drawer";
import { Button } from "@/components/buttons";
import { Divider } from "@/components/divider";
import { PropertyOverview } from "@/components/property/PropertyOverview";
import { IProperty } from "@/lib/api/property/property.types";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { IState } from "@/lib/api/location/location.types";
import { useHomeContext } from "./HomeContext";
import { Box, Stack, Switch } from "@mui/material";
import { MobileB2MGray900, MobileCap2MGray500 } from "@/utils/typography";
import { useEffect, useState } from "react";
import { hasPermission } from "@/lib/session/roles";
import { useUserContext } from "@/contexts/UserContext";
import { useInterest } from "@/lib/api/interest/useInterest";
import { useAppointment } from "@/lib/api/appointment/useAppointment";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IAppointment } from "@/lib/api/appointment/appointment.types";
import { Tooltip } from "@/components/tooltip";
import { Spinner } from "@/components/loaders";
import { PropertyFilters } from "@/components/filters/PropertyFilters";
import { getClientSession } from "@/lib/session/client";

interface PropertyActionProps {
  property: IProperty | null;
  handleClose: () => void;
}

function PropertyAction({ property, handleClose }: PropertyActionProps) {
  const { userData } = useUserContext();
  const { setSchedulePropertyId, schedulePropertyId, setEnrollPropertyId } = useHomeContext();

  const { createInterest, deleteInterest, fetchInterests } = useInterest();
  const { fetchAppointmentsByUserId } = useAppointment();

  const [showInterest, setShowInterest] = useState(false);
  const [appointments, setAppointments] = useState<PaginatedResponse<IAppointment> | null>(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loadingInterest, setLoadingInterest] = useState(false);

  const hasScheduled = appointments?.items?.some((x) => x?.property?.id === property?.id && property?.id);

  function handleScheduleAppointment() {
    if (!property) return;
    // handleClose();
    setEnrollPropertyId(null);
    setSchedulePropertyId(property.id);
  }

  async function toggleInterest() {
    if (showInterest) {
      setShowInterest(false);
      await deleteInterest(property?.id || "");
    } else {
      setShowInterest(true);
      await createInterest(property?.id || "");
    }
  }

  useEffect(() => {
    async function fetchInterestsByUseridAsync() {
      if (!property?.id) return;
      setLoadingInterest(true);

      const session = getClientSession();
      const response = await fetchInterests({ propertyId: property?.id, userId: session?.user?.id });

      setShowInterest(Boolean(response?.items?.length));
      setLoadingInterest(false);
    }
    fetchInterestsByUseridAsync();
  }, [fetchInterests, property]);

  useEffect(() => {
    async function fetchAppointmentsByUserIdAsync() {
      if (!property?.id) return;
      setLoadingSchedule(true);
      const response = await fetchAppointmentsByUserId({ page: 1, limit: 100, status: "PENDING", propertyId: property?.id });
      setAppointments(response);
      setLoadingSchedule(false);
    }
    fetchAppointmentsByUserIdAsync();
  }, [fetchAppointmentsByUserId, schedulePropertyId, property]);

  return (
    <Drawer isOpen={Boolean(property)} handleClose={handleClose}>
      {loadingInterest || loadingSchedule ? (
        <Spinner />
      ) : (
        <Box pb="48px" mt="32px">
          <Stack spacing={"24px"}>
            <Box px="16px">
              <PropertyCard showYoutube property={property} />
            </Box>
            <Divider />

            {(hasPermission(userData?.roleId, "create:interest") || hasPermission(userData?.roleId, "create:appointment")) && (
              <>
                <Stack px="16px" spacing={"16px"}>
                  <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} spacing={"10px"}>
                    <Box>
                      <MobileB2MGray900>Show interest</MobileB2MGray900>
                      <Box>
                        <MobileCap2MGray500>Toggle on to signal your interest in the property</MobileCap2MGray500>
                      </Box>
                    </Box>
                    <Box>
                      <Switch onChange={toggleInterest} checked={showInterest} color="secondary" size="medium" />
                    </Box>
                    <Divider />
                  </Stack>

                  <Tooltip title={hasScheduled ? "You already have an appointment scheduled for this property" : ""}>
                    <Box>
                      <Button disabled={hasScheduled} fullWidth onClick={handleScheduleAppointment}>
                        Schedule Appointment
                      </Button>
                    </Box>
                  </Tooltip>
                </Stack>
                <Divider />
              </>
            )}

            <Box px="16px">
              <PropertyOverview property={property} />
            </Box>
          </Stack>
        </Box>
      )}
    </Drawer>
  );
}

interface HomeActionFilterProps {
  states: IState[] | null;
}

function HomeActionFilter({ states }: HomeActionFilterProps) {
  const { setFilters, filters, setQuery, query } = useHomeContext();
  return <PropertyFilters filters={filters} setFilters={setFilters} setQuery={setQuery} query={query} states={states} />;
}

export { PropertyAction, HomeActionFilter };
