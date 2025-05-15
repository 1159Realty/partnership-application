"use client";

import { Drawer } from "@/components/drawer";
import { Divider } from "@/components/divider";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Box, Stack } from "@mui/material";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { ClientTransactionHistory } from "@/components/client/ClientTransactionHistory";
import { Button } from "@/components/buttons";
import { useUserContext } from "@/contexts/UserContext";
import { hasPermission } from "@/lib/session/roles";
import { SEVERITY_COLORS } from "@/utils/colors";

interface InterestDetailProp {
  enrollment: IEnrollment | null;
  handleClose?: () => void;
  handleCancel?: (id: string | undefined) => void;
  handleResume?: (id: string | undefined) => void;
}

function EnrolledDetail({ enrollment, handleClose, handleCancel, handleResume }: InterestDetailProp) {
  const { userData } = useUserContext();
  return (
    <Drawer isOpen={Boolean(enrollment)} handleClose={handleClose}>
      <Box pb="48px" mt="32px">
        <Stack spacing={"32px"}>
          <Box px="16px">
            <PropertyCard showLink landSize={enrollment?.landSize} property={enrollment?.property || null} />
            {enrollment?.status === "CANCELLED" && (
              <Box
                textAlign={"center"}
                padding={"5px 10px"}
                borderRadius={"5px"}
                color={SEVERITY_COLORS.danger.dark}
                fontSize={14}
                bgcolor={SEVERITY_COLORS.danger.light}
                lineHeight={"20px"}
                fontWeight={500}
                mt="24px"
              >
                This enrollment has been cancelled.
              </Box>
            )}
            {hasPermission(userData?.roleId, "cancel:enrollment") &&
              enrollment?.status !== "CANCELLED" &&
              enrollment?.status !== "FREEZE" && (
                <Box mt="24px">
                  <Button
                    onClick={() => {
                      handleCancel?.(enrollment?.id);
                    }}
                    fullWidth
                    color="error"
                    sx={{ color: "white" }}
                  >
                    Cancel enrollment
                  </Button>
                </Box>
              )}
            {hasPermission(userData?.roleId, "resume:enrollment") && enrollment?.status === "FREEZE" && (
              <Box mt="24px">
                <Button
                  onClick={() => {
                    handleResume?.(enrollment?.id);
                  }}
                  fullWidth
                >
                  resume enrollment
                </Button>
              </Box>
            )}
          </Box>
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
