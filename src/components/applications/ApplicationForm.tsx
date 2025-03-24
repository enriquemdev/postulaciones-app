"use client";

import React, { useState, useCallback, useMemo } from "react";
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
  Autocomplete,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import {
  Education,
  Experience,
  ApplicationFormInputs,
  CatalogItem,
} from "@/interfaces/applications";
import {
  createApplicationFormValidation,
  ApplicationFormInitialValues,
} from "@/forms/applications";
import useSWR from "swr";
import { fetchCatalog } from "@/services";
import { countries } from "@/services";

const steps = [
  "Información Personal",
  "Información del Empleo",
  "Educación",
  "Experiencia Laboral",
];

interface returnFormat {
  data: CatalogItem[] | undefined;
  error: any;
}

interface InitialData {
  employmentTypes: returnFormat;
  applicationStatuses: returnFormat;
  workModalities: returnFormat;
  availabilities: returnFormat;
}

const adjustedInitialValues: ApplicationFormInputs = {
  ...ApplicationFormInitialValues,
  educations: [
    {
      education_degree: "",
      education_institution: "",
      start_date: "",
      end_date: "",
      is_ongoing: false,
    },
  ],
  experiences: [
    {
      company_name: "",
      job_title: "",
      start_date: "",
      end_date: "",
      description: "",
      location: "",
      is_current_job: false,
    },
  ],
};

