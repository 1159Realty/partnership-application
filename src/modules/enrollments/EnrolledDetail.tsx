"use client";

import { Drawer } from "@/components/drawer";
import { Divider } from "@/components/divider";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Box, Skeleton, Stack } from "@mui/material";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { ClientTransactionHistory } from "@/components/client/ClientTransactionHistory";
import { Button } from "@/components/buttons";
import { useUserContext } from "@/contexts/UserContext";
import { hasPermission } from "@/lib/session/roles";
import { SEVERITY_COLORS } from "@/utils/colors";
import { useState } from "react";
import { CheckSquare, XSquare } from "@phosphor-icons/react/dist/ssr";
import { TextField } from "@/components/Inputs";
import { useEnrollment } from "@/lib/api/enrollment/useEnrollment";
import { useAlertContext } from "@/contexts/AlertContext";
import { ErrorText } from "@/utils/typography";

interface InterestDetailProp {
  enrollment: IEnrollment | null;
  handleClose?: () => void;
  handleCancel?: (id: string | undefined) => void;
  handleResume?: (id: string | undefined) => void;
  onAddPlotId?: () => void;
}

function EnrolledDetail({ enrollment, handleClose, onAddPlotId, handleCancel, handleResume }: InterestDetailProp) {
  const { userData } = useUserContext();
  const { setAlert } = useAlertContext();
  const { addPlotId } = useEnrollment();

  const [plotId, setPlotId] = useState("");
  const [addPlotIdActive, setAddPlotIdActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleAddPlotId() {
    if (!enrollment?.id) return;
    if (!plotId) {
      setHasError(true);
      return;
    }
    setLoading(true);
    const res = await addPlotId(enrollment.id, plotId);
    if (res) {
      setAlert({
        show: true,
        message: "Plot Id added successfully",
        severity: "success",
      });
      onAddPlotId?.();
      setAddPlotIdActive(false);
    }

    setLoading(false);
  }

  return (
    <Drawer
      isOpen={Boolean(enrollment)}
      handleClose={() => {
        handleClose?.();
        setAddPlotIdActive(false);
      }}
    >
      <Box pb="48px" mt="32px">
        <Stack spacing={"32px"}>
          <Box px="16px">
            <PropertyCard showLink landSize={enrollment?.landSize} property={enrollment?.property || null} />
            <Box mt="15px">
              {addPlotIdActive ? (
                <Stack spacing={"10px"}>
                  <Box>
                    <TextField
                      size="small"
                      onChange={(e) => {
                        setHasError(false);
                        setPlotId(e.target.value);
                      }}
                      name="plotId"
                      value={plotId}
                      label="Plot Id"
                    />
                    {hasError && (
                      <Box>
                        <ErrorText>Plot Id is required</ErrorText>
                      </Box>
                    )}
                  </Box>

                  <Stack alignItems={"center"} direction={"row"} spacing={"5px"}>
                    {loading ? (
                      <Skeleton variant="rounded" height={28} width={28} />
                    ) : (
                      <CheckSquare onClick={handleAddPlotId} cursor={"pointer"} weight="fill" color="green" size={35} />
                    )}
                    <XSquare
                      onClick={() => {
                        if (loading) return;
                        setAddPlotIdActive(false);
                      }}
                      cursor={"pointer"}
                      weight="fill"
                      color={loading ? "grey" : "#c31919"}
                      size={35}
                    />
                  </Stack>
                </Stack>
              ) : (
                <Button
                  onClick={() => setAddPlotIdActive(true)}
                  color="secondary"
                  disableElevation={false}
                  not_rounded
                  padding="5px 12px"
                >
                  Add Plot Id
                </Button>
              )}
            </Box>

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
