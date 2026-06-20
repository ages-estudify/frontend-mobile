import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { type AxiosInstance, isAxiosError } from "axios";
import { RelativePathString, router } from "expo-router";

export const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL ?? "https://d2uhtao6bcv5es.cloudfront.net"}/api/v1`;

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
    const responseData = error.response?.data;
    const responseStatus = error.response?.status;

    if (responseData !== undefined) {
      if (
        responseStatus !== undefined &&
        typeof responseData === "object" &&
        responseData !== null &&
        !("status" in responseData) &&
        !("statusCode" in responseData)
      ) {
        throw {
          ...responseData,
          status: responseStatus,
        };
      }

      if (
        responseStatus !== undefined &&
        (responseData === null || typeof responseData !== "object")
      ) {
        throw {
          message: String(responseData),
          status: responseStatus,
        };
      }

      throw responseData;
    }

    if (responseStatus !== undefined) {
      throw {
        message: error.message,
        status: responseStatus,
      };
    }

    throw error.message;
  }

  throw error;
};

export default api;
