import axios, { type AxiosInstance } from "axios";

export const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"}/api/v1`;

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use((response) => response.data);

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.log(error.response?.data ?? error.message);
  }

  console.log(error);
};

export default api;
