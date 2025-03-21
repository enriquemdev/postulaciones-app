'use client';

import React, { useState, useEffect, useMemo } from "react";
import { PageCard, Datatable, Titles, CustomBadge } from "@/components/ui";
import { Box, Button } from "@mui/material";
import { getApplicationsPaginated } from "@/services/applications";
import { GridColDef } from "@mui/x-data-grid";
import { Application, PaginatedApplications } from "@/interfaces/applications";
import { ApplicationModal } from "@/components/applications";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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

  const handleOpenModal = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };
  const [applications, setApplications] =
    useState<PaginatedApplications | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getApplicationsPaginated(page + 1, pageSize);
        setApplications(data);
      } catch (err: any) {
        setError(err.message || "Error fetching applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]);

  const handlePaginationModelChange = (paginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPage(paginationModel.page);
    setPageSize(paginationModel.pageSize);
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
          // console.log(params, params.row);
          const status_code =
            params.row.application_status.application_status_code;
          const status = params.row.application_status.application_status_name;
          let badgeColor = "primary";

          if (status_code === "sent") {
            badgeColor = "info";
          } else if (status_code === "seen") {
            badgeColor = "success";
          }
          // console.log(status, badgeColor);

          return <CustomBadge text={status} color={badgeColor} />;
        },
      },
      {
        field: "actions",
        headerName: "Acciones",
        renderCell: (params) =>(
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Titles
        title="Tabla de Postulaciones"
        subtitle="Lista de las postulaciones registradas mediante el formulario."
      />
      {applications && (
        <Datatable
          columns={columns}
          rows={applications.data}
          page={page}
          pageSize={pageSize}
          rowCount={applications.total}
          onPaginationModelChange={handlePaginationModelChange}
        />
      )}

      {selectedApplication && (
        <ApplicationModal
          open={isModalOpen}
          onClose={handleCloseModal}
          application={selectedApplication}
        />
      )}
    </>
  );
}
