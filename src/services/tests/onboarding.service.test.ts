import type { OnboardingRequest } from "@/types/onboarding.types";
import { api, handleApiError } from "../api";
import { onboardingService } from "../onboarding.service";

jest.mock("../api", () => ({
  __esModule: true,
  api: {
    post: jest.fn(),
  },
  handleApiError: jest.fn((error: unknown) => {
    throw error;
  }),
}));

describe("onboarding.service", () => {
  const payload: OnboardingRequest = {
    desiredCourse: "Computacao",
    desiredUniversity: "UFRGS",
    preferredLanguage: "ENGLISH",
    studyHours: {
      MONDAY: [18, 19],
      WEDNESDAY: [20],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("envia o payload para o endpoint de onboarding", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(onboardingService.submit(payload)).resolves.toBeUndefined();

    expect(api.post).toHaveBeenCalledWith("/onboarding", payload);
  });

  it("trata resposta 204 no content como sucesso", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(onboardingService.submit({})).resolves.toBeUndefined();

    expect(api.post).toHaveBeenCalledWith("/onboarding", {});
  });

  it("delegates API errors to handleApiError", async () => {
    const apiError = { message: "Erro ao salvar onboarding" };
    (api.post as jest.Mock).mockRejectedValueOnce(apiError);

    await expect(onboardingService.submit(payload)).rejects.toEqual(apiError);

    expect(handleApiError).toHaveBeenCalledWith(apiError);
  });
});
