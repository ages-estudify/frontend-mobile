import { useState, useEffect } from "react";
import { Exam } from "@/types/exam.types";
import { api } from "@/services/api";

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
        const response = await api.get("/exams");
        setExams(response.data.data || []);
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

  return { exams, loading, error };
}
