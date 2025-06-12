"use client";

import { Drawer } from "@/components/drawer";
import { Divider } from "@/components/divider";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Box, Stack } from "@mui/material";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { ClientTransactionHistory } from "@/components/client/ClientTransactionHistory";
import { SEVERITY_COLORS } from "@/utils/colors";
import { useUserContext } from "@/contexts/UserContext";

interface InterestDetailProp {
  enrollment: IEnrollment | null;
  handleClose?: () => void;
}

function EnrolledDetail({ enrollment, handleClose }: InterestDetailProp) {
  const { userData } = useUserContext();

  const isEnrollmentOwner = userData?.id === enrollment?.client?.id;
  const isInactive = enrollment?.status === "FREEZE" || enrollment?.status === "CANCELLED";

  return (
    <Drawer isOpen={Boolean(enrollment)} handleClose={handleClose}>
      <Box pb="48px" mt="32px">
        <Stack spacing={"32px"}>
          <Box px="16px">
            <Box>
              <PropertyCard showLink property={enrollment?.property || null} />
            </Box>
          </Box>
          {isInactive && isEnrollmentOwner && (
            <Stack alignItems={"center"} px="16px">
              <Box
                textAlign={"center"}
                padding={"5px 10px"}
                borderRadius={"5px"}
                color={SEVERITY_COLORS.danger.dark}
                fontSize={14}
                bgcolor={SEVERITY_COLORS.danger.light}
                lineHeight={"20px"}
                fontWeight={500}
              >
                This enrollment has been annulled! For more information contact support.
              </Box>
            </Stack>
          )}{" "}
          {enrollment?.status === "COMPLETED" && isEnrollmentOwner && (
            <Stack alignItems={"center"} px="16px">
              <Box
                textAlign={"center"}
                padding={"5px 10px"}
                borderRadius={"5px"}
                color={SEVERITY_COLORS.success.dark}
                fontSize={14}
                bgcolor={SEVERITY_COLORS.success.light}
                lineHeight={"20px"}
                fontWeight={500}
              >
                Congratulations! You have completed payment for this property.
              </Box>
            </Stack>
          )}
          <Divider />
          <Box px="16px">
            <ClientTransactionHistory enrollment={enrollment} />
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}

export { EnrolledDetail };
