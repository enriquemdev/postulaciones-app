import { CatalogItem } from "@/interfaces/applications";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Generic function to fetch data with caching
async function fetchCatalog<T>(endpoint: string): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }

  return response.json();
}


export async function getEmploymentTypes(): Promise<CatalogItem[]> {
  return fetchCatalog<CatalogItem[]>("/employment_types");
}

export async function getApplicationStatuses(): Promise<CatalogItem[]> {
  return fetchCatalog<CatalogItem[]>("/application_statuses");
}

export async function getWorkModalities(): Promise<CatalogItem[]> {
  return fetchCatalog<CatalogItem[]>("/work_modalities");
}

export async function getAvailabilities(): Promise<CatalogItem[]> {
  return fetchCatalog<CatalogItem[]>("/availabilities");
}
