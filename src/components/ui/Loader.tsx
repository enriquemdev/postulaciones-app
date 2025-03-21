'use client';

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";

export function Loader({
  isVisible,
  height,
  onlyFirstLoad,
}: {
  isVisible: boolean;
  height: number;
  onlyFirstLoad: boolean;
}) {
  const [showLoader, setShowLoader] = useState(isVisible); // Track initial visibility

  useEffect(() => {
    if (!isVisible && onlyFirstLoad) {
      setShowLoader(false); // Hide after first load if onlyFirstLoad is true
    }
  }, [isVisible, onlyFirstLoad]);

  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: height,
        display: showLoader ? "flex" : "none",
      }}
    >
      <CircularProgress />
    </Box>
  );
}