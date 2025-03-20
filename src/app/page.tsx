import { Datatable } from "@/components/ui";
import { Box } from "@mui/material";

const columns = [
  { field: "code_customer", headerName: "Código de cliente" },
  { field: "service_number", headerName: "Número de servicio" },
];

const rows = [
  { id: "1", code_customer: "CUST-123", service_number: "SERV-456" },
  { id: "2", code_customer: "CUST-789", service_number: "SERV-012" },
  { id: "3", code_customer: "CUST-345", service_number: "SERV-678" },
  { id: "4", code_customer: "CUST-901", service_number: "SERV-234" },
];

export default function Listing() {
  return (
    <Box>
     <Datatable columns={columns} rows={rows} />
    </Box>
  );
}