export const ApplicationForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refresh24Hours = 60 * 60 * 24 * 1000;

  const { data: employmentTypes, error: employmentTypesError } = useSWR<
    CatalogItem[]
  >("/employment_types", fetchCatalog, {
    refreshInterval: refresh24Hours,
    dedupingInterval: 5000,
  });
  const { data: applicationStatuses, error: applicationStatusesError } = useSWR<
    CatalogItem[]
  >("/application_statuses", fetchCatalog, {
    refreshInterval: refresh24Hours,
    dedupingInterval: 5000,
  });
  const { data: workModalities, error: workModalitiesError } = useSWR<
    CatalogItem[]
  >("/work_modalities", fetchCatalog, {
    refreshInterval: refresh24Hours,
    dedupingInterval: 5000,
  });
  const { data: availabilities, error: availabilitiesError } = useSWR<
    CatalogItem[]
  >("/availabilities", fetchCatalog, {
    refreshInterval: refresh24Hours,
    dedupingInterval: 5000,
  });

  const initialData: InitialData = useMemo(
    () => ({
      employmentTypes: {
        data: employmentTypes,
        error: employmentTypesError,
      },
      applicationStatuses: {
        data: applicationStatuses,
        error: applicationStatusesError,
      },
      workModalities: {
        data: workModalities,
        error: workModalitiesError,
      },
      availabilities: {
        data: availabilities,
        error: availabilitiesError,
      },
    }),
    [
      employmentTypes,
      applicationStatuses,
      workModalities,
      availabilities,
      employmentTypesError,
      applicationStatusesError,
      workModalitiesError,
      availabilitiesError,
    ]
  );

  // ID's extraction
  const validationData = useMemo(() => {
    const employmentTypeIds = employmentTypes?.map((item) => item.id) || [];
    const workModalityIds = workModalities?.map((item) => item.id) || [];
    const availabilityIds = availabilities?.map((item) => item.id) || [];

    return {
      employmentTypeIds,
      workModalityIds,
      availabilityIds,
    };
  }, [employmentTypes, workModalities, availabilities]);

  // Create dynamic validation schemas with use memo to update when update received
  const validationSchemas = useMemo(
    () => createApplicationFormValidation(validationData),
    [validationData]
  );

  const formik = useFormik<ApplicationFormInputs>({
    initialValues: adjustedInitialValues,
    validationSchema: validationSchemas[activeStep],
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (activeStep === steps.length - 1) {
        setIsSubmitting(true);
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          if (key === "cv" && value) {
            formData.append(key, value);
          } else if (key !== "educations" && key !== "experiences") {
            formData.append(key, String(value));
          }
        });

        values.educations.forEach((edu, index) => {
          formData.append(
            `educations[${index}][education_degree]`,
            edu.education_degree || ""
          );
          formData.append(
            `educations[${index}][education_institution]`,
            edu.education_institution || ""
          );
          formData.append(
            `educations[${index}][start_date]`,
            edu.start_date || ""
          );
          formData.append(`educations[${index}][end_date]`, edu.end_date || "");
          formData.append(
            `educations[${index}][is_ongoing]`,
            String(edu.is_ongoing ? 1 : 0)
          );
        });

        values.experiences.forEach((exp, index) => {
          formData.append(
            `experiences[${index}][company_name]`,
            exp.company_name || ""
          );
          formData.append(
            `experiences[${index}][job_title]`,
            exp.job_title || ""
          );
          formData.append(
            `experiences[${index}][start_date]`,
            exp.start_date || ""
          );
          formData.append(
            `experiences[${index}][end_date]`,
            exp.end_date || ""
          );
          formData.append(
            `experiences[${index}][description]`,
            exp.description || ""
          );
          formData.append(
            `experiences[${index}][location]`,
            exp.location || ""
          );
          formData.append(
            `experiences[${index}][is_current_job]`,
            String(exp.is_current_job ? 1 : 0)
          );
        });

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
          await axios.post(`${API_URL}/applications`, formData, {
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
          return <JobInfoStep2 formik={formik} initialData={initialData} />;
        case 2:
          return <EducationInfoStep3 formik={formik} />;
        case 3:
          return <ExperienceInfoStep4 formik={formik} />;
        default:
          return null;
      }
    },
    [formik, initialData]
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
  // Find the corresponding countryType object to the selected value of the input
  const selectedCountry =
    countries.find(
      (country) => country.label === formik.values.applicant_country
    ) || null;
    
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        name="applicant_names"
        label="Nombres"
        value={formik.values.applicant_names || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.applicant_names &&
          Boolean(formik.errors.applicant_names)
        }
        helperText={
          formik.touched.applicant_names && formik.errors.applicant_names
        }
        fullWidth
      />
      <TextField
        name="applicant_last_names"
        label="Apellidos"
        value={formik.values.applicant_last_names || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.applicant_last_names &&
          Boolean(formik.errors.applicant_last_names)
        }
        helperText={
          formik.touched.applicant_last_names &&
          formik.errors.applicant_last_names
        }
        fullWidth
      />
      <TextField
        name="applicant_email"
        label="Email"
        type="email"
        value={formik.values.applicant_email || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.applicant_email &&
          Boolean(formik.errors.applicant_email)
        }
        helperText={
          formik.touched.applicant_email && formik.errors.applicant_email
        }
        fullWidth
      />
      <TextField
        name="applicant_phone"
        label="Teléfono"
        value={formik.values.applicant_phone || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.applicant_phone &&
          Boolean(formik.errors.applicant_phone)
        }
        helperText={
          formik.touched.applicant_phone && formik.errors.applicant_phone
        }
        fullWidth
      />
      <TextField
        name="applicant_linkedin"
        label="LinkedIn (opcional)"
        value={formik.values.applicant_linkedin || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.applicant_linkedin &&
          Boolean(formik.errors.applicant_linkedin)
        }
        helperText={
          formik.touched.applicant_linkedin && formik.errors.applicant_linkedin
        }
        fullWidth
      />
      <TextField
        name="applicant_portfolio_link"
        label="Portafolio (opcional)"
        value={formik.values.applicant_portfolio_link || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.applicant_portfolio_link &&
          Boolean(formik.errors.applicant_portfolio_link)
        }
        helperText={
          formik.touched.applicant_portfolio_link &&
          formik.errors.applicant_portfolio_link
        }
        fullWidth
      />

      {/* <TextField
        name="applicant_country"
        label="País"
        value={formik.values.applicant_country || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.applicant_country &&
          Boolean(formik.errors.applicant_country)
        }
        helperText={
          formik.touched.applicant_country && formik.errors.applicant_country
        }
        fullWidth
      /> */}

      <Autocomplete
        id="applicant_country"
        options={countries}
        autoHighlight
        getOptionLabel={(option) => option.label}
        value={selectedCountry}
        onChange={(event, newValue) => {
          // Actualizar el valor de Formik con el label del país seleccionado (o "" si no hay selección)
          formik.setFieldValue(
            "applicant_country",
            newValue ? newValue.label : ""
          );
        }}
        onBlur={() => formik.setFieldTouched("applicant_country", true)}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Box
              key={key}
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...optionProps}
            >
              <img
                loading="lazy"
                width="20"
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt=""
              />
              {option.label} ({option.code}) +{option.phone}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="País"
            name="applicant_country"
            error={
              formik.touched.applicant_country &&
              Boolean(formik.errors.applicant_country)
            }
            helperText={
              formik.touched.applicant_country &&
              formik.errors.applicant_country
            }
            fullWidth
            slotProps={{
              htmlInput: {
                ...params.inputProps,
                autoComplete: "new-password", // browser's autocomplete disabled
              },
            }}
          />
        )}
      />

      <TextField
        name="applicant_city"
        label="Ciudad"
        value={formik.values.applicant_city || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.applicant_city && Boolean(formik.errors.applicant_city)
        }
        helperText={
          formik.touched.applicant_city && formik.errors.applicant_city
        }
        fullWidth
      />
      <TextField
        name="applicant_address"
        label="Dirección"
        value={formik.values.applicant_address || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.applicant_address &&
          Boolean(formik.errors.applicant_address)
        }
        helperText={
          formik.touched.applicant_address && formik.errors.applicant_address
        }
        fullWidth
      />
    </Box>
  );
});
PersonalInfoStep1.displayName = "PersonalInfoStep1";

