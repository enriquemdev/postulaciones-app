import axios from "axios";
import { PaginatedApplications, ApplicationFormInputs } from "@/interfaces/applications";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getApplicationsPaginated = async (
  page: number,
  pageSize: number
): Promise<PaginatedApplications> => {
  try {
    const response = await axios.get(
      `${API_URL}/applications?page=${page}&per_page=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated applications:", error);
    throw error;
  }
};


export const submitApplication = async (values: ApplicationFormInputs): Promise<void> => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (key === "cv" && value) {
      formData.append(key, value);
    } else if (key !== "educations" && key !== "experiences") {
      formData.append(key, String(value));
    }
  });

  values.educations.forEach((edu, index) => {
    formData.append(`educations[${index}][education_degree]`, edu.education_degree || "");
    formData.append(`educations[${index}][education_institution]`, edu.education_institution || "");
    formData.append(`educations[${index}][start_date]`, edu.start_date || "");
    formData.append(`educations[${index}][end_date]`, edu.end_date || "");
    formData.append(`educations[${index}][is_ongoing]`, String(edu.is_ongoing ? 1 : 0));
  });

  values.experiences.forEach((exp, index) => {
    formData.append(`experiences[${index}][company_name]`, exp.company_name || "");
    formData.append(`experiences[${index}][job_title]`, exp.job_title || "");
    formData.append(`experiences[${index}][start_date]`, exp.start_date || "");
    formData.append(`experiences[${index}][end_date]`, exp.end_date || "");
    formData.append(`experiences[${index}][description]`, exp.description || "");
    formData.append(`experiences[${index}][location]`, exp.location || "");
    formData.append(`experiences[${index}][is_current_job]`, String(exp.is_current_job ? 1 : 0));
  });

  try {
    await axios.post(`${API_URL}/applications`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    throw error;
  }
};