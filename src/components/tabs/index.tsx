"use client";

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import { StyledTab } from "./tabs.styles";

interface ScrollableTabsProps {
  value: number;
  onChange?: (index: number) => void;
  tabs: string[];
  showScroll?: boolean;
}

function ScrollableTabs({ value, onChange, tabs, showScroll }: ScrollableTabsProps) {
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    onChange?.(newValue);
  };

  return (
    <Box bgcolor={"transparent"}>
      <Tabs value={value} onChange={handleChange} variant={showScroll ? "scrollable" : "standard"} scrollButtons="auto">
        {tabs.map((t) => (
          <StyledTab key={t} label={t} />
        ))}
      </Tabs>
    </Box>
  );
}

export { ScrollableTabs };
