import React from "react";
import { Dialog } from ".";
import { GenericDialogWrapper } from "./dialog.styles";
import { Font50018125p } from "@/utils/typography";
import { Box, Stack } from "@mui/material";
import { Button } from "../buttons";

interface Props {
  message: string;
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  declineText?: string;
  loading?: boolean;
}
function ConfirmationDialog({ message, isOpen, onClose, onConfirm, confirmText, declineText, loading }: Props) {
  return (
    <Dialog onClose={onClose} isOpen={isOpen}>
      <GenericDialogWrapper>
        <Box textAlign={"center"} py="45px">
          <Font50018125p>{message}</Font50018125p>

          <Stack width={"60%"} mx="auto" mt="30px" direction={"row"} alignItems={"center"} spacing={"16px"}>
            <Button size="small" fullWidth onClick={onClose} color="secondary" variant="contained">
              {declineText || "No"}
            </Button>
            <Button
              loading={loading}
              loadingPosition="end"
              size="small"
              fullWidth
              onClick={onConfirm}
              color="secondary"
              variant="outlined"
            >
              {confirmText || "Yes"}
            </Button>
          </Stack>
        </Box>
      </GenericDialogWrapper>
    </Dialog>
  );
}

export { ConfirmationDialog };
