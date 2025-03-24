import {
  GridColDef,
  GridRowModel,
  GridPaginationModel,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";

export interface DatatableProps {
  columns: GridColDef[];
  rows: GridRowModel[];
  page: number;
  pageSize: number;
  rowCount: number;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  filterModel: GridFilterModel;
  onFilterModelChange: (model: GridFilterModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  loading: boolean;
}