import { endPoints } from "@/routes/endpoints";
import type { UserStatsData } from "@/types/userStats";
import api, { handleApiError } from "../api";
import { usersStatsService } from "./usersStats.service";

jest.mock("../api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  handleApiError: jest.fn(),
}));

const mockedGet = api.get as jest.Mock;

describe("usersStatsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("chama GET no endpoint de stats e retorna o corpo da resposta", async () => {
    const stats = { totalQuestions: 10, correctAnswers: 7 } as unknown as UserStatsData;
    mockedGet.mockResolvedValue({ data: stats });

    const result = await usersStatsService.getUserStats();

    expect(mockedGet).toHaveBeenCalledWith(endPoints.users.stats);
    expect(result).toEqual(stats);
  });

  it("chama handleApiError e relança o erro quando a requisição falha", async () => {
    const error = new Error("Erro na API");
    mockedGet.mockRejectedValue(error);

    await expect(usersStatsService.getUserStats()).rejects.toBe(error);

    expect(handleApiError).toHaveBeenCalledWith(error);
  });
});
