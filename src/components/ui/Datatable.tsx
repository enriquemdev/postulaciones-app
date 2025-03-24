"use client";

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

export const Datatable: React.FC<DatatableProps> = ({
  columns,
  rows,
  page,
  pageSize,
  rowCount,
  onPaginationModelChange,
  filterModel,
  onFilterModelChange,
  sortModel,
  onSortModelChange,
  loading,
}) => {
  const apiRef = useGridApiRef();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      flushSync(() => {
        apiRef.current.autosizeColumns(autosizeOptions);
      });
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [apiRef]);

  return (
    <ThemeProvider theme={theme}>
      <DataGrid
        loading={loading}
        apiRef={apiRef}
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
              // printOptions: {
              //   hideToolbar: true,
              // },
          },
        }}
        ignoreDiacritics
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        rowCount={rowCount}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 15, 20, 50]}
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
      />
    </ThemeProvider>
  );
};