const JobInfoStep2 = React.memo(
  ({ formik, initialData }: { formik: any; initialData: InitialData }) => {
    if (
      initialData.employmentTypes.error ||
      initialData.availabilities.error ||
      initialData.workModalities.error
    ) {
      return <div>Error loading data</div>;
    }
    if (
      !initialData.employmentTypes.data ||
      !initialData.availabilities.data ||
      !initialData.workModalities.data
    ) {
      return <div>Loading...</div>;
    }

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
          error={
            formik.touched.company_name && Boolean(formik.errors.company_name)
          }
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
          error={
            formik.touched.employment_type_id &&
            Boolean(formik.errors.employment_type_id)
          }
          helperText={
            formik.touched.employment_type_id &&
            formik.errors.employment_type_id
          }
          fullWidth
        >
          {initialData.employmentTypes.data.map((type) => {
            return (
              <MenuItem value={type.id} key={type.id}>
                {type.name}
              </MenuItem>
            );
          })}
        </TextField>
        <TextField
          name="monthly_expected_salary"
          label="Salario mensual esperado"
          value={formik.values.monthly_expected_salary || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.monthly_expected_salary &&
            Boolean(formik.errors.monthly_expected_salary)
          }
          helperText={
            formik.touched.monthly_expected_salary &&
            formik.errors.monthly_expected_salary
          }
          fullWidth
        />
        <TextField
          select
          name="availability_id"
          label="Disponibilidad"
          value={formik.values.availability_id ?? 1}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.availability_id &&
            Boolean(formik.errors.availability_id)
          }
          helperText={
            formik.touched.availability_id && formik.errors.availability_id
          }
          fullWidth
        >
          {initialData.availabilities.data.map((type) => {
            return (
              <MenuItem value={type.id} key={type.id}>
                {type.name}
              </MenuItem>
            );
          })}
        </TextField>
        <TextField
          select
          name="work_modality_id"
          label="Modalidad de trabajo"
          value={formik.values.work_modality_id ?? 1}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.work_modality_id &&
            Boolean(formik.errors.work_modality_id)
          }
          helperText={
            formik.touched.work_modality_id && formik.errors.work_modality_id
          }
          fullWidth
        >
          {initialData.workModalities.data.map((type) => {
            return (
              <MenuItem value={type.id} key={type.id}>
                {type.name}
              </MenuItem>
            );
          })}
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
  }
);
JobInfoStep2.displayName = "JobInfoStep2";

