import { CatalogItem } from "@/interfaces/applications";

export const ApplicationFormInitialValues = {
  job_title: "",
  company_name: "",
  employment_type_id: "1",
  applicant_names: "",
  applicant_last_names: "",
  applicant_email: "",
  applicant_phone: "",
  applicant_linkedin: "",
  applicant_portfolio_link: "",
  applicant_country: "",
  applicant_city: "",
  applicant_address: "",
  cv: null,
  monthly_expected_salary: "",
  availability_id: "1",
  work_modality_id: "1",
  educations: [],
  experiences: [],
};

interface returnFormat {
  data: CatalogItem[] | undefined;
  error: any;
}

export interface InitialData {
  employmentTypes: returnFormat;
  applicationStatuses: returnFormat;
  workModalities: returnFormat;
  availabilities: returnFormat;
}
