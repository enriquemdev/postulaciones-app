import { GridColDef } from "@mui/x-data-grid";

export interface DatatableProps {
  columns: GridColDef[];
  rows: any[];
  page: number;
  pageSize: number;
  rowCount: number;
  onPaginationModelChange: (paginationModel: {
    page: number;
    pageSize: number;
  }) => void;
}
