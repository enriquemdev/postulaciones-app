'use client';

import React, { useState, useEffect } from "react";
import { PageCard, Datatable, Titles } from "@/components/ui";
import { Box, Button } from "@mui/material";
import { getApplicationsPaginated } from "@/services/applications";
import { GridColDef } from "@mui/x-data-grid";
import { Application, PaginatedApplications } from "@/interfaces/applications";

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
  const [applications, setApplications] = useState<PaginatedApplications | null>(null);
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

  const handlePaginationModelChange = (paginationModel: { page: number; pageSize: number }) => {
    setPage(paginationModel.page);
    setPageSize(paginationModel.pageSize);
  };

  const columns: GridColDef<Application>[] = [
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <>
          <Button size="small" variant="outlined">
            Ver
          </Button>
          <Button size="small" variant="outlined">
            Editar
          </Button>
        </>
      ),
    },
    { field: "job_title", headerName: "Título del Trabajo", width: 200 },
    { field: "company_name", headerName: "Nombre de la Compañía", width: 200 },
    { field: "applicant_names", headerName: "Nombres", width: 150 },
    { field: "applicant_last_names", headerName: "Apellidos", width: 150 },
    { field: "applicant_email", headerName: "Email", width: 250 },
    { field: "applicant_phone", headerName: "Teléfono", width: 150 },
    {
      field: "employment_type.employment_type_name",
      headerName: "Tipo de Empleo",
      width: 200,
      valueGetter: (value, row) => {
        return row.employment_type.employment_type_name;;
      },
    },
    {
      field: "application_status.application_status_name",
      headerName: "Estado de la Solicitud",
      width: 200,
      valueGetter: (value, row) => {
        return row.application_status.application_status_name;
      },
    },
    
  ];

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
    </>
  );
}