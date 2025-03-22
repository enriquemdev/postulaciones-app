// components/JobApplicationForm.tsx
"use client";

import React, { useState, useCallback } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import {
  Education,
  Experience,
  ApplicationFormInputs,
} from "@/interfaces/applications";
import {
  ApplicationFormValidation,
  ApplicationFormInitialValues,
} from "@/forms/applications";

const steps = [
  "Información Personal",
  "Información del Empleo",
  "Educación",
  "Experiencia Laboral",
];

export const ApplicationForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<ApplicationFormInputs>({
    initialValues: ApplicationFormInitialValues,
    validationSchema: ApplicationFormValidation[activeStep],
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (activeStep === steps.length - 1) {
        setIsSubmitting(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === "cv" && value) {
            formData.append(key, value);
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });

        try {
          await axios.post("/applications", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Postulación enviada con éxito");
          formik.resetForm();
          setActiveStep(0);
        } catch (error) {
          console.error(error);
          alert("Error al enviar la postulación");
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setActiveStep((prev) => prev + 1);
      }
    },
  });

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStepContent = useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return <PersonalInfoStep1 formik={formik} />;
        case 1:
          return <JobInfoStep2 formik={formik} />;
        case 2:
          return <EducationInfoStep3 formik={formik} />;
        case 3:
          return <ExperienceInfoStep4 formik={formik} />;
        default:
          return null;
      }
    },
    [formik]
  );

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Postulación a Empleo
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={formik.handleSubmit}>
        {renderStepContent(activeStep)}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            disabled={activeStep === 0 || isSubmitting}
            onClick={handleBack}
          >
            Atrás
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {activeStep === steps.length - 1 ? "Enviar" : "Siguiente"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

const PersonalInfoStep1 = React.memo(({ formik }: { formik: any }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        name="applicant_names"
        label="Nombres"
        value={formik.values.applicant_names || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.applicant_names && Boolean(formik.errors.applicant_names)}
        helperText={formik.touched.applicant_names && formik.errors.applicant_names}
        fullWidth
      />
      <TextField
        name="applicant_last_names"
        label="Apellidos"
        value={formik.values.applicant_last_names || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.applicant_last_names && Boolean(formik.errors.applicant_last_names)}
        helperText={formik.touched.applicant_last_names && formik.errors.applicant_last_names}
        fullWidth
      />
      <TextField
        name="applicant_email"
        label="Email"
        type="email"
        value={formik.values.applicant_email || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.applicant_email && Boolean(formik.errors.applicant_email)}
        helperText={formik.touched.applicant_email && formik.errors.applicant_email}
        fullWidth
      />
      <TextField
        name="applicant_phone"
        label="Teléfono"
        value={formik.values.applicant_phone || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.applicant_phone && Boolean(formik.errors.applicant_phone)}
        helperText={formik.touched.applicant_phone && formik.errors.applicant_phone}
        fullWidth
      />
      <TextField
        name="applicant_linkedin"
        label="LinkedIn (opcional)"
        value={formik.values.applicant_linkedin || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.applicant_linkedin && Boolean(formik.errors.applicant_linkedin)}
        helperText={formik.touched.applicant_linkedin && formik.errors.applicant_linkedin}
        fullWidth
      />
      <TextField
        name="applicant_portfolio_link"
        label="Portafolio (opcional)"
        value={formik.values.applicant_portfolio_link || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.applicant_portfolio_link && Boolean(formik.errors.applicant_portfolio_link)}
        helperText={formik.touched.applicant_portfolio_link && formik.errors.applicant_portfolio_link}
        fullWidth
      />
      <TextField
        name="applicant_country"
        label="País"
        value={formik.values.applicant_country || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.applicant_country && Boolean(formik.errors.applicant_country)}
        helperText={formik.touched.applicant_country && formik.errors.applicant_country}
        fullWidth
      />
      <TextField
        name="applicant_city"
        label="Ciudad"
        value={formik.values.applicant_city || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.applicant_city && Boolean(formik.errors.applicant_city)}
        helperText={formik.touched.applicant_city && formik.errors.applicant_city}
        fullWidth
      />
      <TextField
        name="applicant_address"
        label="Dirección"
        value={formik.values.applicant_address || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.applicant_address && Boolean(formik.errors.applicant_address)}
        helperText={formik.touched.applicant_address && formik.errors.applicant_address}
        fullWidth
      />
    </Box>
  );
});
PersonalInfoStep1.displayName = "PersonalInfoStep1";

