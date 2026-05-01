import { getExams } from "@/services/exam.service";
import { Exam } from "@/types/exam.types";
import { useEffect, useState } from "react";

interface UseExamsResult {
  exams: Exam[];
  loading: boolean;
  error: string | null;
  retryExam: (examId: string) => void;
  refresh: () => void;
}

export function useExams(): UseExamsResult {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function resetExam(exam: Exam): Exam {
    return {
      ...exam,
      status: "available",
      answeredQuestions: 0,
      progress: { answered: 0, total: exam.totalQuestions, percentage: 0 },
      days: exam.days.map((day) => ({
        ...day,
        answeredQuestions: 0,
        status: "available",
        isCompleted: false,
        attemptDayId: undefined,
      })),
    };
  }

  function retryExam(examId: string) {
    setExams((prev) => prev.map((exam) => (exam.id === examId ? resetExam(exam) : exam)));
  }

  function refresh() {
    setRefreshTrigger((n) => n + 1);
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getExams(); // ← API real
        if (!cancelled) setExams(data);
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Erro ao carregar simulados");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshTrigger]);

  return { exams, loading, error, retryExam, refresh };
}