const EducationInfoStep3 = React.memo(({ formik }: { formik: any }) => {
  const handleRemoveEducation = (index: number) => {
    const newEducations = formik.values.educations.filter(
      (_: any, i: any) => i !== index
    );
    formik.setFieldValue("educations", newEducations);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {formik.values.educations.map((edu: Education, index: number) => (
        <Box key={index} sx={{ border: 1, p: 2, borderRadius: 1 }}>
          <TextField
            name={`educations[${index}].education_degree`}
            label="Título"
            value={edu.education_degree || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.educations?.[index]?.education_degree &&
              Boolean(formik.errors.educations?.[index]?.education_degree)
            }
            helperText={
              formik.touched.educations?.[index]?.education_degree &&
              formik.errors.educations?.[index]?.education_degree
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            name={`educations[${index}].education_institution`}
            label="Institución"
            value={edu.education_institution || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.educations?.[index]?.education_institution &&
              Boolean(formik.errors.educations?.[index]?.education_institution)
            }
            helperText={
              formik.touched.educations?.[index]?.education_institution &&
              formik.errors.educations?.[index]?.education_institution
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            type="date"
            name={`educations[${index}].start_date`}
            label="Fecha de inicio"
            value={edu.start_date || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            sx={{ mb: 2 }}
          />
          <TextField
            type="date"
            name={`educations[${index}].end_date`}
            label="Fecha de fin"
            value={edu.end_date || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            sx={{ mb: 2 }}
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
          {index > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveEducation(index)}
              sx={{ mt: 2 }}
            >
              Eliminar Educación
            </Button>
          )}
        </Box>
      ))}
      <Button
        onClick={() =>
          formik.setFieldValue("educations", [
            ...formik.values.educations,
            {
              education_degree: "",
              education_institution: "",
              start_date: "",
              end_date: "",
              is_ongoing: false,
            },
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
  const handleRemoveExperience = (index: number) => {
    const newExperiences = formik.values.experiences.filter(
      (_: any, i: any) => i !== index
    );
    formik.setFieldValue("experiences", newExperiences);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {formik.values.experiences.map((exp: Experience, index: number) => (
        <Box key={index} sx={{ border: 1, p: 2, borderRadius: 1 }}>
          <TextField
            name={`experiences[${index}].company_name`}
            label="Empresa"
            value={exp.company_name || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.experiences?.[index]?.company_name &&
              Boolean(formik.errors.experiences?.[index]?.company_name)
            }
            helperText={
              formik.touched.experiences?.[index]?.company_name &&
              formik.errors.experiences?.[index]?.company_name
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            name={`experiences[${index}].job_title`}
            label="Título del puesto"
            value={exp.job_title || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.experiences?.[index]?.job_title &&
              Boolean(formik.errors.experiences?.[index]?.job_title)
            }
            helperText={
              formik.touched.experiences?.[index]?.job_title &&
              formik.errors.experiences?.[index]?.job_title
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            type="date"
            name={`experiences[${index}].start_date`}
            label="Fecha de inicio"
            value={exp.start_date || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            sx={{ mb: 2 }}
          />
          <TextField
            type="date"
            name={`experiences[${index}].end_date`}
            label="Fecha de fin"
            value={exp.end_date || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
          />
          <TextField
            name={`experiences[${index}].location`}
            label="Ubicación"
            value={exp.location || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            sx={{ mb: 2 }}
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
          {index > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveExperience(index)}
              sx={{ mt: 2 }}
            >
              Eliminar Experiencia
            </Button>
          )}
        </Box>
      ))}
      <Button
        onClick={() =>
          formik.setFieldValue("experiences", [
            ...formik.values.experiences,
            {
              company_name: "",
              job_title: "",
              start_date: "",
              end_date: "",
              description: "",
              location: "",
              is_current_job: false,
            },
          ])
        }
      >
        Agregar Experiencia
      </Button>
    </Box>
  );
});
ExperienceInfoStep4.displayName = "ExperienceInfoStep4";
