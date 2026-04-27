import { Exam } from "@/types/exam.types";
import { useEffect, useState } from "react";

interface UseExamsResult {
  exams: Exam[];
  loading: boolean;
  error: string | null;
}

export function useExams(): UseExamsResult {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExams() {
      try {
        setLoading(true);

        // ⏳ simula delay da API
        await new Promise((resolve) => setTimeout(resolve, 800));

        // ✅ MOCK TOTALMENTE COMPATÍVEL COM Exam e ExamDay
        const mockExams: Exam[] = [
          {
            id: "exam-1",
            name: "Simulado ENEM 2024",
            origin: "ORIGINAL",
            imageUrl: null,
            status: "available",
            totalQuestions: 180,
            answeredQuestions: 0,
            progress: {
              answered: 0,
              total: 180,
              percentage: 0,
            },
            hasLanguageChoice: true,
            days: [
              {
                examDayId: "day-1",
                day: 1,
                totalQuestions: 90,
                answeredQuestions: 0,
                status: "available",
                isCompleted: false,
              },
              {
                examDayId: "day-2",
                day: 2,
                totalQuestions: 90,
                answeredQuestions: 0,
                status: "available",
                isCompleted: false,
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
            answeredQuestions: 20,
            progress: {
              answered: 20,
              total: 60,
              percentage: 33,
            },
            hasLanguageChoice: false,
            days: [
              {
                examDayId: "day-unique",
                day: 1,
                totalQuestions: 60,
                answeredQuestions: 20,
                status: "in_progress",
                isCompleted: false,
                attemptDayId: "attempt-123",
              },
            ],
          },
        ];

        setExams(mockExams);
        setError(null);
      } catch (err) {
        console.log("❌ ERRO MOCK EXAMS:", err);
        setError("Erro ao carregar simulados");
        setExams([]);
      } finally {
        setLoading(false);
      }
    }

    fetchExams();
  }, []);

  return { exams, loading, error };
}
