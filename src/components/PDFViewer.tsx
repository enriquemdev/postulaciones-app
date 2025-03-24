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

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          p: 1,
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Primera página">
            <span>
              <IconButton onClick={goToFirstPage} disabled={pageNumber <= 1}>
                <FirstPageIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Página anterior">
            <span>
              <IconButton onClick={goToPrevPage} disabled={pageNumber <= 1}>
                <NavigateBeforeIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              sx={{ width: "60px" }}
            />
            <Typography variant="body2">/ {numPages || 0}</Typography>
          </Box>
          <Tooltip title="Página siguiente">
            <span>
              <IconButton
                onClick={goToNextPage}
                disabled={pageNumber >= (numPages || 1)}
              >
                <NavigateNextIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Última página">
            <span>
              <IconButton
                onClick={goToLastPage}
                disabled={pageNumber >= (numPages || 1)}
              >
                <LastPageIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Controles de zoom */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Reducir zoom">
            <span>
              <IconButton onClick={zoomOut} disabled={scale <= 0.5}>
                <ZoomOutIcon />
              </IconButton>
            </span>
          </Tooltip>
          <FormControl size="small" sx={{ minWidth: 120 }}>
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
              <IconButton onClick={zoomIn} disabled={scale >= 3.0}>
                <ZoomInIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Botón de descarga */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Descargar PDF">
            <IconButton href={pdfUrl} download="cv.pdf">
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Visor del PDF */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: "4px",
          overflow: "hidden",
          minHeight: "500px",
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
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </Box>
    </>
  );
}

export default PDFViewer;