import { useAuthSession } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import { hasGatedContentAccess } from "@/utils/subscription-access";
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

async function persistPlanExpirationDate(planExpirationDate: string | null) {
  if (planExpirationDate) {
    await AsyncStorage.setItem("planExpirationDate", planExpirationDate);
  } else {
    await AsyncStorage.removeItem("planExpirationDate");
  }
}

export function useAuth() {
  const session = useAuthSession();

  const login = async ({ email, password }: LoginParams) => {
    const response = await authService.login({ email, password });

    const { token, refreshToken, role, planExpirationDate } = response.data;

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("role", role);
    await persistPlanExpirationDate(planExpirationDate);

    session.setSessionFromCredentials(role, planExpirationDate);

    return response;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "refreshToken", "planExpirationDate", "role"]);
    session.clearSessionMetadata();
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

    const { token, refreshToken, planExpirationDate, role } = response.data;

    if (token && refreshToken) {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("role", role);
      await persistPlanExpirationDate(planExpirationDate);
      session.setSessionFromCredentials(role, planExpirationDate);
    }

    return response;
  };

  const getPlanExpirationDate = async () => {
    const dateStr = await AsyncStorage.getItem("planExpirationDate");
    return dateStr && dateStr.length > 0 ? new Date(dateStr) : null;
  };

  const isPlanActive = async () => {
    return hasGatedContentAccess(session.role, session.planExpirationDate);
  };

  const updateSession = async (token: string, refreshToken: string, planExpirationDate: string) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("planExpirationDate", planExpirationDate);
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
    updateSession,
    updatePlanExpirationDate: session.updatePlanExpirationDate,
  };
}
