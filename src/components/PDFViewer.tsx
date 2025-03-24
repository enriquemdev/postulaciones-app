// src/components/PDFViewer.tsx
"use client";

import React, { useState, useEffect } from "react";
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
import RotateRightIcon from "@mui/icons-material/RotateRight";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { usePDFSlick, PDFSlickViewer } from "@pdfslick/react";

// Importar los estilos de PDFSlick
import "@pdfslick/react/dist/pdf_viewer.css";

interface PDFViewerProps {
  pdfUrl: string; // URL original del PDF (no la URL local)
}

function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [singlePageView, setSinglePageView] = useState(true);

  // Descargar el PDF y crear una URL local
  useEffect(() => {
    let urlToRevoke: string | null = null;

    const fetchPDF = async () => {
      try {
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error("Error al descargar el PDF");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        urlToRevoke = url; // Guardamos la URL para revocarla más tarde
        setLocalUrl(url);
      } catch (err) {
        console.error("Error al cargar el PDF:", err);
        setError("No se pudo cargar el PDF. Por favor, intenta descargarlo.");
      }
    };

    fetchPDF();

    return () => {
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
    };
  }, [pdfUrl]); // Solo `pdfUrl` como dependencia

  // Configuración de PDFSlick
  const { viewerRef, usePDFSlickStore, PDFSlickViewer } = usePDFSlick(localUrl ?? undefined, {
    scaleValue: "page-fit",
    singlePageViewer: singlePageView,
    rotation: rotation,
  });

  // Obtener el estado del PDF usando usePDFSlickStore
  const pdfSlickState = usePDFSlickStore((state) => ({
    pdfSlick: state.pdfSlick,
    pageNumber: state.pageNumber,
    numPages: state.numPages,
    scale: state.scale,
  }));

  const { pdfSlick, pageNumber, numPages, scale } = pdfSlickState || {
    pdfSlick: null,
    pageNumber: 1,
    numPages: 0,
    scale: 1,
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!localUrl || !PDFSlickViewer) {
    return <Typography>Cargando PDF...</Typography>;
  }

  return (
    <>
      {/* Barra de herramientas */}
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
        {/* Navegación de páginas */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Primera página">
            <span>
              <IconButton
                onClick={() => pdfSlick?.gotoPage(1)}
                disabled={pageNumber <= 1}
              >
                <FirstPageIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Página anterior">
            <span>
              <IconButton
                onClick={() => pdfSlick?.gotoPage(Math.max(pageNumber - 1, 1))}
                disabled={pageNumber <= 1}
              >
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
                if (pageNum >= 1 && pageNum <= numPages) {
                  pdfSlick?.gotoPage(pageNum);
                }
              }}
              sx={{ width: "60px" }}
            />
            <Typography variant="body2">/ {numPages}</Typography>
          </Box>
          <Tooltip title="Página siguiente">
            <span>
              <IconButton
                onClick={() => pdfSlick?.gotoPage(Math.min(pageNumber + 1, numPages))}
                disabled={pageNumber >= numPages}
              >
                <NavigateNextIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Última página">
            <span>
              <IconButton
                onClick={() => pdfSlick?.gotoPage(numPages)}
                disabled={pageNumber >= numPages}
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
              <IconButton
                onClick={() => pdfSlick?.zoomOut()}
                disabled={scale <= 0.2}
              >
                <ZoomOutIcon />
              </IconButton>
            </span>
          </Tooltip>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Zoom</InputLabel>
            <Select
              value={scale}
              onChange={(e) => pdfSlick?.zoomTo(e.target.value as number | string)}
              label="Zoom"
            >
              <MenuItem value={0.5}>50%</MenuItem>
              <MenuItem value={0.75}>75%</MenuItem>
              <MenuItem value={1}>100%</MenuItem>
              <MenuItem value={1.25}>125%</MenuItem>
              <MenuItem value={1.5}>150%</MenuItem>
              <MenuItem value={2}>200%</MenuItem>
              <MenuItem value="page-fit">Ajustar a página</MenuItem>
              <MenuItem value="page-width">Ajustar a ancho</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Aumentar zoom">
            <span>
              <IconButton
                onClick={() => pdfSlick?.zoomIn()}
                disabled={scale >= 5}
              >
                <ZoomInIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Controles de rotación y modo de vista */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Rotar a la derecha">
            <IconButton
              onClick={() => {
                const newRotation = (rotation + 90) % 360;
                setRotation(newRotation);
                pdfSlick?.rotate(newRotation);
              }}
            >
              <RotateRightIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={singlePageView ? "Vista de dos páginas" : "Vista de una página"}>
            <IconButton onClick={() => setSinglePageView((prev) => !prev)}>
              {singlePageView ? <ViewColumnIcon /> : <ViewStreamIcon />}
            </IconButton>
          </Tooltip>
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
          position: "relative",
          height: "70vh",
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
      </Box>
    </>
  );
}

export default PDFViewer;