import { CatalogItem } from "@/interfaces/applications";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetcher for swr
export const fetchCatalog = async (endpoint: string): Promise<CatalogItem[]> => {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return response.json();
};