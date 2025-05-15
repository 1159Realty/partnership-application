import React, { useState } from "react";
import { Dialog } from ".";
import { GenericDialogWrapper } from "./dialog.styles";
import { ErrorText, Font50018125p } from "@/utils/typography";
import { Box, Stack } from "@mui/material";
import { Button } from "../buttons";
import { TextField } from "../Inputs";

interface Props {
  message: string;
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: (value: string) => void;
  confirmText?: string;
  declineText?: string;
  loading?: boolean;
}
function ConfirmationWithInputDialog({ message, isOpen, onClose, onConfirm, confirmText, declineText, loading }: Props) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onConfirm?.(reason);
  };
  const handleChange = (value: string) => {
    setError(false);
    setReason(value);
  };

  return (
    <Dialog onClose={onClose} isOpen={isOpen}>
      <GenericDialogWrapper>
        <Box py="45px">
          <Font50018125p style={{ textAlign: "center", display: "inline-block" }}>{message}</Font50018125p>
          <Box mx="auto" my="20px">
            <TextField
              onChange={(e) => handleChange(e.target.value)}
              value={reason}
              placeholder="Type the reason here..."
              multiline
              rows={5}
            />
            {error && <ErrorText>This field is required</ErrorText>}
          </Box>

          <Stack width={"60%"} mx="auto" mt="30px" direction={"row"} alignItems={"center"} spacing={"16px"}>
            <Button size="small" fullWidth onClick={onClose} color="secondary" variant="contained">
              {declineText || "No"}
            </Button>
            <Button
              loading={loading}
              loadingPosition="end"
              size="small"
              fullWidth
              onClick={handleSubmit}
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

export { ConfirmationWithInputDialog };
