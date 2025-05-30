"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  PageCard,
  Datatable,
  Titles,
  CustomBadge,
  Loader,
} from "@/components/ui";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import { getApplicationsPaginated, markApplicationAsSeen } from "@/services";
import { GridColDef, GridFilterModel, GridSortModel } from "@mui/x-data-grid";
import { Application, PaginatedApplications } from "@/interfaces/applications";
import { ApplicationModal } from "@/components/applications";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseIcon from "@mui/icons-material/Close";
import dynamic from "next/dynamic";
import { pdfjs } from "react-pdf";
import { ErrorDialog } from "@/components/ui";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Configure the worker for react pdf
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// Dynamically load the pdf viewer component only on the client
const PDFViewer = dynamic(
  () => import("@/components/PDFViewer").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Typography>Cargando visor de PDF...</Typography>,
  }
);

export default function Listing() {
  return (
    <Box>
      <PageCard>
        <ListingPageContent />
      </PageCard>
    </Box>
  );
}

function ListingPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [applications, setApplications] =
    useState<PaginatedApplications | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await getApplicationsPaginated(page + 1, pageSize);
  //       setApplications(data);
  //     } catch (err: any) {
  //       setErrorMessage("Error al cargar las aplicaciones. Por favor, intenta de nuevo.");
  //       setOpenErrorDialog(true);
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [page, pageSize]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getApplicationsPaginated({
          page: page + 1,
          pageSize,
          filterModel,
          sortModel,
        });
        setApplications(data);
      } catch (err: any) {
        setOpenErrorDialog(true);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, filterModel, sortModel]);

  const handlePaginationModelChange = (paginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPage(paginationModel.page);
    setPageSize(paginationModel.pageSize);
  };

  const handleFilterModelChange = (model: GridFilterModel) => {
    console.log("Filter Model Changed:", model); // Add this to debug
    setFilterModel(model);
    setPage(0); // Reset to first page on filter change
  };
  
  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
    setPage(0); // Reset to first page on sort change
  };

  const handleOpenModal = async (application: Application) => {
    if (application.application_status.application_status_code === "sent") {
      try {
        await markApplicationAsSeen(application.id);
        setApplications((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            data: prev.data.map((app) =>
              app.id === application.id
                ? {
                    ...app,
                    application_status: {
                      ...app.application_status,
                      application_status_code: "seen",
                      application_status_name: "Visto",
                    },
                  }
                : app
            ),
          };
        });
      } catch (err: any) {
        setErrorMessage(
          "Error al marcar la solicitud como vista. Por favor, intenta de nuevo."
        );
        setOpenErrorDialog(true);
        console.error(err);
        return;
      }
    }

    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleOpenPDFViewer = (url: string) => {
    setPdfUrl(url);
    setIsPDFViewerOpen(true);
  };

  const handleClosePDFViewer = () => {
    setIsPDFViewerOpen(false);
    setPdfUrl(null);
  };

  const columns: GridColDef<Application>[] = useMemo(
    () => [
      {
        field: "applicant_names",
        headerName: "Nombre Completo",
        valueGetter: (value, row) => {
          return `${row.applicant_names} ${row.applicant_last_names}`;
        },
      },
      { field: "job_title", headerName: "Cargo Deseado" },
      { field: "company_name", headerName: "Nombre de la Empresa" },
      { field: "applicant_email", headerName: "Email" },
      { field: "applicant_phone", headerName: "Teléfono" },
      {
        field: "employment_type.employment_type_name",
        headerName: "Tipo de Empleo",
        valueGetter: (value, row) => {
          return row.employment_type.employment_type_name;
        },
      },
      {
        field: "application_status.application_status_name",
        headerName: "Estado de la Solicitud",
        align: "center",
        valueGetter: (value, row) => {
          return row.application_status.application_status_name;
        },
        renderCell: (params) => {
          const status_code =
            params.row.application_status.application_status_code;
          const status = params.row.application_status.application_status_name;
          let badgeColor = "primary";

          if (status_code === "sent") {
            badgeColor = "info";
          } else if (status_code === "seen") {
            badgeColor = "success";
          }

          return <CustomBadge text={status} color={badgeColor} />;
        },
      },
      {
        field: "actions",
        headerName: "Acciones",
        renderCell: (params) => (
          <>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                handleOpenModal(params.row);
              }}
              sx={{
                mr: "8px",
              }}
              startIcon={<OpenInNewIcon />}
            >
              Ver
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              sx={{
                mr: "8px",
              }}
              startIcon={<PictureAsPdfIcon />}
              onClick={() => handleOpenPDFViewer(params.row.cv_download_url)}
            >
              CV
            </Button>
            <Button
              size="small"
              variant="contained"
              color="info"
              startIcon={<DownloadIcon />}
              href={params.row.cv_download_url}
            >
              CV
            </Button>
          </>
        ),
      },
    ],
    []
  );

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
    setErrorMessage("");
  };

  return (
    <>
      <Titles
        title="Tabla de Postulaciones"
        subtitle="Lista de las postulaciones registradas mediante el formulario."
      />

      <Loader isVisible={loading} height={300} onlyFirstLoad={true} />
      {applications && (
        <Datatable
          columns={columns}
          rows={applications.data}
          page={page}
          pageSize={pageSize}
          rowCount={applications.total}
          onPaginationModelChange={handlePaginationModelChange}
          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          loading={loading}
        />
      )}

      {selectedApplication && (
        <ApplicationModal
          open={isModalOpen}
          onClose={handleCloseModal}
          application={selectedApplication}
        />
      )}

      {/* PDF viewer modal */}
      <Dialog
        open={isPDFViewerOpen}
        onClose={handleClosePDFViewer}
        fullScreen={fullScreen}
        maxWidth="lg"
        fullWidth={!fullScreen}
        sx={{
          "& .MuiDialog-paper": {
            display: "flex",
            flexDirection: "column",
            margin: fullScreen ? 0 : "32px",
            width: fullScreen ? "100%" : "auto",
            height: fullScreen ? "100%" : "auto",
          },
        }}
      >
        <DialogTitle>
          Vista Previa del CV
          <IconButton
            aria-label="close"
            onClick={handleClosePDFViewer}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            overflowY: "auto",
            flex: 1,
            padding: fullScreen ? 1 : 2,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          {pdfUrl && <PDFViewer pdfUrl={pdfUrl} />}
        </DialogContent>
        <DialogActions sx={{ p: fullScreen ? 1 : 2 }}>
          <Button onClick={handleClosePDFViewer} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <ErrorDialog
        open={openErrorDialog}
        message={errorMessage || "Ha ocurrido un error inesperado."}
        onClose={handleCloseErrorDialog}
        acceptText="Aceptar"
      />
    </>
  );
}
