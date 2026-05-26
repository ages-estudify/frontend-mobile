import { getAttemptDayResult, getExamResultGrid } from "./examFeedback.service";
import api, { handleApiError } from "../api";

jest.mock("../api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  handleApiError: jest.fn((error) => error),
}));

describe("examFeedback.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAttemptDayResult", () => {
    it("should call attempt day result route with attemptDayId", async () => {
      const response = {
        success: true,
        data: {
          attemptDayId: "attempt-day-id",
          attemptId: "attempt-id",
          totalQuestions: 10,
          correctAnswers: 7,
          wrongAnswers: 2,
          blankAnswers: 1,
          timeSpentMinutes: 90,
        },
      };

      (api.get as jest.Mock).mockResolvedValue(response);

      const result = await getAttemptDayResult("attempt-day-id");

      expect(api.get).toHaveBeenCalledWith("/attempt-days/attempt-day-id/result");
      expect(result).toEqual(response);
    });

    it("should throw handled error when request fails", async () => {
      const error = new Error("request failed");

      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(getAttemptDayResult("attempt-day-id")).rejects.toThrow("request failed");
      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });

  describe("getExamResultGrid", () => {
    it("should call result grid route without params when filter is ALL", async () => {
      const response = {
        success: true,
        data: {
          attemptId: "attempt-id",
          totalQuestions: 3,
          grid: [],
        },
      };

      (api.get as jest.Mock).mockResolvedValue(response);

      const result = await getExamResultGrid("attempt-id", "ALL");

      expect(api.get).toHaveBeenCalledWith("/exams/attempt-id/resultGrid", {
        params: undefined,
      });
      expect(result).toEqual(response);
    });

    it("should call result grid route with statusFilter when filter is selected", async () => {
      const response = {
        success: true,
        data: {
          attemptId: "attempt-id",
          totalQuestions: 3,
          grid: [],
        },
      };

      (api.get as jest.Mock).mockResolvedValue(response);

      const result = await getExamResultGrid("attempt-id", "CORRECT");

      expect(api.get).toHaveBeenCalledWith("/exams/attempt-id/resultGrid", {
        params: {
          statusFilter: "CORRECT",
        },
      });
      expect(result).toEqual(response);
    });

    it("should forward attemptDayId in params when provided", async () => {
      const response = {
        success: true,
        data: {
          attemptId: "attempt-id",
          totalQuestions: 3,
          grid: [],
        },
      };

      (api.get as jest.Mock).mockResolvedValue(response);

      const result = await getExamResultGrid("attempt-id", "ALL", "day-id");

      expect(api.get).toHaveBeenCalledWith("/exams/attempt-id/resultGrid", {
        params: { attemptDayId: "day-id" },
      });
      expect(result).toEqual(response);
    });

    it("should throw handled error when result grid request fails", async () => {
      const error = new Error("grid failed");

      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(getExamResultGrid("attempt-id", "WRONG")).rejects.toThrow("grid failed");
      expect(handleApiError).toHaveBeenCalledWith(error);
    });
  });
});
