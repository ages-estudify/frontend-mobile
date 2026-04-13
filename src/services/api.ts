import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { type AxiosInstance } from "axios";
import { RelativePathString, router } from "expo-router";

export const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"}/api/v1`;

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use((response) => response.data);

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!config.url?.includes("/login") && !config.url?.includes("/register") && !token) {
    router.replace("/login" as RelativePathString);
  }
  return config;
});

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.log(error.response?.data ?? error.message);
  }

  console.log(error);
};

export default api;
