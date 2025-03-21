import axios from "axios";
import { PaginatedApplications } from "@/interfaces/applications";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getApplicationsPaginated = async (
  page: number,
  pageSize: number
): Promise<PaginatedApplications> => {
  try {
    console.log('AAAAA', API_URL);
    const response = await axios.get(
      `${API_URL}/applications?page=${page}&per_page=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated applications:", error);
    throw error;
  }
};