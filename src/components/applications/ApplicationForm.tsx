// components/JobApplicationForm.tsx
'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

// Tipos basados en las reglas de Laravel
interface Education {
  education_degree: string;
  education_institution: string;
  start_date: string;
  end_date?: string;
  is_ongoing: boolean;
}

interface Experience {
  company_name: string;
  job_title: string;
  start_date: string;
  end_date?: string;
  description?: string;
  location?: string;
  is_current_job: boolean;
}

interface FormValues {
  job_title: string;
  company_name: string;
  employment_type_id: string;
  applicant_names: string;
  applicant_last_names: string;
  applicant_email: string;
  applicant_phone: string;
  applicant_linkedin?: string;
  applicant_portfolio_link?: string;
  applicant_country: string;
  applicant_city: string;
  applicant_address: string;
  cv: File | null;
  monthly_expected_salary: string;
  availability_id: string;
  work_modality_id: string;
  educations: Education[];
  experiences: Experience[];
}

// Esquema de validación con Yup
const validationSchema = [
  // Step 1: Información personal
  Yup.object({
    applicant_names: Yup.string().max(255).required('Requerido'),
    applicant_last_names: Yup.string().max(255).required('Requerido'),
    applicant_email: Yup.string().email('Email inválido').max(255).required('Requerido'),
    applicant_phone: Yup.string().max(20).required('Requerido'),
    applicant_linkedin: Yup.string().url('URL inválida').max(255).nullable(),
    applicant_portfolio_link: Yup.string().url('URL inválida').max(255).nullable(),
    applicant_country: Yup.string().max(255).required('Requerido'),
    applicant_city: Yup.string().max(255).required('Requerido'),
    applicant_address: Yup.string().max(255).required('Requerido'),
  }),
  // Step 2: Información del empleo
  Yup.object({
    job_title: Yup.string().max(255).required('Requerido'),
    company_name: Yup.string().max(255).required('Requerido'),
    employment_type_id: Yup.string().required('Requerido'),
    monthly_expected_salary: Yup.string()
      .matches(/^\d+(\.\d{1,2})?$/, 'Formato inválido')
      .required('Requerido'),
    availability_id: Yup.string().required('Requerido'),
    work_modality_id: Yup.string().required('Requerido'),
    cv: Yup.mixed()
      .required('Requerido')
      .test('fileType', 'Solo PDF', (value) => value && value.type === 'application/pdf')
      .test('fileSize', 'Máximo 50MB', (value) => value && value.size <= 51200 * 1024),
  }),
  // Step 3: Educación
  Yup.object({
    educations: Yup.array()
      .of(
        Yup.object({
          education_degree: Yup.string().max(255).required('Requerido'),
          education_institution: Yup.string().max(255).required('Requerido'),
          start_date: Yup.date().required('Requerido'),
          end_date: Yup.date()
            .min(Yup.ref('start_date'), 'Debe ser posterior a la fecha de inicio')
            .nullable(),
          is_ongoing: Yup.boolean().required('Requerido'),
        })
      )
      .min(1, 'Debe agregar al menos una educación')
      .required('Requerido'),
  }),
  // Step 4: Experiencia
  Yup.object({
    experiences: Yup.array()
      .of(
        Yup.object({
          company_name: Yup.string().max(255).required('Requerido'),
          job_title: Yup.string().max(255).required('Requerido'),
          start_date: Yup.date().required('Requerido'),
          end_date: Yup.date()
            .min(Yup.ref('start_date'), 'Debe ser posterior a la fecha de inicio')
            .nullable(),
          description: Yup.string().nullable(),
          location: Yup.string().max(255).nullable(),
          is_current_job: Yup.boolean().required('Requerido'),
        })
      )
      .min(1, 'Debe agregar al menos una experiencia')
      .required('Requerido'),
  }),
];

const steps = [
  'Información Personal',
  'Información del Empleo',
  'Educación',
  'Experiencia Laboral',
];

const JobApplicationForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      job_title: '',
      company_name: '',
      employment_type_id: '',
      applicant_names: '',
      applicant_last_names: '',
      applicant_email: '',
      applicant_phone: '',
      applicant_linkedin: '',
      applicant_portfolio_link: '',
      applicant_country: '',
      applicant_city: '',
      applicant_address: '',
      cv: null,
      monthly_expected_salary: '',
      availability_id: '',
      work_modality_id: '',
      educations: [],
      experiences: [],
    },
    validationSchema: validationSchema[activeStep],
    onSubmit: async (values) => {
      if (activeStep === steps.length - 1) {
        setIsSubmitting(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'cv' && value) {
            formData.append(key, value);
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });

        try {
          await axios.post('/api/job-applications', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          alert('Postulación enviada con éxito');
          formik.resetForm();
          setActiveStep(0);
        } catch (error) {
          console.error(error);
          alert('Error al enviar la postulación');
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setActiveStep((prev) => prev + 1);
      }
    },
  });

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="applicant_names"
              label="Nombres"
              value={formik.values.applicant_names}
              onChange={formik.handleChange}
              error={formik.touched.applicant_names && Boolean(formik.errors.applicant_names)}
              helperText={formik.touched.applicant_names && formik.errors.applicant_names}
              fullWidth
            />
            <TextField
              name="applicant_last_names"
              label="Apellidos"
              value={formik.values.applicant_last_names}
              onChange={formik.handleChange}
              error={formik.touched.applicant_last_names && Boolean(formik.errors.applicant_last_names)}
              helperText={formik.touched.applicant_last_names && formik.errors.applicant_last_names}
              fullWidth
            />
            <TextField
              name="applicant_email"
              label="Email"
              type="email"
              value={formik.values.applicant_email}
              onChange={formik.handleChange}
              error={formik.touched.applicant_email && Boolean(formik.errors.applicant_email)}
              helperText={formik.touched.applicant_email && formik.errors.applicant_email}
              fullWidth
            />
            <TextField
              name="applicant_phone"
              label="Teléfono"
              value={formik.values.applicant_phone}
              onChange={formik.handleChange}
              error={formik.touched.applicant_phone && Boolean(formik.errors.applicant_phone)}
              helperText={formik.touched.applicant_phone && formik.errors.applicant_phone}
              fullWidth
            />
            <TextField
              name="applicant_linkedin"
              label="LinkedIn (opcional)"
              value={formik.values.applicant_linkedin}
              onChange={formik.handleChange}
              error={formik.touched.applicant_linkedin && Boolean(formik.errors.applicant_linkedin)}
              helperText={formik.touched.applicant_linkedin && formik.errors.applicant_linkedin}
              fullWidth
            />
            <TextField
              name="applicant_portfolio_link"
              label="Portafolio (opcional)"
              value={formik.values.applicant_portfolio_link}
              onChange={formik.handleChange}
              error={formik.touched.applicant_portfolio_link && Boolean(formik.errors.applicant_portfolio_link)}
              helperText={formik.touched.applicant_portfolio_link && formik.errors.applicant_portfolio_link}
              fullWidth
            />
            <TextField
              name="applicant_country"
              label="País"
              value={formik.values.applicant_country}
              onChange={formik.handleChange}
              error={formik.touched.applicant_country && Boolean(formik.errors.applicant_country)}
              helperText={formik.touched.applicant_country && formik.errors.applicant_country}
              fullWidth
            />
            <TextField
              name="applicant_city"
              label="Ciudad"
              value={formik.values.applicant_city}
              onChange={formik.handleChange}
              error={formik.touched.applicant_city && Boolean(formik.errors.applicant_city)}
              helperText={formik.touched.applicant_city && formik.errors.applicant_city}
              fullWidth
            />
            <TextField
              name="applicant_address"
              label="Dirección"
              value={formik.values.applicant_address}
              onChange={formik.handleChange}
              error={formik.touched.applicant_address && Boolean(formik.errors.applicant_address)}
              helperText={formik.touched.applicant_address && formik.errors.applicant_address}
              fullWidth
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="job_title"
              label="Título del empleo"
              value={formik.values.job_title}
              onChange={formik.handleChange}
              error={formik.touched.job_title && Boolean(formik.errors.job_title)}
              helperText={formik.touched.job_title && formik.errors.job_title}
              fullWidth
            />
            <TextField
              name="company_name"
              label="Nombre de la empresa"
              value={formik.values.company_name}
              onChange={formik.handleChange}
              error={formik.touched.company_name && Boolean(formik.errors.company_name)}
              helperText={formik.touched.company_name && formik.errors.company_name}
              fullWidth
            />
            <TextField
              select
              name="employment_type_id"
              label="Tipo de empleo"
              value={formik.values.employment_type_id}
              onChange={formik.handleChange}
              error={formik.touched.employment_type_id && Boolean(formik.errors.employment_type_id)}
              helperText={formik.touched.employment_type_id && formik.errors.employment_type_id}
              fullWidth
            >
              {/* Aquí deberías mapear los tipos de empleo desde tu API */}
              <MenuItem value="1">Tiempo completo</MenuItem>
              <MenuItem value="2">Medio tiempo</MenuItem>
            </TextField>
            <TextField
              name="monthly_expected_salary"
              label="Salario mensual esperado"
              value={formik.values.monthly_expected_salary}
              onChange={formik.handleChange}
              error={formik.touched.monthly_expected_salary && Boolean(formik.errors.monthly_expected_salary)}
              helperText={formik.touched.monthly_expected_salary && formik.errors.monthly_expected_salary}
              fullWidth
            />
            <TextField
              select
              name="availability_id"
              label="Disponibilidad"
              value={formik.values.availability_id}
              onChange={formik.handleChange}
              error={formik.touched.availability_id && Boolean(formik.errors.availability_id)}
              helperText={formik.touched.availability_id && formik.errors.availability_id}
              fullWidth
            >
              {/* Mapear desde API */}
              <MenuItem value="1">Inmediata</MenuItem>
              <MenuItem value="2">30 días</MenuItem>
            </TextField>
            <TextField
              select
              name="work_modality_id"
              label="Modalidad de trabajo"
              value={formik.values.work_modality_id}
              onChange={formik.handleChange}
              error={formik.touched.work_modality_id && Boolean(formik.errors.work_modality_id)}
              helperText={formik.touched.work_modality_id && formik.errors.work_modality_id}
              fullWidth
            >
              {/* Mapear desde API */}
              <MenuItem value="1">Presencial</MenuItem>
              <MenuItem value="2">Remoto</MenuItem>
            </TextField>
            <TextField
              type="file"
              name="cv"
              label="CV (PDF)"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (file) formik.setFieldValue('cv', file);
              }}
              error={formik.touched.cv && Boolean(formik.errors.cv)}
              helperText={formik.touched.cv && formik.errors.cv}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'application/pdf' }}
              fullWidth
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {formik.values.educations.map((edu, index) => (
              <Box key={index} sx={{ border: 1, p: 2, borderRadius: 1 }}>
                <TextField
                  name={`educations[${index}].education_degree`}
                  label="Título"
                  value={edu.education_degree}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.educations?.[index]?.education_degree &&
                    Boolean(formik.errors.educations?.[index]?.education_degree)
                  }
                  helperText={
                    formik.touched.educations?.[index]?.education_degree &&
                    formik.errors.educations?.[index]?.education_degree
                  }
                  fullWidth
                />
                <TextField
                  name={`educations[${index}].education_institution`}
                  label="Institución"
                  value={edu.education_institution}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.educations?.[index]?.education_institution &&
                    Boolean(formik.errors.educations?.[index]?.education_institution)
                  }
                  helperText={
                    formik.touched.educations?.[index]?.education_institution &&
                    formik.errors.educations?.[index]?.education_institution
                  }
                  fullWidth
                />
                <TextField
                  type="date"
                  name={`educations[${index}].start_date`}
                  label="Fecha de inicio"
                  value={edu.start_date}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.educations?.[index]?.start_date &&
                    Boolean(formik.errors.educations?.[index]?.start_date)
                  }
                  helperText={
                    formik.touched.educations?.[index]?.start_date &&
                    formik.errors.educations?.[index]?.start_date
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="date"
                  name={`educations[${index}].end_date`}
                  label="Fecha de fin"
                  value={edu.end_date}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.educations?.[index]?.end_date &&
                    Boolean(formik.errors.educations?.[index]?.end_date)
                  }
                  helperText={
                    formik.touched.educations?.[index]?.end_date &&
                    formik.errors.educations?.[index]?.end_date
                  }
                  InputLabelProps={{ shrink: true }}
                  disabled={edu.is_ongoing}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name={`educations[${index}].is_ongoing`}
                      checked={edu.is_ongoing}
                      onChange={(e) => {
                        formik.handleChange(e);
                        if (e.target.checked) {
                          formik.setFieldValue(`educations[${index}].end_date`, '');
                        }
                      }}
                    />
                  }
                  label="En curso"
                />
              </Box>
            ))}
            <Button
              onClick={() =>
                formik.setFieldValue('educations', [
                  ...formik.values.educations,
                  { education_degree: '', education_institution: '', start_date: '', is_ongoing: false },
                ])
              }
            >
              Agregar Educación
            </Button>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {formik.values.experiences.map((exp, index) => (
              <Box key={index} sx={{ border: 1, p: 2, borderRadius: 1 }}>
                <TextField
                  name={`experiences[${index}].company_name`}
                  label="Empresa"
                  value={exp.company_name}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.experiences?.[index]?.company_name &&
                    Boolean(formik.errors.experiences?.[index]?.company_name)
                  }
                  helperText={
                    formik.touched.experiences?.[index]?.company_name &&
                    formik.errors.experiences?.[index]?.company_name
                  }
                  fullWidth
                />
                <TextField
                  name={`experiences[${index}].job_title`}
                  label="Título del puesto"
                  value={exp.job_title}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.experiences?.[index]?.job_title &&
                    Boolean(formik.errors.experiences?.[index]?.job_title)
                  }
                  helperText={
                    formik.touched.experiences?.[index]?.job_title &&
                    formik.errors.experiences?.[index]?.job_title
                  }
                  fullWidth
                />
                <TextField
                  type="date"
                  name={`experiences[${index}].start_date`}
                  label="Fecha de inicio"
                  value={exp.start_date}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.experiences?.[index]?.start_date &&
                    Boolean(formik.errors.experiences?.[index]?.start_date)
                  }
                  helperText={
                    formik.touched.experiences?.[index]?.start_date &&
                    formik.errors.experiences?.[index]?.start_date
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="date"
                  name={`experiences[${index}].end_date`}
                  label="Fecha de fin"
                  value={exp.end_date}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.experiences?.[index]?.end_date &&
                    Boolean(formik.errors.experiences?.[index]?.end_date)
                  }
                  helperText={
                    formik.touched.experiences?.[index]?.end_date &&
                    formik.errors.experiences?.[index]?.end_date
                  }
                  InputLabelProps={{ shrink: true }}
                  disabled={exp.is_current_job}
                  fullWidth
                />
                <TextField
                  name={`experiences[${index}].description`}
                  label="Descripción"
                  value={exp.description}
                  onChange={formik.handleChange}
                  multiline
                  rows={3}
                  fullWidth
                />
                <TextField
                  name={`experiences[${index}].location`}
                  label="Ubicación"
                  value={exp.location}
                  onChange={formik.handleChange}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name={`experiences[${index}].is_current_job`}
                      checked={exp.is_current_job}
                      onChange={(e) => {
                        formik.handleChange(e);
                        if (e.target.checked) {
                          formik.setFieldValue(`experiences[${index}].end_date`, '');
                        }
                      }}
                    />
                  }
                  label="Trabajo actual"
                />
              </Box>
            ))}
            <Button
              onClick={() =>
                formik.setFieldValue('experiences', [
                  ...formik.values.experiences,
                  {
                    company_name: '',
                    job_title: '',
                    start_date: '',
                    is_current_job: false,
                  },
                ])
              }
            >
              Agregar Experiencia
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack}>
            Atrás
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {activeStep === steps.length - 1 ? 'Enviar' : 'Siguiente'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default JobApplicationForm;