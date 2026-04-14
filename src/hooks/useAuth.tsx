import { authService } from "@/services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

type LoginParams = {
  email: string;
  password: string;
};

type RegisterParams = {
  fullName: string;
  email: string;
  birthDate: string;
  phone: string;
  password: string;
};

export function useAuth() {
  const login = async ({ email, password }: LoginParams) => {
    const response = await authService.login({ email, password });

    const { token, refreshToken, planExpirationDate } = response.data;

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("planExpirationDate", planExpirationDate || "");

    return response;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("planExpirationDate");
    router.replace("/login");
  };

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  const getRefreshToken = async () => {
    return await AsyncStorage.getItem("refreshToken");
  };

  const isAuthenticated = async () => {
    const token = await AsyncStorage.getItem("token");
    return !!token;
  };

  const register = async (body: RegisterParams) => {
    const response = await authService.register(body);

    // se o backend DEVOLVE token no register
    const { token, refreshToken, planExpirationDate } = response.data;

    if (token && refreshToken) {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("planExpirationDate", planExpirationDate || "");
    }

    return response;
  };

  const getPlanExpirationDate = async () => {
    const dateStr = await AsyncStorage.getItem("planExpirationDate");
    return dateStr ? new Date(dateStr) : null;
  };

  const isPlanActive = async () => {
    const expirationDate = await getPlanExpirationDate();
    if (!expirationDate) return false;

    return new Date() < expirationDate;
  };

  return {
    login,
    register,
    logout,
    getToken,
    getRefreshToken,
    isAuthenticated,
    getPlanExpirationDate,
    isPlanActive,
  };
}
