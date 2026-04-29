import { Exam } from "@/types/exam.types";
import { useEffect, useState } from "react";

interface UseExamsResult {
  exams: Exam[];
  loading: boolean;
  error: string | null;
  retryExam: (examId: string) => void;
}

export function useExams(): UseExamsResult {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function resetExam(exam: Exam): Exam {
    return {
      ...exam,
      status: "available",
      answeredQuestions: 0,
      progress: {
        answered: 0,
        total: exam.totalQuestions,
        percentage: 0,
      },
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

  useEffect(() => {
    async function fetchExams() {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockExams: Exam[] = [
          {
            id: "exam-1",
            name: "Simulado ENEM 2024",
            origin: "ORIGINAL",
            description: "Novembro: Dia 1 - Linguagens, Humanas e Redação",
            imageUrl: null,
            status: "available",
            totalQuestions: 180,
            answeredQuestions: 180,
            progress: {
              answered: 180,
              total: 180,
              percentage: 100,
            },
            hasLanguageChoice: true,
            days: [
              {
                examDayId: "day-1",
                day: 1,
                totalQuestions: 90,
                answeredQuestions: 90,
                status: "completed",
                isCompleted: true,
              },
              {
                examDayId: "day-2",
                day: 2,
                totalQuestions: 90,
                answeredQuestions: 90,
                status: "completed",
                isCompleted: true,
              },
            ],
          },
          {
            id: "exam-2",
            name: "Simulado Vestibular",
            origin: "EXTERNAL",
            imageUrl: null,
            status: "in_progress",
            totalQuestions: 60,
            answeredQuestions: 60,
            progress: {
              answered: 30,
              total: 60,
              percentage: 50,
            },
            hasLanguageChoice: false,
            days: [
              {
                examDayId: "day-unique",
                day: 1,
                totalQuestions: 60,
                answeredQuestions: 60,
                status: "in_progress",
                isCompleted: false,
                attemptDayId: "attempt-123",
              },
            ],
          },
          {
            id: "exam-3",
            name: "Simulado ENEM 2023",
            origin: "ORIGINAL",
            description: "Novembro: Dia 1 - Linguagens, Humanas e Redação",
            imageUrl: null,
            status: "available",
            totalQuestions: 180,
            answeredQuestions: 180,
            progress: {
              answered: 180,
              total: 180,
              percentage: 100,
            },
            hasLanguageChoice: true,
            days: [
              {
                examDayId: "day-1",
                day: 1,
                totalQuestions: 90,
                answeredQuestions: 90,
                status: "completed",
                isCompleted: true,
              },
              {
                examDayId: "day-2",
                day: 2,
                totalQuestions: 90,
                answeredQuestions: 90,
                status: "completed",
                isCompleted: true,
              },
            ],
          },
        ];

        setExams(mockExams);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar simulados");
        setExams([]);
      } finally {
        setLoading(false);
      }
    }

    fetchExams();
  }, []);

  return { exams, loading, error, retryExam };
}
