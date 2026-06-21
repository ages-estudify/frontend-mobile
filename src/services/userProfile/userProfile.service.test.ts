import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { handleApiError } from "@/services/api";
import { getCurrentUserId, userProfileService } from "./userProfile.service";

jest.mock("@/services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  handleApiError: jest.fn((error: unknown) => {
    throw error;
  }),
}));

function createToken(payload: object): string {
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `header.${encodedPayload}.signature`;
}

describe("userProfileService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("busca o perfil no endpoint /users/:id e mapeia snake_case para camelCase", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      id: "user-1",
      full_name: "Maria dos Santos",
      email: "maria@email.com",
      phone_number: "+55 51 99908-9542",
      role: "USER",
      plan_end_date: "2026-12-31",
      desired_course: "Computação",
      preferred_language: "ENGLISH",
      desired_university: "UFRGS",
      birth_date: "2003-09-17",
      plan_status: "active",
    });

    const profile = await userProfileService.getById("user-1");

    expect(api.get).toHaveBeenCalledWith("/users/user-1");
    expect(profile).toEqual({
      id: "user-1",
      fullName: "Maria dos Santos",
      email: "maria@email.com",
      phone: "+55 51 99908-9542",
      role: "USER",
      planEndDate: "2026-12-31",
      desiredCourse: "Computação",
      preferredLanguage: "ENGLISH",
      desiredUniversity: "UFRGS",
      birthDate: "2003-09-17",
      planStatus: "active",
    });
  });

  it("recupera o userId do token e persiste para próximas chamadas", async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(async (key: string) => {
      if (key === "userId") return null;
      if (key === "token") return createToken({ userId: "user-from-token" });
      return null;
    });

    await expect(getCurrentUserId()).resolves.toBe("user-from-token");

    expect(AsyncStorage.setItem).toHaveBeenCalledWith("userId", "user-from-token");
  });

  it("delegates API errors to handleApiError", async () => {
    const apiError = { message: "Usuário não encontrado" };
    (api.get as jest.Mock).mockRejectedValueOnce(apiError);

    await expect(userProfileService.getById("missing-user")).rejects.toEqual(apiError);

    expect(handleApiError).toHaveBeenCalledWith(apiError);
  });
});
