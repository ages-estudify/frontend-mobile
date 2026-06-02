import { getUserStars } from "@/services/stars/stars.service";
import api, { handleApiError } from "@/services/api";

jest.mock("@/services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  handleApiError: jest.fn(),
}));

describe("stars.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("chama GET /users/me/coins corretamente", async () => {
    const mockedResponse = {
      data: {
        coins: 47,
      },
    };

    (api.get as jest.Mock).mockResolvedValue(mockedResponse);

    const result = await getUserStars();

    expect(api.get).toHaveBeenCalledWith("/users/me/coins");
    expect(result).toEqual(mockedResponse);
  });

  it("chama handleApiError quando a requisição falha", async () => {
    const mockedError = new Error("Erro na API");

    (api.get as jest.Mock).mockRejectedValue(mockedError);

    await getUserStars();

    expect(handleApiError).toHaveBeenCalledWith(mockedError);
  });
});
