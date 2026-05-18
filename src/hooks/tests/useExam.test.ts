import { useExam } from "@/hooks/useExam";
import { useStreak } from "@/hooks/useStreak";
import { attemptExamService } from "@/services/attemptExam.service";
import { act, renderHook, waitFor } from "@testing-library/react-native";

jest.mock("@/services/attemptExam.service");
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
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentMinutes: 0,
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
              day: "1",
              alternatives: [
                { id: "a-1", letter: "A", text: "Option A" },
                { id: "a-2", letter: "B", text: "Option B" },
              ],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentAttempt).toBeDefined();
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
        data: {
          attempt: {
            id: "attempt-456",
            examId: "exam-123",
            currentQuestion: 5,
            timeSpentMinutes: 25,
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
              day: "1",
              alternatives: [{ id: `a-${i}-1`, letter: "A", text: "Option A" }],
              selectedAlternativeId: i < 3 ? `a-${i}-1` : null,
            })),
        },
      };

      (attemptExamService.getLatestAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentAttempt).toBeDefined();
      });

      expect(result.current.currentAttempt?.attempt.timeSpentMinutes).toBe(25);
    });
  });

  describe("submitAnswer", () => {
    it("should submit answer with attemptId", async () => {
      const mockAttempt = {
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentMinutes: 0,
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
              day: "1",
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue(mockAttempt);
      (attemptExamService.submitAnswer as jest.Mock).mockResolvedValue({
        data: { saved: true, streakDays: 4, streakActive: true },
      });

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentAttempt).toBeDefined();
      });

      act(() => {
        result.current.submitAnswer({
          questionId: "q-1",
          selectedAnswer: "A",
          attemptId: "attempt-123",
        });
      });

      expect(attemptExamService.submitAnswer).toHaveBeenCalledWith("q-1", {
        selectedAnswer: "A",
        attemptId: "attempt-123",
      });
      expect(mockedUseStreak().updateStreak).toHaveBeenCalledWith({
        streakDays: 4,
        streakActive: true,
      });
    });
  });

  describe("pauseAttempt", () => {
    it("should pause attempt with timeSpentMinutes", async () => {
      const mockAttempt = {
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentMinutes: 0,
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
              day: "1",
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue(mockAttempt);
      (attemptExamService.pauseAttempt as jest.Mock).mockResolvedValue({
        data: {
          attemptId: "attempt-123",
          timeSpentMinutes: 25.5,
          currentQuestion: 1,
        },
      });

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentAttempt).toBeDefined();
      });

      act(() => {
        result.current.pauseAttempt({
          attemptId: "attempt-123",
          timeSpentMinutes: 25.5,
        });
      });

      expect(attemptExamService.pauseAttempt).toHaveBeenCalledWith("attempt-123", {
        timeSpentMinutes: 25.5,
      });
    });
  });

  describe("finishAttempt", () => {
    it("should finish attempt and return result", async () => {
      const mockAttempt = {
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentMinutes: 0,
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
              day: "1",
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: "a-1",
            },
          ],
        },
      };

      const mockResult = {
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

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue(mockAttempt);
      (attemptExamService.finishAttempt as jest.Mock).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentAttempt).toBeDefined();
      });

      const finishResult = await act(async () => {
        return result.current.finishAttempt({
          attemptId: "attempt-123",
          timeSpentMinutes: 53.3,
        });
      });

      expect(attemptExamService.finishAttempt).toHaveBeenCalledWith("attempt-123", {
        timeSpentMinutes: 53.3,
      });
      expect(finishResult.data.score).toBe(30);
    });
  });

  describe("Navigation", () => {
    it("should navigate to next question", async () => {
      const mockAttempt = {
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentMinutes: 0,
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
              day: "1",
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
            {
              id: "q-2",
              number: 2,
              text: "Question 2",
              imageUrl: null,
              day: "1",
              alternatives: [{ id: "a-2", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentQuestion).toBeDefined();
      });

      act(() => {
        result.current.nextQuestion(null);
      });

      expect(result.current.currentQuestion?.id).toBe("q-2");
    });

    it("should navigate to previous question", async () => {
      const mockAttempt = {
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentMinutes: 0,
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
              day: "1",
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
            {
              id: "q-2",
              number: 2,
              text: "Question 2",
              imageUrl: null,
              day: "1",
              alternatives: [{ id: "a-2", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentQuestion).toBeDefined();
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
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentMinutes: 0,
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
              day: "1",
              alternatives: [{ id: `a-${i}`, letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            })),
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.currentQuestion).toBeDefined();
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
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentMinutes: 0,
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
              day: "1",
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.time).toBeDefined();
      });

      expect(result.current.time).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe("Progress", () => {
    it("should calculate progress correctly", async () => {
      const mockAttempt = {
        data: {
          attempt: {
            id: "attempt-123",
            examId: "exam-123",
            currentQuestion: 1,
            timeSpentMinutes: 0,
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
              day: "1",
              alternatives: [{ id: "a-1", letter: "A", text: "Option A" }],
              selectedAlternativeId: "a-1",
            },
            {
              id: "q-2",
              number: 2,
              text: "Question 2",
              imageUrl: null,
              day: "1",
              alternatives: [{ id: "a-2", letter: "A", text: "Option A" }],
              selectedAlternativeId: null,
            },
            {
              id: "q-3",
              number: 3,
              text: "Question 3",
              imageUrl: null,
              day: "1",
              alternatives: [{ id: "a-3", letter: "A", text: "Option A" }],
              selectedAlternativeId: "a-3",
            },
          ],
        },
      };

      (attemptExamService.createAttempt as jest.Mock).mockResolvedValue(mockAttempt);

      const { result } = renderHook(() => useExam());

      await waitFor(() => {
        expect(result.current.progress.current).toBe(2);
        expect(result.current.progress.total).toBe(3);
      });
    });
  });
});
