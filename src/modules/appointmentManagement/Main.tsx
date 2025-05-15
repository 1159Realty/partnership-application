"use client";

import { Box, useMediaQuery } from "@mui/material";
import { IAppointment } from "@/lib/api/appointment/appointment.types";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IState } from "@/lib/api/location/location.types";
import { ScrollableTabs } from "@/components/tabs";
import { Interest } from "./Interest";
import { useState } from "react";
import { IInterest } from "@/lib/api/interest/types";
import { IAvailability } from "@/lib/api/availability/availability.types";
import { Appointment } from "./Appointment";
import { Availability } from "./Availability";

interface Props {
  appointmentsData: PaginatedResponse<IAppointment> | null;
  interestsData: PaginatedResponse<IInterest> | null;
  availabilitiesData: IAvailability[] | null;
  states: IState[] | null;
}

function Main({ appointmentsData, interestsData, availabilitiesData, states }: Props) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const maxWidth = useMediaQuery("(max-width: 375px)");

  const tabs = ["appointments", "interests", "schedule"];

  function handleChange(index: number) {
    setCurrentTabIndex(index);
  }

  return (
    <Box mt="16px">
      <ScrollableTabs showScroll={maxWidth} onChange={handleChange} value={currentTabIndex} tabs={tabs} />
      <Box mt="32px">
        {currentTabIndex === 0 ? (
          <Appointment appointmentsData={appointmentsData} states={states} />
        ) : currentTabIndex === 1 ? (
          <Interest interestsData={interestsData} states={states} />
        ) : (
          <Availability availabilitiesData={availabilitiesData} />
        )}
      </Box>
    </Box>
  );
}

export { Main };
