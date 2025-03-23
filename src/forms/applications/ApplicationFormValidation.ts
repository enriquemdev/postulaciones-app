import * as Yup from "yup";

interface ValidationData {
  employmentTypeIds: number[];
  workModalityIds: number[];
  availabilityIds: number[];
}
export const createApplicationFormValidation = (data: ValidationData) => {
  const { employmentTypeIds, workModalityIds, availabilityIds } = data;

  return [
    // Step 1: Personal info
    Yup.object({
      applicant_names: Yup.string()
        .max(255, "Máximo 255 caracteres")
        .required("Requerido"),
      applicant_last_names: Yup.string()
        .max(255, "Máximo 255 caracteres")
        .required("Requerido"),
      applicant_email: Yup.string()
        .email("Email inválido")
        .max(255, "Máximo 255 caracteres")
        .required("Requerido"),
      applicant_phone: Yup.string()
        .max(20, "Máximo 20 caracteres")
        .required("Requerido"),
      applicant_linkedin: Yup.string()
        .url("URL inválida")
        .max(255, "Máximo 255 caracteres")
        .nullable(),
      applicant_portfolio_link: Yup.string()
        .url("URL inválida")
        .max(255, "Máximo 255 caracteres")
        .nullable(),
      applicant_country: Yup.string()
        .max(255, "Máximo 255 caracteres")
        .required("Requerido"),
      applicant_city: Yup.string()
        .max(255, "Máximo 255 caracteres")
        .required("Requerido"),
      applicant_address: Yup.string()
        .max(255, "Máximo 255 caracteres")
        .required("Requerido"),
    }),
    // Step 2: Job info
    Yup.object({
      job_title: Yup.string()
        .max(255, "Máximo 255 caracteres")
        .required("Requerido"),
      company_name: Yup.string()
        .max(255, "Máximo 255 caracteres")
        .required("Requerido"),
      employment_type_id: Yup.number()
        .oneOf(employmentTypeIds, "Seleccione una opción válida")
        .required("Requerido"),
      monthly_expected_salary: Yup.string()
        .matches(/^\d+(\.\d{1,2})?$/, "Debe ser un número con hasta 2 decimales (ej. 123.45)")
        .required("Requerido")
        .test("min-value", "El valor debe ser mayor o igual a 0", (value) => {
          if (!value) return true;
          return parseFloat(value) >= 0;
        })
        .test("max-value", "El valor no puede exceder 9999999999.99", (value) => {
          if (!value) return true;
          return parseFloat(value) <= 9999999999.99;
        }),
      availability_id: Yup.number()
        .oneOf(availabilityIds, "Seleccione una opción válida")
        .required("Requerido"),
      work_modality_id: Yup.number()
        .oneOf(workModalityIds, "Seleccione una opción válida")
        .required("Requerido"),
      cv: Yup.mixed()
        .required("Requerido")
        .test("fileType", "Solo se aceptan archivos PDF", (value) =>
          value ? value.type === "application/pdf" : true
        )
        .test("fileSize", "El archivo no puede exceder 50MB", (value) =>
          value ? value.size <= 51200 * 1024 : true
        ),
    }),
    // Step 3: Education
    Yup.object({
      educations: Yup.array()
        .of(
          Yup.object({
            education_degree: Yup.string()
              .max(255, "Máximo 255 caracteres")
              .required("Requerido"),
            education_institution: Yup.string()
              .max(255, "Máximo 255 caracteres")
              .required("Requerido"),
            start_date: Yup.date().required("Requerido"),
            end_date: Yup.date()
              .when("is_ongoing", {
                is: (val: number) => val === 0,
                then: (schema) =>
                  schema.test(
                    "after_or_equal_start",
                    "Debe ser igual o posterior a la fecha de inicio",
                    function (value) {
                      const { start_date } = this.parent;
                      return !value || (start_date && value >= start_date);
                    }
                  ),
                otherwise: (schema) => schema.nullable(),
              })
              .nullable(),
            is_ongoing: Yup.boolean().required("Requerido"),
          })
        )
        .min(1, "Debe agregar al menos una educación")
        .required("Requerido"),
    }),
    // Step 4: Experience
    Yup.object({
      experiences: Yup.array()
        .of(
          Yup.object({
            company_name: Yup.string()
              .max(255, "Máximo 255 caracteres")
              .required("Requerido"),
            job_title: Yup.string()
              .max(255, "Máximo 255 caracteres")
              .required("Requerido"),
            start_date: Yup.date().required("Requerido"),
            end_date: Yup.date()
              .when("is_current_job", {
                is: (val: number) => val === 0,
                then: (schema) =>
                  schema.test(
                    "after_or_equal_start",
                    "Debe ser igual o posterior a la fecha de inicio",
                    function (value) {
                      const { start_date } = this.parent;
                      return !value || (start_date && value >= start_date);
                    }
                  ),
                otherwise: (schema) => schema.nullable(),
              })
              .nullable(),
            description: Yup.string().nullable(),
            location: Yup.string().max(255, "Máximo 255 caracteres").nullable(),
            is_current_job: Yup.boolean().required("Requerido"),
          })
        )
        .min(1, "Debe agregar al menos una experiencia")
        .required("Requerido"),
    }),
  ];
};