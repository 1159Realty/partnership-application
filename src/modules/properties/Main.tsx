"use client";

import { Box, useMediaQuery } from "@mui/material";
import React from "react";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IState } from "@/lib/api/location/location.types";
import { ScrollableTabs } from "@/components/tabs";
import { IInterest } from "@/lib/api/interest/types";
import { Interested } from "./Interested";
import { Enrolled } from "./Enrolled";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { Acquired } from "./Acquired";

interface PropertiesProps {
  enrollmentData: PaginatedResponse<IEnrollment> | null;
  interestsData: PaginatedResponse<IInterest> | null;
  states: IState[] | null;
}

function Main({ enrollmentData, states, interestsData }: PropertiesProps) {
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

  const tabs = ["Interested", "Enrolled", "Acquired"];
  const maxWidth380 = useMediaQuery("(max-width: 380px)");

  function handleTabChange(index: number) {
    setCurrentTabIndex(index);
  }

  return (
    <Box>
      <ScrollableTabs onChange={handleTabChange} showScroll={maxWidth380} value={currentTabIndex} tabs={tabs} />
      {currentTabIndex === 0 ? (
        <Interested states={states} interestsData={interestsData} />
      ) : currentTabIndex === 1 ? (
        <Enrolled enrollmentData={enrollmentData} states={states} />
      ) : (
        <Acquired
          enrollmentData={
            enrollmentData ? { ...enrollmentData, items: enrollmentData?.items?.filter((x) => x?.status === "COMPLETED") } : null
          }
          states={states}
        />
      )}
    </Box>
  );
}

export { Main };
