import api, { handleApiError } from "@/services/api";
import { getUserStreak } from "@/services/streak.service";

jest.mock("@/services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  handleApiError: jest.fn(),
}));

describe("streak.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("chama GET /users/streak corretamente e devolve o payload sem wrapper", async () => {
    const mockedResponse = {
      streakDays: 7,
      streakActive: true,
    };

    (api.get as jest.Mock).mockResolvedValue(mockedResponse);

    const result = await getUserStreak();

    expect(api.get).toHaveBeenCalledWith("/users/streak");
    expect(result).toEqual(mockedResponse);
    expect(result.streakDays).toBe(7);
    expect(result.streakActive).toBe(true);
  });

  it("chama handleApiError quando a requisição falha", async () => {
    const mockedError = new Error("Erro na API");

    (api.get as jest.Mock).mockRejectedValue(mockedError);

    await expect(getUserStreak()).rejects.toThrow();
    expect(handleApiError).toHaveBeenCalledWith(mockedError);
  });
});