const JobInfoStep2 = React.memo(({ formik }: { formik: any }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        name="job_title"
        label="Título del empleo"
        value={formik.values.job_title || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.job_title && Boolean(formik.errors.job_title)}
        helperText={formik.touched.job_title && formik.errors.job_title}
        fullWidth
      />
      <TextField
        name="company_name"
        label="Nombre de la empresa"
        value={formik.values.company_name || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.company_name && Boolean(formik.errors.company_name)}
        helperText={formik.touched.company_name && formik.errors.company_name}
        fullWidth
      />
      <TextField
        select
        name="employment_type_id"
        label="Tipo de empleo"
        value={formik.values.employment_type_id ?? 1}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.employment_type_id && Boolean(formik.errors.employment_type_id)}
        helperText={formik.touched.employment_type_id && formik.errors.employment_type_id}
        fullWidth
      >
        <MenuItem value={1}>Tiempo completo</MenuItem>
        <MenuItem value={2}>Medio tiempo</MenuItem>
      </TextField>
      <TextField
        name="monthly_expected_salary"
        label="Salario mensual esperado"
        value={formik.values.monthly_expected_salary || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.monthly_expected_salary && Boolean(formik.errors.monthly_expected_salary)}
        helperText={formik.touched.monthly_expected_salary && formik.errors.monthly_expected_salary}
        fullWidth
      />
      <TextField
        select
        name="availability_id"
        label="Disponibilidad"
        value={formik.values.availability_id ?? 1}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.availability_id && Boolean(formik.errors.availability_id)}
        helperText={formik.touched.availability_id && formik.errors.availability_id}
        fullWidth
      >
        <MenuItem value={1}>Inmediata</MenuItem>
        <MenuItem value={2}>30 días</MenuItem>
      </TextField>
      <TextField
        select
        name="work_modality_id"
        label="Modalidad de trabajo"
        value={formik.values.work_modality_id ?? 1}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.work_modality_id && Boolean(formik.errors.work_modality_id)}
        helperText={formik.touched.work_modality_id && formik.errors.work_modality_id}
        fullWidth
      >
        <MenuItem value={1}>Presencial</MenuItem>
        <MenuItem value={2}>Remoto</MenuItem>
      </TextField>
      <TextField
        type="file"
        name="cv"
        label="CV (PDF)"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          formik.setFieldValue("cv", file || null);
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.cv && Boolean(formik.errors.cv)}
        helperText={formik.touched.cv && formik.errors.cv}
        InputLabelProps={{ shrink: true }}
        inputProps={{ accept: "application/pdf" }}
        fullWidth
      />
    </Box>
  );
});
JobInfoStep2.displayName = "JobInfoStep2";

