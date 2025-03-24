import axios from "axios";
import { PaginatedApplications, ApplicationFormInputs } from "@/interfaces/applications";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { GridFilterModel, GridSortModel } from "@mui/x-data-grid";

interface FetchApplicationsParams {
  page: number;
  pageSize: number;
  filterModel?: GridFilterModel;
  sortModel?: GridSortModel;
}

export const getApplicationsPaginated = async ({
  page,
  pageSize,
  filterModel,
  sortModel,
}: FetchApplicationsParams): Promise<PaginatedApplications> => {
  const url = new URL(`${API_URL}/applications`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("page_size", pageSize.toString());

  // Define the columns to search in for the quick filter
  const searchableColumns = [
    "applicant_names",
    "applicant_last_names",
    "job_title",
    "company_name",
    "applicant_email",
    "applicant_phone",
    "employment_type.employment_type_name",
    "application_status.application_status_name",
  ];

  // Log the filterModel to debug
  console.log("Filter Model in getApplicationsPaginated:", filterModel);

  // Handle quick filter
  if (filterModel?.quickFilterValues && filterModel.quickFilterValues.length > 0) {
    const quickFilterValue = filterModel.quickFilterValues.join(" ").trim(); // Join multiple values with a space and trim
    console.log("Quick Filter Value:", quickFilterValue); // Debug log
    if (quickFilterValue) {
      searchableColumns.forEach((field, index) => {
        url.searchParams.append(`filters[${index}][field]`, field);
        url.searchParams.append(`filters[${index}][operator]`, "contains");
        url.searchParams.append(`filters[${index}][value]`, quickFilterValue);
      });
    }
  }

  // Handle regular filters (from column filters)
  if (filterModel?.items?.length) {
    filterModel.items.forEach((filter, index) => {
      // Offset the index to account for quick filter entries
      const filterIndex = index + (filterModel.quickFilterValues?.length ? searchableColumns.length : 0);
      url.searchParams.append(`filters[${filterIndex}][field]`, filter.field);
      url.searchParams.append(`filters[${filterIndex}][operator]`, filter.operator);
      url.searchParams.append(`filters[${filterIndex}][value]`, filter.value?.toString() || "");
    });
  }

  // Add sort parameters
  if (sortModel?.length) {
    sortModel.forEach((sort, index) => {
      url.searchParams.append(`sort[${index}][field]`, sort.field);
      url.searchParams.append(`sort[${index}][direction]`, sort.sort || "asc");
    });
  }

  // Log the final URL to debug
  console.log("Final URL:", url.toString());

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }
  return response.json();
};

// export const getApplicationsPaginated = async (
//   page: number,
//   pageSize: number
// ): Promise<PaginatedApplications> => {
//   try {
//     const response = await axios.get(
//       `${API_URL}/applications?page=${page}&per_page=${pageSize}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching paginated applications:", error);
//     throw error;
//   }
// };


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


export const markApplicationAsSeen = async (applicationId: number) => {
  try {
    const response = await axios.patch(`${API_URL}/applications/${applicationId}/mark-as-seen`, null, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al marcar la solicitud como vista:", error);
    throw error;
  }
};