import { authService } from "@/services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const register = async (body: RegisterParams) => {
    console.log("Register body:", body);

    const response = await authService.register(body);

    // se o backend DEVOLVE token no register
    const { token, refreshToken } = response;

    if (token && refreshToken) {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("refreshToken", refreshToken);
    }

    return response;
  };

  return {
    login,
    register,
    logout,
    getToken,
    getRefreshToken,
    isAuthenticated,
  };
}
