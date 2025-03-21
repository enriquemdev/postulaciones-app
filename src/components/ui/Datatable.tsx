'use client'

import React, { useEffect } from "react";
import {
  DataGrid,
  useGridApiRef,
  GridToolbar,
  GridAutosizeOptions,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { esES } from "@mui/x-data-grid/locales";
import { flushSync } from "react-dom";
import { DatatableProps } from "@/interfaces/common";

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

export const Datatable: React.FC<DatatableProps> = ({ columns,
  rows,
  page,
  pageSize,
  rowCount,
  onPaginationModelChange,
 }) => {
  const apiRef = useGridApiRef();

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

  return (
    <>
      <ThemeProvider theme={theme}>
        <DataGrid
          apiRef={apiRef}
          // checkboxSelection
          // disableRowSelectionOnClick
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
          // onRowSelectionModelChange={handleRowSelectionChange} // Use the new handler
          // rowSelectionModel={rowSelectionModel}
          // initialState={{
          //   pagination: { paginationModel: { pageSize: 25 } },
          // }}
          paginationMode="server" // Enable server-side pagination
          sortingMode="server"
          filterMode="server"
          rowCount={rowCount} // Pass rowCount from props
          paginationModel={{ page, pageSize }} // Pass page and pageSize from props
          onPaginationModelChange={onPaginationModelChange} // Handle pagination change
          pageSizeOptions={[5, 10, 15, 20, 50]}
          disableRowSelectionOnClick
          density="comfortable"
        />
      </ThemeProvider>
    </>
  );
};