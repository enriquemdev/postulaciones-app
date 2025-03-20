'use client'

import React, { useEffect, useState } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbar,
  GridColDef,
  GridRow,
  GridAutosizeOptions,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { esES } from "@mui/x-data-grid/locales";
import { flushSync } from "react-dom";

interface DatatableProps {
  columns: GridColDef[];
  rows: any;
}

const autosizeOptions: GridAutosizeOptions = {
  includeOutliers: true,
  includeHeaders: true,
  outliersFactor: 1.5,
  expand: true,
};

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  esES
);

export const Datatable: React.FC<DatatableProps> = ({ columns, rows }) => {
  const apiRef = useGridApiRef();
  const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      flushSync(() => {
        apiRef.current.autosizeColumns(autosizeOptions);
      });
    }, 0);

    return () => {
      clearInterval(timeoutId);
    };
  }, [apiRef]);

  useEffect(() => {
    console.log(rowSelectionModel);
  }, [rowSelectionModel]);

  const handleRowSelectionChange = (newRowSelectionModel: GridRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel.map((id) => String(id))); // Convert to string
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <DataGrid
          apiRef={apiRef}
          checkboxSelection
          disableRowSelectionOnClick
          columns={columns}
          rows={rows}
          autosizeOptions={autosizeOptions}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              csvOptions: {
                utf8WithBom: true,
              },
              printOptions: {
                hideToolbar: true,
              },
            },
          }}
          ignoreDiacritics
          onRowSelectionModelChange={handleRowSelectionChange} // Use the new handler
          rowSelectionModel={rowSelectionModel}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
        />
      </ThemeProvider>
    </>
  );
};