const EducationInfoStep3 = React.memo(({ formik }: { formik: any }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {formik.values.educations.map((edu: Education, index: number) => (
        <Box key={index} sx={{ border: 1, p: 2, borderRadius: 1 }}>
          <TextField
            name={`educations[${index}].education_degree`}
            label="Título"
            value={edu.education_degree || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.educations?.[index]?.education_degree && Boolean(formik.errors.educations?.[index]?.education_degree)}
            helperText={formik.touched.educations?.[index]?.education_degree && formik.errors.educations?.[index]?.education_degree}
            fullWidth
          />
          <TextField
            name={`educations[${index}].education_institution`}
            label="Institución"
            value={edu.education_institution || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.educations?.[index]?.education_institution && Boolean(formik.errors.educations?.[index]?.education_institution)}
            helperText={formik.touched.educations?.[index]?.education_institution && formik.errors.educations?.[index]?.education_institution}
            fullWidth
          />
          <TextField
            type="date"
            name={`educations[${index}].start_date`}
            label="Fecha de inicio"
            value={edu.start_date || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.educations?.[index]?.start_date && Boolean(formik.errors.educations?.[index]?.start_date)}
            helperText={formik.touched.educations?.[index]?.start_date && formik.errors.educations?.[index]?.start_date}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            type="date"
            name={`educations[${index}].end_date`}
            label="Fecha de fin"
            value={edu.end_date || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.educations?.[index]?.end_date && Boolean(formik.errors.educations?.[index]?.end_date)}
            helperText={formik.touched.educations?.[index]?.end_date && formik.errors.educations?.[index]?.end_date}
            InputLabelProps={{ shrink: true }}
            disabled={edu.is_ongoing}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                name={`educations[${index}].is_ongoing`}
                checked={edu.is_ongoing || false}
                onChange={(e) => {
                  formik.handleChange(e);
                  if (e.target.checked) {
                    formik.setFieldValue(`educations[${index}].end_date`, "");
                  }
                }}
                onBlur={formik.handleBlur}
              />
            }
            label="En curso"
          />
        </Box>
      ))}
      <Button
        onClick={() =>
          formik.setFieldValue("educations", [
            ...formik.values.educations,
            { education_degree: "", education_institution: "", start_date: "", is_ongoing: false },
          ])
        }
      >
        Agregar Educación
      </Button>
    </Box>
  );
});
EducationInfoStep3.displayName = "EducationInfoStep3";

const ExperienceInfoStep4 = React.memo(({ formik }: { formik: any }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {formik.values.experiences.map((exp: Experience, index: number) => (
        <Box key={index} sx={{ border: 1, p: 2, borderRadius: 1 }}>
          <TextField
            name={`experiences[${index}].company_name`}
            label="Empresa"
            value={exp.company_name || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.experiences?.[index]?.company_name && Boolean(formik.errors.experiences?.[index]?.company_name)}
            helperText={formik.touched.experiences?.[index]?.company_name && formik.errors.experiences?.[index]?.company_name}
            fullWidth
          />
          <TextField
            name={`experiences[${index}].job_title`}
            label="Título del puesto"
            value={exp.job_title || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.experiences?.[index]?.job_title && Boolean(formik.errors.experiences?.[index]?.job_title)}
            helperText={formik.touched.experiences?.[index]?.job_title && formik.errors.experiences?.[index]?.job_title}
            fullWidth
          />
          <TextField
            type="date"
            name={`experiences[${index}].start_date`}
            label="Fecha de inicio"
            value={exp.start_date || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.experiences?.[index]?.start_date && Boolean(formik.errors.experiences?.[index]?.start_date)}
            helperText={formik.touched.experiences?.[index]?.start_date && formik.errors.experiences?.[index]?.start_date}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            type="date"
            name={`experiences[${index}].end_date`}
            label="Fecha de fin"
            value={exp.end_date || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.experiences?.[index]?.end_date && Boolean(formik.errors.experiences?.[index]?.end_date)}
            helperText={formik.touched.experiences?.[index]?.end_date && formik.errors.experiences?.[index]?.end_date}
            InputLabelProps={{ shrink: true }}
            disabled={exp.is_current_job}
            fullWidth
          />
          <TextField
            name={`experiences[${index}].description`}
            label="Descripción"
            value={exp.description || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            name={`experiences[${index}].location`}
            label="Ubicación"
            value={exp.location || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                name={`experiences[${index}].is_current_job`}
                checked={exp.is_current_job || false}
                onChange={(e) => {
                  formik.handleChange(e);
                  if (e.target.checked) {
                    formik.setFieldValue(`experiences[${index}].end_date`, "");
                  }
                }}
                onBlur={formik.handleBlur}
              />
            }
            label="Trabajo actual"
          />
        </Box>
      ))}
      <Button
        onClick={() =>
          formik.setFieldValue("experiences", [
            ...formik.values.experiences,
            { company_name: "", job_title: "", start_date: "", is_current_job: false },
          ])
        }
      >
        Agregar Experiencia
      </Button>
    </Box>
  );
});
ExperienceInfoStep4.displayName = "ExperienceInfoStep4";

export default ApplicationForm;