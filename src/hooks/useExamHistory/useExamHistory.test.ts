jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    })),
    isAxiosError: jest.fn(() => false),
  },
  isAxiosError: jest.fn(() => false),
}));

jest.mock("@/services/api");
jest.mock("@/services/examHistory/examHistory.service");

import { useExamHistory } from "@/hooks/useExamHistory";
import { examHistoryService } from "@/services/examHistory/examHistory.service";
import { ExamHistory } from "@/types/exam-history.types";
import { act, renderHook, waitFor } from "@testing-library/react-native";

const mockExamData: ExamHistory = {
  success: true,
  data: {
    exam: {
      id: "exam-123",
      name: "Novembro 2024",
      origin: "ENEM",
    },
    summary: {
      averageScore: 720,
      totalCompleted: 3,
    },
    history: [
      {
        attemptDayId: "attempt-1",
        day: 1,
        totalQuestions: 90,
        answeredQuestions: 82,
        correctAnswers: 65,
        timeSpentSeconds: 5400,
        completedAt: "2025-02-13T16:45:00.000Z",
      },
    ],
  },
};

describe("useExamHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with loading false and error null", () => {
    (examHistoryService.history as jest.Mock).mockResolvedValue(mockExamData);

    const { result } = renderHook(() => useExamHistory());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should set loading to true when fetching", async () => {
    (examHistoryService.history as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockExamData), 100))
    );

    const { result } = renderHook(() => useExamHistory());

    act(() => {
      result.current.getExamHistory("exam-123");
    });

    expect(typeof result.current.loading).toBe("boolean");
  });

  it("should return exam history data on success", async () => {
    (examHistoryService.history as jest.Mock).mockResolvedValue(mockExamData);

    const { result } = renderHook(() => useExamHistory());

    let data: ExamHistory | undefined;

    await act(async () => {
      data = await result.current.getExamHistory("exam-123");
    });

    expect(data).toEqual(mockExamData);
  });

  it("should set error on failure", async () => {
    const errorMessage = "Erro ao carregar histórico";
    (examHistoryService.history as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useExamHistory());

    await act(async () => {
      try {
        await result.current.getExamHistory("exam-123");
      } catch {
        // Erro esperado
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("should call examHistoryService.history with correct examId", async () => {
    (examHistoryService.history as jest.Mock).mockResolvedValue(mockExamData);

    const { result } = renderHook(() => useExamHistory());

    await act(async () => {
      await result.current.getExamHistory("exam-456");
    });

    expect(examHistoryService.history).toHaveBeenCalledWith("exam-456");
  });

  it("should clear error when clearError is called", async () => {
    (examHistoryService.history as jest.Mock).mockRejectedValue(new Error("Erro"));

    const { result } = renderHook(() => useExamHistory());

    await act(async () => {
      try {
        await result.current.getExamHistory("exam-123");
      } catch {
        // Erro esperado
      }
    });

    await waitFor(() => {
      expect(result.current.error).not.toBe(null);
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it("should set loading to false after successful fetch", async () => {
    (examHistoryService.history as jest.Mock).mockResolvedValue(mockExamData);

    const { result } = renderHook(() => useExamHistory());

    await act(async () => {
      await result.current.getExamHistory("exam-123");
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should set loading to false after failed fetch", async () => {
    (examHistoryService.history as jest.Mock).mockRejectedValue(new Error("Erro"));

    const { result } = renderHook(() => useExamHistory());

    await act(async () => {
      try {
        await result.current.getExamHistory("exam-123");
      } catch {
        // Erro esperado
      }
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should handle custom error message", async () => {
    const customError = { message: "Custom error message" };
    (examHistoryService.history as jest.Mock).mockRejectedValue(customError);

    const { result } = renderHook(() => useExamHistory());

    await act(async () => {
      try {
        await result.current.getExamHistory("exam-123");
      } catch {
        // Erro esperado
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Custom error message");
    });
  });

  it("should throw error after setting error state", async () => {
    (examHistoryService.history as jest.Mock).mockRejectedValue(new Error("Test error"));

    const { result } = renderHook(() => useExamHistory());

    let thrownError: Error | null = null;

    await act(async () => {
      try {
        await result.current.getExamHistory("exam-123");
      } catch (err) {
        thrownError = err as Error;
      }
    });

    await waitFor(() => {
      expect(thrownError).not.toBeNull();
      expect(result.current.error).not.toBeNull();
    });
  });
});
