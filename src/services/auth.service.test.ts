import { authService } from "./auth.service";
import http from "./api";

jest.mock("./api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const mockPost = http.post as jest.Mock;

describe("auth.service login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna LoginResponse em sucesso", async () => {
    const apiBody = {
      success: true,
      data: {
        token: "jwt",
        refreshToken: "r",
        role: "USER",
        planExpirationDate: "2099-01-01",
      },
    };
    mockPost.mockResolvedValueOnce(apiBody);

    await expect(authService.login({ email: "a@b.com", password: "x" })).resolves.toEqual(apiBody);
  });

  it("repassa resposta com success false sem lançar", async () => {
    const body = { success: false, message: "inválido" };
    mockPost.mockResolvedValueOnce(body);
    await expect(authService.login({ email: "a@b.com", password: "x" })).resolves.toEqual(body);
  });

  it("propaga rejeição estilo HTTP client", async () => {
    const err = { response: { data: { message: "401" } } };
    mockPost.mockRejectedValueOnce(err);
    await expect(authService.login({ email: "a@b.com", password: "x" })).rejects.toEqual(err);
  });

  it("propaga Error genérico", async () => {
    mockPost.mockRejectedValueOnce(new Error("network"));
    await expect(authService.login({ email: "a@b.com", password: "x" })).rejects.toThrow("network");
  });
});
