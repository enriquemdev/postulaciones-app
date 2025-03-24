"use client";

import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Typography,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

interface PDFViewerProps {
  pdfUrl: string;
}

function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  const zoomOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error("Error al cargar el PDF:", err);
    setError("No se pudo cargar el PDF. Por favor, intenta descargarlo.");
  };

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  const goToFirstPage = () => setPageNumber(1);
  const goToLastPage = () => setPageNumber(numPages || 1);

  const zoomIn = () => {
    setScale((prev) => {
      const nextScale = prev + 0.25;
      const validScale = zoomOptions.reduce((a, b) =>
        Math.abs(b - nextScale) < Math.abs(a - nextScale) ? b : a
      );
      return Math.min(validScale, 2);
    });
  };

  const zoomOut = () => {
    setScale((prev) => {
      const nextScale = prev - 0.25;
      const validScale = zoomOptions.reduce((a, b) =>
        Math.abs(b - nextScale) < Math.abs(a - nextScale) ? b : a
      );
      return Math.max(validScale, 0.5);
    });
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          p: 1,
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          gap: isMobile ? 2 : 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexWrap: "wrap",
          }}
        >
          <Tooltip title="Primera página">
            <span>
              <IconButton size="small" onClick={goToFirstPage} disabled={pageNumber <= 1}>
                <FirstPageIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Página anterior">
            <span>
              <IconButton size="small" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                <NavigateBeforeIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TextField
              type="number"
              size="small"
              value={pageNumber}
              onChange={(e) => {
                const pageNum = parseInt(e.target.value);
                if (pageNum >= 1 && pageNum <= (numPages || 1)) {
                  setPageNumber(pageNum);
                }
              }}
              sx={{ width: "50px" }}
            />
            <Typography variant="body2">/ {numPages || 0}</Typography>
          </Box>
          <Tooltip title="Página siguiente">
            <span>
              <IconButton
                size="small"
                onClick={goToNextPage}
                disabled={pageNumber >= (numPages || 1)}
              >
                <NavigateNextIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Última página">
            <span>
              <IconButton
                size="small"
                onClick={goToLastPage}
                disabled={pageNumber >= (numPages || 1)}
              >
                <LastPageIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Controles de zoom */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexWrap: "wrap",
          }}
        >
          <Tooltip title="Reducir zoom">
            <span>
              <IconButton size="small" onClick={zoomOut} disabled={scale <= 0.5}>
                <ZoomOutIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel>Zoom</InputLabel>
            <Select
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              label="Zoom"
            >
              <MenuItem value={0.5}>50%</MenuItem>
              <MenuItem value={0.75}>75%</MenuItem>
              <MenuItem value={1}>100%</MenuItem>
              <MenuItem value={1.25}>125%</MenuItem>
              <MenuItem value={1.5}>150%</MenuItem>
              <MenuItem value={2}>200%</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Aumentar zoom">
            <span>
              <IconButton size="small" onClick={zoomIn} disabled={scale >= 2}>
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Botón de descarga */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Descargar PDF">
            <IconButton size="small" href={pdfUrl} download="cv.pdf">
              <FileDownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Visor del PDF */}
      <Box
        sx={{
          width: "100%",
          overflow: "auto",
          border: "1px solid #ccc",
          borderRadius: "4px",
          minHeight: isMobile ? "auto" : "500px",
          maxHeight: isMobile ? "70vh" : "80vh",
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<Typography>Cargando PDF...</Typography>}
        >
          <Page
            key={`page_${pageNumber}`}
            pageNumber={pageNumber}
            scale={isMobile ? scale * 0.75 : scale}
            width={isMobile ? undefined : 800}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </Box>
    </>
  );
}

export default PDFViewer;