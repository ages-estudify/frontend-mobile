import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useExams } from "../../hooks/useExams";

describe("useExams", () => {
  beforeEach(() => {
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
