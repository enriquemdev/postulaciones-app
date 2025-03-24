"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ErrorDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
  acceptText?: string;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  open,
  message,
  onClose,
  acceptText = "Aceptar",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
    >
      <DialogTitle id="error-dialog-title">Error</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {acceptText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};