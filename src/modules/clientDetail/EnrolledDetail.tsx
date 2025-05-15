"use client";

import { Drawer } from "@/components/drawer";
import { Divider } from "@/components/divider";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Box, Stack } from "@mui/material";
import { IEnrollment } from "@/lib/api/enrollment/types";

interface InterestDetailProp {
  enrollment: IEnrollment | null;
  handleClose?: () => void;
}

function EnrolledDetail({ enrollment, handleClose }: InterestDetailProp) {
  return (
    <Drawer isOpen={Boolean(enrollment)} handleClose={handleClose}>
      <Box pb="48px" mt="32px">
        <Stack spacing={"32px"}>
          <Box px="16px">
            <Box>
              <PropertyCard showLink landSize={enrollment?.landSize} property={enrollment?.property || null} />
            </Box>
          </Box>
          <Divider />
          <Box px="16px">{/* <ClientTransactionHistory enrollment={enrollment} /> */}</Box>
        </Stack>
      </Box>
    </Drawer>
  );
}

export { EnrolledDetail };
