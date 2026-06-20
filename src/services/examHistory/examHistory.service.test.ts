import api, { handleApiError } from "../api";
import { examHistoryService } from "./examHistory.service";

jest.mock("../api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  handleApiError: jest.fn((error: unknown) => {
    throw error;
  }),
}));

const mockGet = api.get as jest.Mock;
const mockHandleApiError = handleApiError as jest.Mock;

describe("examHistoryService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns exam history from API", async () => {
    const payload = {
      success: true,
      data: {
        exam: { id: "exam-1", name: "ENEM", origin: "ENEM" },
        summary: { averageScore: 700, totalCompleted: 2 },
        history: [],
      },
    };
    mockGet.mockResolvedValueOnce(payload);

    await expect(examHistoryService.history("exam-1")).resolves.toEqual(payload);
    expect(mockGet).toHaveBeenCalled();
  });

  it("returns empty history when API responds with 404", async () => {
    mockGet.mockRejectedValueOnce({ response: { status: 404 } });

    await expect(examHistoryService.history("missing-exam")).resolves.toEqual({
      success: true,
      data: {
        exam: { id: "missing-exam", name: "", origin: "" },
        summary: { averageScore: 0, totalCompleted: 0 },
        history: [],
      },
    });
  });

  it("delegates unexpected errors to handleApiError", async () => {
    const error = new Error("network");
    mockGet.mockRejectedValueOnce(error);

    await expect(examHistoryService.history("exam-1")).rejects.toThrow("network");
    expect(mockHandleApiError).toHaveBeenCalledWith(error);
  });
});
