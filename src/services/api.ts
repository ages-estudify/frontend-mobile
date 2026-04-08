import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { type AxiosInstance, isAxiosError } from "axios";
import { RelativePathString, router } from "expo-router";

export const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"}/api/v1`;

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use((response) => {
  if (response.status === 401) {
    AsyncStorage.removeItem("token");
    router.replace("/login" as RelativePathString);
    return Promise.reject();
  }
  return response.data;
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (
    !token &&
    !config.url?.includes("/login") &&
    !config.url?.includes("/register") &&
    !config.url?.includes("/intro")
  ) {
    const hasSeen = await AsyncStorage.getItem("hasSeenIntroSlider");
    const isFirstLaunch = hasSeen !== "true";

    if (isFirstLaunch) {
      router.replace("/intro" as RelativePathString);
    } else {
      router.replace("/login" as RelativePathString);
    }
    return Promise.reject();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!config.url?.includes("/login") && !config.url?.includes("/register") && !token) {
    router.replace("/login" as RelativePathString);
  }
  return config;
});

export const handleApiError = (error: unknown): never => {
  if (isAxiosError(error)) {
    throw error.response?.data ?? error.message;
  }

  console.log(error);
};

export default api;
