import api from "@/services/api";
import { subscriptionService } from "@/services/subscription/subscription.service";

jest.mock("@/services/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
  handleApiError: (err: unknown) => {
    throw err;
  },
}));

const MOCK_SUCCESS_RESPONSE = {
  success: true,
  data: {
    planActive: true,
    planExpirationDate: "2026-07-18",
    token: "new_access_token",
    refreshToken: "new_refresh_token",
  },
};

describe("subscriptionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar api.post no endpoint correto (/subscriptions)", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);

    await subscriptionService.subscribe({ planType: "TRIMESTRAL" });

    expect(api.post).toHaveBeenCalledWith("/subscriptions", { planType: "TRIMESTRAL" });
  });

  it("deve enviar planType TRIMESTRAL corretamente", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);

    await subscriptionService.subscribe({ planType: "TRIMESTRAL" });

    const [, body] = (api.post as jest.Mock).mock.calls[0];
    expect(body).toEqual({ planType: "TRIMESTRAL" });
  });

  it("deve enviar planType ANUAL corretamente", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);

    await subscriptionService.subscribe({ planType: "ANUAL" });

    const [, body] = (api.post as jest.Mock).mock.calls[0];
    expect(body).toEqual({ planType: "ANUAL" });
  });

  it("deve retornar a resposta da API", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);

    const result = await subscriptionService.subscribe({ planType: "TRIMESTRAL" });

    expect(result).toEqual(MOCK_SUCCESS_RESPONSE);
  });

  it("deve propagar erros lançados pela api", async () => {
    const apiError = new Error("Network error");
    (api.post as jest.Mock).mockRejectedValueOnce(apiError);

    await expect(subscriptionService.subscribe({ planType: "TRIMESTRAL" })).rejects.toThrow(
      "Network error"
    );
  });
});
