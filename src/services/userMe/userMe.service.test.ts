import api from "@/services/api";
import { userMeService } from "./userMe.service";

jest.mock("@/services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  handleApiError: jest.fn((e: unknown) => e),
}));

const mockApi = api as jest.Mocked<typeof api>;

describe("userMeService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("getMe", () => {
    it("deve chamar GET /users/me e retornar a resposta completa", async () => {
      const data = {
        plan_end_date: "2026-12-31",
        onboarding_completed: true,
        profile_picture_url: "https://cdn.example.com/pic.jpg",
      };
      mockApi.get.mockResolvedValueOnce(data);

      const result = await userMeService.getMe();

      expect(mockApi.get).toHaveBeenCalledWith("/users/me");
      expect(result).toEqual(data);
    });

    it("deve retornar campos nulos quando usuário não tem plano nem foto", async () => {
      const data = {
        plan_end_date: null,
        onboarding_completed: false,
        profile_picture_url: null,
      };
      mockApi.get.mockResolvedValueOnce(data);

      const result = await userMeService.getMe();

      expect(result.plan_end_date).toBeNull();
      expect(result.profile_picture_url).toBeNull();
      expect(result.onboarding_completed).toBe(false);
    });

    it("deve lançar erro tratado quando a requisição falha", async () => {
      mockApi.get.mockRejectedValueOnce(new Error("Unauthorized"));

      await expect(userMeService.getMe()).rejects.toThrow("Unauthorized");
    });
  });
});
