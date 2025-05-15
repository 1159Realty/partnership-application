"use client";

import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useAlertContext } from "@/contexts/AlertContext";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

export const ToastContainer = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toast = () => {
  const { alert, setAlert } = useAlertContext();

  const { hide, severity, show, message } = alert;

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, show: false });
  };

  const action = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <X />
    </IconButton>
  );

  return (
    <Snackbar
      open={show}
      autoHideDuration={hide || 4000}
      onClose={handleClose}
      action={action}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <ToastContainer onClose={handleClose} variant="filled" severity={severity}>
        {message}
      </ToastContainer>
    </Snackbar>
  );
};

export { Toast };
