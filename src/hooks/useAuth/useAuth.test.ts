import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
}));

jest.mock("@/services/auth/auth.service", () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

// useAuth() depends on the AuthSession context (via useAuthSession). The hook is
// exercised here outside of an <AuthProvider>, so we mock the context to expose a
// real updatePlanSession that persists planExpirationDate to AsyncStorage, mirroring
// the production implementation (AuthContext.updatePlanSession).
jest.mock("@/contexts/AuthContext", () => {
  const asyncStorageModule = require("@react-native-async-storage/async-storage");
  const ManagedAsyncStorage = asyncStorageModule.default ?? asyncStorageModule;
  return {
    useAuthSession: () => ({
      role: "USER",
      planExpirationDate: null,
      planActive: false,
      updatePlanSession: jest.fn(async ({ planExpirationDate, planActive }) => {
        if (planExpirationDate) {
          await ManagedAsyncStorage.setItem("planExpirationDate", planExpirationDate);
        } else {
          await ManagedAsyncStorage.removeItem("planExpirationDate");
        }
        await ManagedAsyncStorage.setItem("planActive", String(planActive));
      }),
      updatePlanExpirationDate: jest.fn(),
      setSessionFromCredentials: jest.fn(),
      clearSessionMetadata: jest.fn(),
    }),
  };
});

import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth/auth.service";
import { router } from "expo-router";

const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockMultiRemove = AsyncStorage.multiRemove as jest.Mock;
const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockLogin = authService.login as jest.Mock;
const mockRegister = authService.register as jest.Mock;

describe("useAuth.updateSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve persistir access token no AsyncStorage", async () => {
    const { updateSession } = useAuth();

    await updateSession("new_tok", "new_ref", "2026-07-18");

    expect(mockSetItem).toHaveBeenCalledWith("token", "new_tok");
  });

  it("deve persistir refresh token no AsyncStorage", async () => {
    const { updateSession } = useAuth();

    await updateSession("new_tok", "new_ref", "2026-07-18");

    expect(mockSetItem).toHaveBeenCalledWith("refreshToken", "new_ref");
  });

  it("deve persistir planExpirationDate no AsyncStorage", async () => {
    const { updateSession } = useAuth();

    await updateSession("new_tok", "new_ref", "2026-07-18");

    expect(mockSetItem).toHaveBeenCalledWith("planExpirationDate", "2026-07-18");
  });

  it("deve sobrescrever token anterior com o novo token", async () => {
    const { updateSession } = useAuth();

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("old_token");

    await updateSession("brand_new_token", "brand_new_ref", "2026-07-18");

    const tokenCalls = mockSetItem.mock.calls.filter(([k]: [string]) => k === "token");
    expect(tokenCalls.at(-1)![1]).toBe("brand_new_token");
  });

  it("deve sobrescrever refreshToken anterior com o novo refreshToken", async () => {
    const { updateSession } = useAuth();

    await updateSession("t", "brand_new_refresh", "2026-07-18");

    const refCalls = mockSetItem.mock.calls.filter(([k]: [string]) => k === "refreshToken");
    expect(refCalls.at(-1)![1]).toBe("brand_new_refresh");
  });

  it("deve persistir todos os três valores em uma única chamada", async () => {
    const { updateSession } = useAuth();

    await updateSession("tok", "ref", "2026-12-31");

    const keys = mockSetItem.mock.calls.map(([k]: [string]) => k);
    expect(keys).toContain("token");
    expect(keys).toContain("refreshToken");
    expect(keys).toContain("planExpirationDate");
  });
});

describe("useAuth auth flows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockReset();
    mockGetItem.mockResolvedValue(null);
  });

  it("login persiste credenciais e retorna resposta da API", async () => {
    const response = {
      data: {
        token: "jwt",
        refreshToken: "refresh",
        role: "USER",
        planExpirationDate: "2099-01-01",
      },
    };
    mockLogin.mockResolvedValueOnce(response);

    const { login } = useAuth();
    await expect(login({ email: "a@b.com", password: "123456" })).resolves.toEqual(response);

    expect(mockSetItem).toHaveBeenCalledWith("token", "jwt");
    expect(mockSetItem).toHaveBeenCalledWith("refreshToken", "refresh");
    expect(mockSetItem).toHaveBeenCalledWith("role", "USER");
  });

  it("register persiste credenciais quando tokens existem", async () => {
    const response = {
      data: {
        token: "jwt",
        refreshToken: "refresh",
        role: "USER",
        planExpirationDate: "2099-01-01",
      },
    };
    mockRegister.mockResolvedValueOnce(response);

    const { register } = useAuth();
    await expect(
      register({
        fullName: "User",
        email: "a@b.com",
        birthDate: "2000-01-01",
        phone: "11999999999",
        password: "123456",
      })
    ).resolves.toEqual(response);

    expect(mockSetItem).toHaveBeenCalledWith("token", "jwt");
  });

  it("logout limpa storage e redireciona para login", async () => {
    const { logout } = useAuth();
    await logout();

    expect(mockMultiRemove).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith("/login");
  });

  it("getToken e isAuthenticated leem o token do storage", async () => {
    mockGetItem.mockResolvedValue("stored-token");

    const { getToken, isAuthenticated } = useAuth();
    await expect(getToken()).resolves.toBe("stored-token");
    await expect(isAuthenticated()).resolves.toBe(true);
  });
});
