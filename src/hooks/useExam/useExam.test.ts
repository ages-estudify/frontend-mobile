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

import { useExam } from "@/hooks/useExam";
import { useStreak } from "@/hooks/useStreak";
import { attemptExamService } from "@/services/attemptExam/attemptExam.service";
import { act, renderHook, waitFor } from "@testing-library/react-native";

jest.mock("@/services/api");
jest.mock("@/services/attemptExam/attemptExam.service");
jest.mock("@/hooks/useStreak", () => ({
  useStreak: jest.fn(),
}));
jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({
    examId: "exam-123",
    language: "ENGLISH",
  }),
}));

const mockedUseStreak = useStreak as jest.Mock;

describe("useExam", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockedUseStreak.mockReturnValue({ updateStreak: jest.fn() });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("createAttempt", () => {
    it("should create a new attempt with language", async () => {
      const mockAttempt = {
        success: true,
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentSeconds: 0,
            language: "ENGLISH",
            initTime: "2026-03-12",
            endTime: null,
          },
          questions: [
            {
              id: "q-1",
              number: 1,
              text: "Question 1",
              imageUrl: null,
              day: 1,
              alternatives: [
                { id: "a-1", letter: "A", text: "Option A" },
                { id: "a-2", letter: "B", text: "Option B" },
              ],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue({
        success: true,
        data: { attempt: mockAttempt.data.attempt },
      });
      (attemptExamService.getLatestAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentAttempt?.attempt.id).toBe("attempt-123");
      });

      expect(result.current.currentAttempt?.attempt.id).toBe("attempt-123");
      expect(result.current.currentAttempt?.questions.length).toBe(1);
    });

    it("should set error on create attempt failure", async () => {
      const errorMessage = "Network error";
      (attemptExamService.createAttempt as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });
    });
  });

  describe("getLatestAttempt", () => {
    it("should fetch latest attempt and restore state", async () => {
      const mockAttempt = {
        success: true,
        data: {
          attempt: {
            id: "attempt-456",
            examId: "exam-123",
            currentQuestion: 5,
            timeSpentSeconds: 1500,
            language: "ENGLISH",
            initTime: "2026-03-12",
            endTime: null,
          },
          questions: Array(45)
            .fill(null)
            .map((_, i) => ({
              id: `q-${i}`,
              number: i + 1,
              text: `Question ${i + 1}`,
              imageUrl: null,
              day: 1,
              alternatives: [{ id: `a-${i}-1`, letter: "A", text: "Option A" }],
              selectedAlternativeId: i < 3 ? `a-${i}-1` : null,
            })),
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue({
        success: true,
        data: { attempt: mockAttempt.data.attempt },
      });
      (attemptExamService.getLatestAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentAttempt?.attempt.id).toBe("attempt-456");
      });

      expect(result.current.currentAttempt?.attempt.timeSpentSeconds).toBe(1500);
      // currentQuestion (5) - 1 should restore the index to 4
      expect(result.current.currentQuestionIndex).toBe(4);
    });
  });

  describe("submitAnswer", () => {
    it("should submit answer with attemptId", async () => {
      const mockAttempt = {
        success: true,
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentSeconds: 0,
            language: "ENGLISH",
            initTime: "2026-03-12",
            endTime: null,
          },
          questions: [
            {
              id: "q-1",
              number: 1,
              text: "Question 1",
              imageUrl: null,
              day: 1,
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      const updateStreak = jest.fn();
      mockedUseStreak.mockReturnValue({ updateStreak });

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue({
        success: true,
        data: { attempt: mockAttempt.data.attempt },
      });
      (attemptExamService.getLatestAttempt as jest.Mock).mockResolvedValue(mockAttempt);
      (attemptExamService.submitAnswer as jest.Mock).mockResolvedValue({
        success: true,
        data: { saved: true, streakDays: 4, streakActive: true },
      });

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentAttempt).toBeDefined();
      });

      await act(async () => {
        await result.current.submitAnswer({
          questionId: "q-1",
          selectedAnswer: "A",
          attemptId: "attempt-123",
          timeSpentSeconds: 30,
        });
      });

      expect(attemptExamService.submitAnswer).toHaveBeenCalledWith("q-1", {
        selectedAnswer: "A",
        attemptId: "attempt-123",
        timeSpentSeconds: 30,
      });
      expect(updateStreak).toHaveBeenCalledWith({
        streakDays: 4,
        streakActive: true,
      });
    });
  });

  describe("submitAnswer (no streak)", () => {
    it("should not update streak when streak fields are absent", async () => {
      const mockAttempt = {
        success: true,
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentSeconds: 0,
            language: "ENGLISH",
            initTime: "2026-03-12",
            endTime: null,
          },
          questions: [
            {
              id: "q-1",
              number: 1,
              text: "Question 1",
              imageUrl: null,
              day: 1,
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      const updateStreak = jest.fn();
      mockedUseStreak.mockReturnValue({ updateStreak });

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue({
        success: true,
        data: { attempt: mockAttempt.data.attempt },
      });
      (attemptExamService.getLatestAttempt as jest.Mock).mockResolvedValue(mockAttempt);
      (attemptExamService.submitAnswer as jest.Mock).mockResolvedValue({
        success: true,
        data: { saved: true },
      });

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentAttempt).toBeDefined();
      });

      await act(async () => {
        await result.current.submitAnswer({
          questionId: "q-1",
          selectedAnswer: "A",
          attemptId: "attempt-123",
          timeSpentSeconds: 12,
        });
      });

      expect(attemptExamService.submitAnswer).toHaveBeenCalledWith("q-1", {
        selectedAnswer: "A",
        attemptId: "attempt-123",
        timeSpentSeconds: 12,
      });
      expect(updateStreak).not.toHaveBeenCalled();
    });
  });

  describe("finishAttempt", () => {
    it("should finish attempt and return result", async () => {
      const mockAttempt = {
        success: true,
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentSeconds: 0,
            language: "ENGLISH",
            initTime: "2026-03-12",
            endTime: null,
          },
          questions: [
            {
              id: "q-1",
              number: 1,
              text: "Question 1",
              imageUrl: null,
              day: 1,
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: "a-1",
            },
          ],
        },
      };

      const mockResult = {
        success: true,
        data: {
          attemptId: "attempt-123",
          examId: "exam-123",
          timeSpentMinutes: 53.3,
          endTime: "2026-03-12",
          score: 30,
          totalQuestions: 45,
          answeredQuestions: 40,
          correctAnswers: 30,
          wrongAnswers: 10,
          blankAnswers: 5,
          resultBySubject: [
            {
              subjectId: "subj-1",
              subjectName: "História",
              totalQuestions: 10,
              correctAnswers: 7,
              wrongAnswers: 2,
              blankAnswers: 1,
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue({
        success: true,
        data: { attempt: mockAttempt.data.attempt },
      });
      (attemptExamService.getLatestAttempt as jest.Mock).mockResolvedValue(mockAttempt);
      (attemptExamService.finishAttempt as jest.Mock).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentAttempt).toBeDefined();
      });

      let finishResult: any;
      await act(async () => {
        finishResult = await result.current.finishAttempt({
          attemptId: "attempt-123",
          timeSpentSeconds: 3198,
        });
      });

      expect(attemptExamService.finishAttempt).toHaveBeenCalledWith("attempt-123", {
        timeSpentSeconds: 3198,
        examDayId: undefined,
      });
      expect(finishResult.data.score).toBe(30);
    });
  });

  describe("Navigation", () => {
    it("should navigate to next question", async () => {
      const mockAttempt = {
        success: true,
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentSeconds: 0,
            language: "ENGLISH",
            initTime: "2026-03-12",
            endTime: null,
          },
          questions: [
            {
              id: "q-1",
              number: 1,
              text: "Question 1",
              imageUrl: null,
              day: 1,
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
            {
              id: "q-2",
              number: 2,
              text: "Question 2",
              imageUrl: null,
              day: 1,
              alternatives: [{ id: "a-2", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue({
        success: true,
        data: { attempt: mockAttempt.data.attempt },
      });
      (attemptExamService.getLatestAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentQuestion?.id).toBe("q-1");
      });

      act(() => {
        result.current.nextQuestion(null);
      });

      expect(result.current.currentQuestion?.id).toBe("q-2");
    });

    it("should navigate to previous question", async () => {
      const mockAttempt = {
        success: true,
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentSeconds: 0,
            language: "ENGLISH",
            initTime: "2026-03-12",
            endTime: null,
          },
          questions: [
            {
              id: "q-1",
              number: 1,
              text: "Question 1",
              imageUrl: null,
              day: 1,
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
            {
              id: "q-2",
              number: 2,
              text: "Question 2",
              imageUrl: null,
              day: 1,
              alternatives: [{ id: "a-2", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue({
        success: true,
        data: { attempt: mockAttempt.data.attempt },
      });
      (attemptExamService.getLatestAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentQuestion?.id).toBe("q-1");
      });

      act(() => {
        result.current.nextQuestion(null);
      });

      act(() => {
        result.current.prevQuestion(null);
      });

      expect(result.current.currentQuestion?.id).toBe("q-1");
    });

    it("should go to specific question by index", async () => {
      const mockAttempt = {
        success: true,
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentSeconds: 0,
            language: "ENGLISH",
            initTime: "2026-03-12",
            endTime: null,
          },
          questions: Array(5)
            .fill(null)
            .map((_, i) => ({
              id: `q-${i}`,
              number: i + 1,
              text: `Question ${i + 1}`,
              imageUrl: null,
              day: 1,
              alternatives: [{ id: `a-${i}`, letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            })),
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue({
        success: true,
        data: { attempt: mockAttempt.data.attempt },
      });
      (attemptExamService.getLatestAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentQuestion?.id).toBe("q-0");
      });

      act(() => {
        result.current.goToQuestion(3, null);
      });

      expect(result.current.currentQuestion?.number).toBe(4);
    });
  });

  describe("Timer", () => {
    it("should format time correctly", async () => {
      const mockAttempt = {
        success: true,
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentSeconds: 65,
            language: "ENGLISH",
            initTime: "2026-03-12",
            endTime: null,
          },
          questions: [
            {
              id: "q-1",
              number: 1,
              text: "Question 1",
              imageUrl: null,
              day: 1,
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue({
        success: true,
        data: { attempt: mockAttempt.data.attempt },
      });
      (attemptExamService.getLatestAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      // wait for the attempt to be loaded (this also sets the timer reference)
      await waitFor(() => {
        expect(result.current.currentAttempt).toBeDefined();
      });

      // advance the interval so updateTimeDisplay runs after the ref is set
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(result.current.time).toBeDefined();
      });

      expect(result.current.time).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe("Progress", () => {
    it("should calculate progress correctly", async () => {
      const mockAttempt = {
        success: true,
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentSeconds: 0,
            language: "ENGLISH",
            initTime: "2026-03-12",
            endTime: null,
          },
          questions: [
            {
              id: "q-1",
              number: 1,
              text: "Question 1",
              imageUrl: null,
              day: 1,
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: "a-1",
            },
            {
              id: "q-2",
              number: 2,
              text: "Question 2",
              imageUrl: null,
              day: 1,
              alternatives: [{ id: "a-2", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
            {
              id: "q-3",
              number: 3,
              text: "Question 3",
              imageUrl: null,
              day: 1,
              alternatives: [{ id: "a-3", letter: "A", text: "Option A" }],
              selectedAlternativeId: "a-3",
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue({
        success: true,
        data: { attempt: mockAttempt.data.attempt },
      });
      (attemptExamService.getLatestAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.progress.current).toBe(2);
        expect(result.current.progress.total).toBe(3);
      });
    });
  });
});
