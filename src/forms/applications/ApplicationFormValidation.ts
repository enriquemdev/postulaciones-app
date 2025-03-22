import * as Yup from 'yup';

// Yup's validation schema
export const ApplicationFormValidation = [
    // Step 1: Personal info
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
    // Step 2: Job info
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
    // Step 3: Education
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
    // Step 4: Experience
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