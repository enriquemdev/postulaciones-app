import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Avatar,
  List,
  ListItemText,
  ListItemIcon,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Box,
  IconButton,
} from "@mui/material";
import {
  Close,
  Download,
  Work,
  School,
  Email,
  LocationOn,
  Business,
  Event,
  ExpandMore,
  Link as LinkIcon,
  Person,
} from "@mui/icons-material";
import { Application, Education, Experience } from "@/interfaces/applications";
import Grid from '@mui/material/Grid2';

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  application: Application;
}

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Grid container spacing={1} sx={{ mb: 1 }}>
    <Grid size={4}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid size={8}>
      <Typography variant="body2" component="div">
        {value}
      </Typography>
    </Grid>
  </Grid>
);

const EducationExperienceSection = ({
  items,
  type,
}: {
  items: Education[] | Experience[];
  type: "education" | "experience";
}) => (
  <List dense sx={{ width: "100%" }}>
    {items.map((item, index) => (
      <Accordion key={index} elevation={0} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            {type === "education" ? (
              <School fontSize="small" />
            ) : (
              <Work fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              type === "education"
                ? (item as Education).education_degree
                : (item as Experience).job_title
            }
            secondary={
              type === "education"
                ? (item as Education).education_institution
                : (item as Experience).company_name
            }
          />
        </AccordionSummary>
        <AccordionDetails>
          {type === "education" ? (
            <>
              <DetailItem
                label="Institución"
                value={(item as Education).education_institution}
              />
              <DetailItem
                label="Fecha Inicio"
                value={(item as Education).start_date}
              />
              <DetailItem
                label="Fecha Fin"
                value={
                  (item as Education).is_ongoing
                    ? "En curso"
                    : (item as Education).end_date || "No especificado"
                }
              />
            </>
          ) : (
            <>
              <DetailItem
                label="Empresa"
                value={(item as Experience).company_name}
              />
              <DetailItem
                label="Cargo"
                value={(item as Experience).job_title}
              />
              <DetailItem
                label="Ubicación"
                value={(item as Experience).location || "No especificado"}
              />
              <DetailItem
                label="Periodo"
                value={`${(item as Experience).start_date} - ${
                  (item as Experience).is_current_job
                    ? "Presente"
                    : item.end_date ? ((item as Experience).end_date) : ("No especificado")
                }`}
              />
              <Typography variant="body2" sx={{ mt: 1 }} component="div">
                {(item as Experience).description ||
                  "Sin descripción adicional"}
              </Typography>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    ))}
  </List>
);

export const ApplicationModal = ({
  open,
  onClose,
  application,
}: ApplicationModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <Person />
          </Avatar>
          <div>
            <Typography variant="h6">
              {application.applicant_names} {application.applicant_last_names}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Postulación para {application.job_title}
            </Typography>
          </div>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Sección Información Básica */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Email fontSize="small" /> Información de Contacto
            </Typography>
            <DetailItem label="Email" value={application.applicant_email} />
            <DetailItem label="Teléfono" value={application.applicant_phone} />
            <DetailItem
              label="LinkedIn"
              value={
                application.applicant_linkedin ? (
                  <Link href={application.applicant_linkedin} target="_blank">
                    <LinkIcon
                      fontSize="small"
                      sx={{ verticalAlign: "middle", mr: 0.5 }}
                    />
                    {application.applicant_linkedin}
                  </Link>
                ) : (
                  "No especificado"
                )
              }
            />

            <DetailItem
              label="Portafolio"
              value={
                application.applicant_portfolio_link ? (
                  <Link
                  href={application.applicant_portfolio_link}
                  target="_blank"
                >
                  <LinkIcon
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 0.5 }}
                  />
                  {application.applicant_portfolio_link}
                </Link>
                ) : (
                  "No especificado"
                )
              }
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <LocationOn fontSize="small" /> Ubicación
            </Typography>
            <DetailItem label="País" value={application.applicant_country} />
            <DetailItem label="Ciudad" value={application.applicant_city} />
            <DetailItem
              label="Dirección"
              value={application.applicant_address}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Sección Preferencias Laborales */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Work fontSize="small" /> Detalles del Puesto
            </Typography>
            <DetailItem label="Empresa" value={application.company_name} />
            <DetailItem
              label="Tipo de Contrato"
              value={application.employment_type.employment_type_name}
            />
            <DetailItem
              label="Modalidad"
              value={application.work_modality.work_modality_name}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Event fontSize="small" /> Disponibilidad y Expectativas
            </Typography>
            <DetailItem
              label="Disponibilidad"
              value={application.availability.availability_name}
            />
            <DetailItem
              label="Salario Esperado"
              value={`$${application.monthly_expected_salary.toLocaleString()}`}
            />
            <DetailItem
              label="Estado"
              value={
                <Chip
                  label={application.application_status.application_status_name}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              }
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Sección Formación Académica */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <School fontSize="small" /> Formación Académica
          </Typography>
          <EducationExperienceSection
            items={application.educations}
            type="education"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sección Experiencia Laboral */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Business fontSize="small" /> Experiencia Laboral
          </Typography>
          <EducationExperienceSection
            items={application.experiences}
            type="experience"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sección Técnica */}
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            <Typography variant="subtitle2" gutterBottom>
              Información Técnica
            </Typography>
            <DetailItem
              label="CV"
              value={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  href={application.cv_download_url}
                >
                  Descargar CV ({application.cv_pages_count} página
                  {application.cv_pages_count > 1 ? "s" : ""})
                </Button>
              }
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            <Typography variant="subtitle2" gutterBottom>
              Metadatos
            </Typography>
            <DetailItem
              label="Fecha de Postulación"
              value={application.created_at}
            />
            <DetailItem label="IP" value={application.ip_address} />
            <DetailItem label="User Agent" value={application.user_agent} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<Close />}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
