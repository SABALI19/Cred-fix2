const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  healthUrl: `${API_BASE_URL}/health`,
  consultationsUrl: `${API_BASE_URL}/consultations`,
};
