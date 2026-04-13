import { login } from "./auth.service";
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

  it("retorna UserSession em sucesso", async () => {
    mockPost.mockResolvedValueOnce({
      success: true,
      data: {
        token: "jwt",
        refreshToken: "r",
        role: "USER",
        planExpirationDate: "2099-01-01",
      },
    });

    await expect(login({ email: "a@b.com", password: "x" })).resolves.toEqual({
      token: "jwt",
      role: "USER",
      planActive: true,
    });
  });

  it("lança com corpo de erro", async () => {
    mockPost.mockResolvedValueOnce({ success: false, message: "inválido" });
    await expect(login({ email: "a@b.com", password: "x" })).rejects.toThrow("inválido");
  });

  it("lança com mensagem de erro estilo HTTP client", async () => {
    mockPost.mockRejectedValueOnce({
      response: { data: { message: "401" } },
    });
    await expect(login({ email: "a@b.com", password: "x" })).rejects.toThrow("401");
  });

  it("propaga Error genérico", async () => {
    mockPost.mockRejectedValueOnce(new Error("network"));
    await expect(login({ email: "a@b.com", password: "x" })).rejects.toThrow("network");
  });
});
