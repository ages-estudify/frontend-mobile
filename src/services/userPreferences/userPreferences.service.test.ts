import type { UpdateUserPreferencesRequest } from "@/types/userPreferences.types";
import { api, handleApiError } from "../api";
import { userPreferencesService } from "./userPreferences.service";

jest.mock("../api", () => ({
  __esModule: true,
  api: {
    patch: jest.fn(),
  },
  handleApiError: jest.fn((error: unknown) => {
    throw error;
  }),
}));

describe("userPreferencesService", () => {
  const payload: UpdateUserPreferencesRequest = {
    name: "Maria dos Santos",
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

  it("envia PATCH para /users/preferences", async () => {
    (api.patch as jest.Mock).mockResolvedValueOnce({
      message: "Preferências atualizadas e cronograma recalculado.",
    });

    await expect(userPreferencesService.update(payload)).resolves.toEqual({
      message: "Preferências atualizadas e cronograma recalculado.",
    });

    expect(api.patch).toHaveBeenCalledWith("/users/preferences", payload);
  });

  it("delegates API errors to handleApiError", async () => {
    const apiError = { message: "Erro ao salvar preferências" };
    (api.patch as jest.Mock).mockRejectedValueOnce(apiError);

    await expect(userPreferencesService.update(payload)).rejects.toEqual(apiError);

    expect(handleApiError).toHaveBeenCalledWith(apiError);
  });
});
