import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "@/services/auth.service";

type LoginParams = {
  email: string;
  password: string;
};

export function useAuth() {
  const login = async ({ email, password }: LoginParams) => {
    const response = await authService.login({ email, password });

    const { token, refreshToken } = response.data;

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("refreshToken", refreshToken);

    return response;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("refreshToken");
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

  return {
    login,
    logout,
    getToken,
    getRefreshToken,
    isAuthenticated,
  };
}
