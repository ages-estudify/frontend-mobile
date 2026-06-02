import { Exam } from "@/types/exam.types";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useExams } from "./useExams";

// useExams calls getExams() on mount. We mock the service so the hook resolves with
// deterministic fixture data instead of hitting the real API/axios layer.
jest.mock("@/services/exam/exam.service", () => ({
  getExams: jest.fn(),
}));

import { getExams } from "@/services/exam/exam.service";

const mockGetExams = getExams as jest.MockedFunction<typeof getExams>;

function buildExams(): Exam[] {
  return [
    {
      id: "exam-in-progress",
      name: "Simulado em andamento",
      origin: "ORIGINAL",
      status: "in_progress",
      totalQuestions: 20,
      answeredQuestions: 10,
      progress: { answered: 10, total: 20, percentage: 50 },
      hasLanguageChoice: false,
      days: [
        {
          examDayId: "d1",
          day: 1,
          totalQuestions: 20,
          answeredQuestions: 10,
          status: "in_progress",
          isCompleted: false,
          attemptDayId: "attempt-1",
        },
      ],
    },
    {
      id: "exam-available",
      name: "Simulado disponível",
      origin: "ORIGINAL",
      status: "available",
      totalQuestions: 30,
      answeredQuestions: 0,
      progress: { answered: 0, total: 30, percentage: 0 },
      hasLanguageChoice: false,
      days: [
        {
          examDayId: "d2",
          day: 1,
          totalQuestions: 30,
          answeredQuestions: 0,
          status: "available",
          isCompleted: false,
        },
      ],
    },
    {
      id: "exam-completed",
      name: "Simulado concluído",
      origin: "EXTERNAL",
      status: "completed",
      totalQuestions: 40,
      answeredQuestions: 40,
      progress: { answered: 40, total: 40, percentage: 100 },
      hasLanguageChoice: false,
      days: [
        {
          examDayId: "d3",
          day: 1,
          totalQuestions: 40,
          answeredQuestions: 40,
          status: "completed",
          isCompleted: true,
          attemptDayId: "attempt-3",
        },
      ],
    },
  ];
}

describe("useExams", () => {
  beforeEach(() => {
    mockGetExams.mockResolvedValue(buildExams());
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("começa com loading=true e exams vazio", () => {
    const { result } = renderHook(() => useExams());
    expect(result.current.loading).toBe(true);
    expect(result.current.exams).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("carrega os exams após o fetch", async () => {
    const { result } = renderHook(() => useExams());

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.exams.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it("retorna exams com os campos obrigatórios", async () => {
    const { result } = renderHook(() => useExams());

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const exam = result.current.exams[0];
    expect(exam).toHaveProperty("id");
    expect(exam).toHaveProperty("name");
    expect(exam).toHaveProperty("status");
    expect(exam).toHaveProperty("progress");
    expect(exam.progress).toHaveProperty("percentage");
    expect(exam).toHaveProperty("days");
  });

  it("retorna exams com todos os status esperados", async () => {
    const { result } = renderHook(() => useExams());

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const statuses = result.current.exams.map((e) => e.status);
    expect(statuses).toContain("available");
    expect(statuses).toContain("in_progress");
    expect(statuses).toContain("completed");
  });

  it("retryExam reseta o exam corretamente", async () => {
    const { result } = renderHook(() => useExams());

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const completedExam = result.current.exams.find((e) => e.status === "completed");
    expect(completedExam).toBeDefined();

    act(() => {
      result.current.retryExam(completedExam!.id);
    });

    const resetted = result.current.exams.find((e) => e.id === completedExam!.id);
    expect(resetted!.status).toBe("available");
    expect(resetted!.answeredQuestions).toBe(0);
    expect(resetted!.progress.percentage).toBe(0);
    expect(resetted!.days.every((d) => d.status === "available")).toBe(true);
    expect(resetted!.days.every((d) => d.isCompleted === false)).toBe(true);
    expect(resetted!.days.every((d) => d.attemptDayId === undefined)).toBe(true);
  });

  it("retryExam não altera outros exams", async () => {
    const { result } = renderHook(() => useExams());

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const completedExam = result.current.exams.find((e) => e.status === "completed")!;
    const otherStatuses = result.current.exams
      .filter((e) => e.id !== completedExam.id)
      .map((e) => ({ id: e.id, status: e.status }));

    act(() => {
      result.current.retryExam(completedExam.id);
    });

    otherStatuses.forEach(({ id, status }) => {
      const current = result.current.exams.find((e) => e.id === id);
      expect(current?.status).toBe(status);
    });
  });
});
