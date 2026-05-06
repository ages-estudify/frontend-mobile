import { endPoints } from "@/routes/endpoints";
import api from "@/services/api";
import { attemptExamService } from "@/services/attemptExam.service";

jest.mock("@/services/api");

describe("attemptExamService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createAttempt", () => {
    it("should create a new attempt with language", async () => {
      const mockResponse = {
        success: true,
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

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await attemptExamService.createAttempt("exam-123", {
        language: "ENGLISH",
      });

      expect(api.post).toHaveBeenCalledWith(endPoints.exams.attempts("exam-123"), {
        language: "ENGLISH",
      });
      expect(result.data.attempt.id).toBe("attempt-123");
    });

    it("should handle create attempt error", async () => {
      const error = new Error("Network error");
      (api.post as jest.Mock).mockRejectedValue(error);

      await expect(
        attemptExamService.createAttempt("exam-123", { language: "ENGLISH" })
      ).rejects.toThrow("Network error");
    });
  });

  describe("getLatestAttempt", () => {
    it("should fetch the latest attempt", async () => {
      const mockResponse = {
        success: true,
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

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await attemptExamService.getLatestAttempt("exam-123");

      expect(api.get).toHaveBeenCalledWith(endPoints.exams.latestAttempt("exam-123"));
      expect(result.data.attempt.currentQuestion).toBe(5);
      expect(result.data.questions.length).toBe(45);
    });

    it("should handle get latest attempt error", async () => {
      const error = new Error("Attempt not found");
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(attemptExamService.getLatestAttempt("exam-123")).rejects.toThrow(
        "Attempt not found"
      );
    });
  });

  describe("submitAnswer", () => {
    it("should submit answer with attemptId", async () => {
      const mockResponse = {
        success: true,
        data: {
          saved: true,
        },
      };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await attemptExamService.submitAnswer("q-1", {
        selectedAnswer: "A",
        attemptId: "attempt-123",
      });

      expect(api.post).toHaveBeenCalledWith(endPoints.questions.answer("q-1"), {
        selectedAnswer: "A",
        attemptId: "attempt-123",
      });
      expect(result.data.saved).toBe(true);
    });

    it("should handle submit answer error", async () => {
      const error = new Error("Invalid answer");
      (api.post as jest.Mock).mockRejectedValue(error);

      await expect(
        attemptExamService.submitAnswer("q-1", {
          selectedAnswer: "A",
          attemptId: "attempt-123",
        })
      ).rejects.toThrow("Invalid answer");
    });
  });

  describe("pauseAttempt", () => {
    it("should pause attempt with timeSpentMinutes", async () => {
      const mockResponse = {
        success: true,
        data: {
          attemptId: "attempt-123",
          timeSpentMinutes: 25.5,
          currentQuestion: 5,
        },
      };

      (api.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await attemptExamService.pauseAttempt("attempt-123", {
        timeSpentMinutes: 25.5,
      });

      expect(api.patch).toHaveBeenCalledWith(endPoints.exams.pauseAttempt("attempt-123"), {
        timeSpentMinutes: 25.5,
      });
      expect(result.data.timeSpentMinutes).toBe(25.5);
    });

    it("should handle pause attempt error", async () => {
      const error = new Error("Cannot pause attempt");
      (api.patch as jest.Mock).mockRejectedValue(error);

      await expect(
        attemptExamService.pauseAttempt("attempt-123", {
          timeSpentMinutes: 25.5,
        })
      ).rejects.toThrow("Cannot pause attempt");
    });
  });

  describe("finishAttempt", () => {
    it("should finish attempt and return results", async () => {
      const mockResponse = {
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

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await attemptExamService.finishAttempt("attempt-123", {
        timeSpentMinutes: 53.3,
      });

      expect(api.post).toHaveBeenCalledWith(endPoints.exams.finishAttempt("attempt-123"), {
        timeSpentMinutes: 53.3,
      });
      expect(result.data.score).toBe(30);
      expect(result.data.resultBySubject.length).toBe(1);
    });

    it("should handle finish attempt error", async () => {
      const error = new Error("Cannot finish attempt");
      (api.post as jest.Mock).mockRejectedValue(error);

      await expect(
        attemptExamService.finishAttempt("attempt-123", {
          timeSpentMinutes: 53.3,
        })
      ).rejects.toThrow("Cannot finish attempt");
    });
  });
});
