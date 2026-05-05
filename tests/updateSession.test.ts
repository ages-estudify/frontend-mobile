import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
}));

jest.mock("@/services/auth.service", () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

import { useAuth } from "@/hooks/useAuth";

const mockSetItem = AsyncStorage.setItem as jest.Mock;

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
