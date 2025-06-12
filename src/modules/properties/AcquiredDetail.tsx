"use client";

import { Drawer } from "@/components/drawer";
import { Divider } from "@/components/divider";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Box, Stack } from "@mui/material";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { AcquiredEnrollmentOverview } from "@/components/enrollment/AcquiredEnrollmentOverview";

interface InterestDetailProp {
  enrollment: IEnrollment | null;
  handleClose?: () => void;
}

function AcquiredDetail({ enrollment, handleClose }: InterestDetailProp) {
  return (
    <Drawer isOpen={Boolean(enrollment)} handleClose={handleClose}>
      <Box pb="48px" mt="32px">
        <Stack spacing={"24px"}>
          <Box px="16px">
            <PropertyCard showLink property={enrollment?.property || null} />
          </Box>
          <Divider />
          <Box px="16px">
            <AcquiredEnrollmentOverview enrollment={enrollment} />
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}

export { AcquiredDetail };
