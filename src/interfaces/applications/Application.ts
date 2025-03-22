export interface Application {
  id: number;
  job_title: string;
  company_name: string;
  employment_type_id: number;
  applicant_names: string;
  applicant_last_names: string;
  applicant_email: string;
  applicant_phone: string;
  applicant_linkedin: string;
  applicant_portfolio_link: string;
  applicant_country: string;
  applicant_city: string;
  applicant_address: string;
  cv_path: string;
  cv_pages_count: number;
  monthly_expected_salary: number;
  availability_id: number;
  application_status_id: number;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
  work_modality_id: number;
  cv_download_url: string;
  employment_type: {
    id: number;
    employment_type_name: string;
    employment_type_code: string;
    created_at: string;
    updated_at: string;
  };
  availability: {
    id: number;
    availability_name: string;
    availability_code: string;
    created_at: string;
    updated_at: string;
  };
  application_status: {
    id: number;
    application_status_name: string;
    application_status_code: string;
    created_at: string;
    updated_at: string;
  };
  work_modality: {
    id: number;
    work_modality_name: string;
    work_modality_code: string;
    created_at: string;
    updated_at: string;
  };
  educations: Education[];
  experiences: Experience[];
}

export interface PaginatedApplications {
  current_page: number;
  data: Application[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Education {
  // id: number;
  // application_id: number;
  education_degree: string;
  education_institution: string;
  start_date: string;
  end_date?: string;
  is_ongoing: boolean;
  // created_at: string;
  // updated_at: string;
}

export interface Experience {
  // id: number;
  // application_id: number;
  company_name: string;
  job_title: string;
  start_date: string;
  end_date?: string;
  description?: string;
  location?: string;
  is_current_job: boolean;
  // created_at: string;
  // updated_at: string;
}

export interface ApplicationFormInputs {
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
