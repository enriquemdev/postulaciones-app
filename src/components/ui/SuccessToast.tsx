"use client";

import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SuccessToastProps {
  open: boolean;
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  open,
  message,
  onClose,
  autoHideDuration = 6000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};