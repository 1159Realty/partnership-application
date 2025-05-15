"use client";

import { Drawer } from "@/components/drawer";
import { Divider } from "@/components/divider";
import { PropertyOverview } from "@/components/property/PropertyOverview";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Box, Stack } from "@mui/material";
import { IInterest } from "@/lib/api/interest/types";
import { Button } from "@/components/buttons";

interface InterestDetailProp {
  interest: IInterest | null;
  handleClose?: () => void;
  onCancelInterest?: (interest: IInterest) => void;
}

function InterestDetail({ interest, handleClose, onCancelInterest }: InterestDetailProp) {
  const handleCancelInterest = (interest: IInterest | null) => {
    if (!interest) return;
    onCancelInterest?.(interest);
  };

  return (
    <Drawer isOpen={Boolean(interest)} handleClose={handleClose}>
      <Box pb="48px" mt="32px">
        <Stack spacing={"32px"}>
          <Box px="16px">
            <Box>
              <PropertyCard property={interest?.property || null} />
            </Box>
          </Box>
          <Divider />

          <Stack px="16px" spacing={"16px"}>
            <Button fullWidth onClick={() => handleCancelInterest(interest)}>
              Cancel Interest
            </Button>
            <Divider />
          </Stack>
          <Divider />

          <Box px="16px">
            <PropertyOverview property={interest?.property || null} />
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}

export { InterestDetail };
